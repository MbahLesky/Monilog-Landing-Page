'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirebaseAuth, trackFirebaseEvent } from '../lib/firebase';
import { storeTester, getBetaCodeInfo, getTester, recordAgreementAcceptance } from '../lib/firestore-testers';
import { AGREEMENT_VERSION } from '../lib/betaAgreement';

const APK_DOWNLOAD_URL = '/downloads/Monilog-v1.2.1.apk';
const WEB_APP_URL = 'https://monilog-web.vercel.app';
const BETA_CODE_STORAGE_KEY = 'monilog:betaCode';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

// Resolves the browser auth instance, or throws a mappable error when Firebase
// hasn't been configured yet (missing env vars).
function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    const error = new Error('Firebase Auth is not configured.');
    error.code = 'auth/not-initialized';
    throw error;
  }
  return auth;
}

function normalizeCode(code) {
  return typeof code === 'string' && code.trim() ? code.trim().toUpperCase() : null;
}

// Best-effort read of the signed-in tester's acceptance. Returns false when the
// doc is missing or unreadable — callers treat that as "needs to sign", which is
// the safe direction: re-accepting is idempotent.
async function hasAcceptedAgreement() {
  const auth = getFirebaseAuth();
  const current = auth?.currentUser;
  if (!current) return false;
  try {
    const tester = await getTester(current.uid);
    return tester?.agreement?.version === AGREEMENT_VERSION;
  } catch {
    return false;
  }
}

function triggerApkDownload(source) {
  const link = document.createElement('a');
  link.href = APK_DOWNLOAD_URL;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  trackFirebaseEvent('download', { source });
}

