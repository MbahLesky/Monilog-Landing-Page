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

const APK_DOWNLOAD_URL = '/downloads/monilog-v1_1-release.apk';

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
    await sendEmailVerification(newUser);
    return newUser;
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

  const value = {
    user,
    loading,
    isAuthModalOpen,
    authModalMode,
    authIntent,
    openAuthModal,
    closeAuthModal,
    finishAuth,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGoogleCredential,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
