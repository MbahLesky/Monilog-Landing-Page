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
import { getFirebaseAuth } from '../lib/firebase';
import { storeTester, getBetaCodeInfo } from '../lib/firestore-testers';

const APK_DOWNLOAD_URL = '/downloads/monilog-v1_1-release.apk';
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

function triggerApkDownload() {
  const link = document.createElement('a');
  link.href = APK_DOWNLOAD_URL;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const [authIntent, setAuthIntent] = useState(null);

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

  // Called by the modal after a successful auth action. Resolves any pending
  // intent (e.g. the download the user was gated on) and optionally keeps the
  // modal open — sign-up keeps it open to show the "verify your email" note.
  const finishAuth = useCallback(
    ({ keepOpen = false } = {}) => {
      if (authIntent === 'download') triggerApkDownload();
      setAuthIntent(null);
      if (!keepOpen) setIsAuthModalOpen(false);
    },
    [authIntent]
  );

  const signUp = useCallback(async ({ name, email, password }) => {
    const auth = requireAuth();
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(newUser, { displayName: name });
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

  const signInWithGoogle = useCallback(
    () => signInWithPopup(requireAuth(), new GoogleAuthProvider()),
    []
  );

  const signInWithGoogleCredential = useCallback((idToken) => {
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