function triggerWebAppAccess(source) {
  trackFirebaseEvent('webapp_open', { source });
  window.open(WEB_APP_URL, '_blank', 'noopener,noreferrer');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const [authIntent, setAuthIntent] = useState(null);

  // Beta agreement gate: 'unknown' until the tester doc has been read, then
  // 'pending' | 'accepted'. Only 'pending' blocks a download — 'unknown' means
  // we could not read the doc, and an outage must not lock testers out.
  const [agreementStatus, setAgreementStatus] = useState('unknown');
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  // Set when the agreement interrupted a gated action (download or web app
  // access), so accepting resumes it. null | 'download' | 'webapp'.
  const [pendingAction, setPendingAction] = useState(null);
  // Queues the agreement until the auth modal is out of the way (a fresh sign-up
  // keeps that modal open to show the "verify your email" note).
  const [agreementPromptPending, setAgreementPromptPending] = useState(false);

  // A referral code carried in on the URL (e.g. /?code=LEADERS). Seeds the code
  // field and lets One Tap auto-attribute. Persisted for the session so it
  // survives reloads and the Google popup. Codes are optional — a blank one just
  // registers a general tester.
  const [urlCode, setUrlCode] = useState('');

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return undefined;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Resolve whether the signed-in tester has accepted the current agreement.
  // A read failure leaves the status 'unknown', which fails open on download —
  // we never want a Firestore outage to block testers from the APK.
  useEffect(() => {
    if (!user) {
      setAgreementStatus('unknown');
      return undefined;
    }

    let cancelled = false;
    getTester(user.uid)
      .then((tester) => {
        if (cancelled) return;
        const accepted = tester?.agreement?.version === AGREEMENT_VERSION;
        setAgreementStatus(accepted ? 'accepted' : 'pending');
      })
      .catch(() => {
        if (!cancelled) setAgreementStatus('unknown');
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Capture a referral code from the URL / session on first load.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromUrl = new URLSearchParams(window.location.search).get('code');
    const stored = window.sessionStorage.getItem(BETA_CODE_STORAGE_KEY);
    const code = normalizeCode(fromUrl || stored || '');
    if (code) {
      setUrlCode(code);
      window.sessionStorage.setItem(BETA_CODE_STORAGE_KEY, code);
    }
  }, []);

  const openAuthModal = useCallback(({ mode = 'signin', intent = null } = {}) => {
    setAuthModalMode(mode);
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthIntent(null);
  }, []);

  const openAgreement = useCallback(({ thenAction = null } = {}) => {
    setPendingAction(thenAction);
    setIsAgreementOpen(true);
    trackFirebaseEvent('agreement_shown', { version: AGREEMENT_VERSION });
  }, []);

  // Present a queued agreement only once the auth modal has closed, so the two
  // dialogs never stack on top of each other.
  useEffect(() => {
    if (!agreementPromptPending || isAuthModalOpen) return;
    setAgreementPromptPending(false);
    setIsAgreementOpen(true);
    trackFirebaseEvent('agreement_shown', { version: AGREEMENT_VERSION });
  }, [agreementPromptPending, isAuthModalOpen]);

  // Closing without accepting leaves the gate in place — the tester is simply
  // re-prompted the next time they try to download.
  const closeAgreement = useCallback(() => {
    setIsAgreementOpen(false);
    setPendingAction(null);
  }, []);

  // Records acceptance, then resumes a download the agreement interrupted. The
  // Firestore write is best-effort: a failure must not strand a tester who has
  // already ticked the box, so the session proceeds either way.
  const acceptAgreement = useCallback(async () => {
    const auth = getFirebaseAuth();
    const current = auth?.currentUser;
    if (current) {
      try {
        await recordAgreementAcceptance(current.uid, {
          version: AGREEMENT_VERSION,
          name: current.displayName || ''
        });
      } catch (error) {
        console.error('Failed to record agreement acceptance:', error);
      }
    }

    trackFirebaseEvent('agreement_accepted', { version: AGREEMENT_VERSION });
    setAgreementStatus('accepted');
    setIsAgreementOpen(false);
    if (pendingAction === 'download') triggerApkDownload('agreement');
    if (pendingAction === 'webapp') triggerWebAppAccess('agreement');
    setPendingAction(null);
  }, [pendingAction]);

  // Single gate every download button routes through: track the click, then send
  // the tester wherever they still need to go — sign up, sign the agreement, or
  // straight to the APK.
  const requestDownload = useCallback(
    (event, { location = 'unknown' } = {}) => {
      trackFirebaseEvent('download_click', { location });

      if (!user) {
        event?.preventDefault();
        openAuthModal({ mode: 'signup', intent: 'download' });
        return;
      }
      if (agreementStatus === 'pending') {
        event?.preventDefault();
        openAgreement({ thenAction: 'download' });
      }
      // 'accepted' (and 'unknown', which fails open) let the anchor download.
    },
    [user, agreementStatus, openAuthModal, openAgreement]
  );

  // Same gate as requestDownload, routing to the web app instead of the APK.
  const requestWebAppAccess = useCallback(
    (event, { location = 'unknown' } = {}) => {
      trackFirebaseEvent('webapp_click', { location });

      if (!user) {
        event?.preventDefault();
        openAuthModal({ mode: 'signin', intent: 'webapp' });
        return;
      }
      if (agreementStatus === 'pending') {
        event?.preventDefault();
        openAgreement({ thenAction: 'webapp' });
      }
      // 'accepted' (and 'unknown', which fails open) let the anchor navigate.
    },
    [user, agreementStatus, openAuthModal, openAgreement]
  );

  // Called by the modal after a successful auth action. Resolves any pending
  // intent (e.g. the download the user was gated on) and optionally keeps the
  // modal open — sign-up keeps it open to show the "verify your email" note.
  // A download intent is handed to the agreement gate rather than fired here,
  // so nobody reaches the APK before signing.
  const finishAuth = useCallback(
    async ({ keepOpen = false } = {}) => {
      const wantsDownload = authIntent === 'download';
      const wantsWebApp = authIntent === 'webapp';
      setAuthIntent(null);
      if (!keepOpen) setIsAuthModalOpen(false);

      // Read acceptance fresh rather than trusting `agreementStatus`, which may
      // still be resolving for the user who just signed in. An unreadable doc
      // (new tester, or Firestore down) prompts — accepting again is harmless.
      const accepted = await hasAcceptedAgreement();
      setAgreementStatus(accepted ? 'accepted' : 'pending');

      if (accepted) {
        if (wantsDownload) triggerApkDownload('auth_modal');
        if (wantsWebApp) triggerWebAppAccess('auth_modal');
        return;
      }
      setPendingAction(wantsDownload ? 'download' : wantsWebApp ? 'webapp' : null);
      setAgreementPromptPending(true);
    },
    [authIntent]
  );

  const signUp = useCallback(async ({ name, email, password }) => {
    trackFirebaseEvent('sign_up_started', { method: 'email_password' });

    const auth = requireAuth();
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(newUser, { displayName: name });

    trackFirebaseEvent('sign_up_completed', { method: 'email_password' });
    return newUser;
  }, []);

  // Sent only after a tester is successfully registered, so we never email
  // someone whose account gets rolled back (invalid code / code full).
  const sendVerification = useCallback(async () => {
    const auth = requireAuth();
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  }, []);

  const signIn = useCallback(
    ({ email, password }) => signInWithEmailAndPassword(requireAuth(), email, password),
    []
  );

  const signInWithGoogle = useCallback(async () => {
    trackFirebaseEvent('google_sign_in', { method: 'popup' });
    return signInWithPopup(requireAuth(), new GoogleAuthProvider());
  }, []);

  const signInWithGoogleCredential = useCallback(async (idToken) => {
    trackFirebaseEvent('google_sign_in', { method: 'one_tap' });
    const credential = GoogleAuthProvider.credential(idToken);
    return signInWithCredential(requireAuth(), credential);
  }, []);

  const signOut = useCallback(() => firebaseSignOut(requireAuth()), []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(requireAuth(), email), []);

  // Registers the currently signed-in user as a beta tester. Stores tester data
  // in Firestore with their name, email, phone, and code. Returns the code info
  // (or null if no code was used) so the modal can display it.
  const registerTester = useCallback(async (code, { name = '', email = '', phone = '' } = {}) => {
    const auth = requireAuth();
    const current = auth.currentUser;
    if (!current) {
      const error = new Error('No signed-in user to register.');
      error.code = 'auth/no-current-user';
      throw error;
    }

    const normalizedCode = normalizeCode(code);
    let codeInfo = null;

    // Validate the code if provided.
    if (normalizedCode) {
      codeInfo = await getBetaCodeInfo(normalizedCode);
      if (!codeInfo || !codeInfo.active) {
        return { status: 'invalid_code', code: null };
      }
      // TODO: Enforce per-code tester cap when needed.
      // For now, accept any active code.
    }

    // Store the tester in Firestore.
    try {
      await storeTester(current.uid, {
        name: name || current.displayName || '',
        email: email || current.email || '',
        phone: phone || '',
        code: normalizedCode || ''
      });

      if (normalizedCode) {
        trackFirebaseEvent('beta_code_used', { code: normalizedCode });
      }
    } catch (error) {
      console.error('Failed to store tester:', error);
      return { status: 'error', code: null };
    }

    return {
      status: 'ok',
      code: codeInfo || null
    };
  }, []);

  const fetchBetaStatus = useCallback(async (code) => {
    const normalized = normalizeCode(code);
    const query = normalized ? `?code=${encodeURIComponent(normalized)}` : '';
    const res = await fetch(`/api/beta-status${query}`);
    return res.json();
  }, []);

  const submitWaitlist = useCallback(async (email, code) => {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: normalizeCode(code) })
    });
    return res.json();
  }, []);

  const value = {
    user,
    loading,
    isAuthModalOpen,
    authModalMode,
    authIntent,
    urlCode,
    agreementStatus,
    isAgreementOpen,
    openAgreement,
    closeAgreement,
    acceptAgreement,
    requestDownload,
    requestWebAppAccess,
    webAppUrl: WEB_APP_URL,
    openAuthModal,
    closeAuthModal,
    finishAuth,
    signUp,
    sendVerification,
    signIn,
    signInWithGoogle,
    signInWithGoogleCredential,
    signOut,
    resetPassword,
    registerTester,
    fetchBetaStatus,
    submitWaitlist
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
