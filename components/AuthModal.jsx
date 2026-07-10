'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../lib/authErrors';

const inputClass =
  'w-full rounded-3xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    authIntent,
    closeAuthModal,
    finishAuth,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword
  } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 'idle' | 'submitting' | 'error' | 'signup-success' | 'reset-sent'
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Reset the form whenever the modal (re)opens.
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
      setName('');
      setEmail('');
      setPassword('');
      setStatus('idle');
      setMessage('');
    }
  }, [isAuthModalOpen, authModalMode]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!isAuthModalOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isAuthModalOpen]);

  // ESC to close + focus trap.
  useEffect(() => {
    if (!isAuthModalOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Focus the first field when the form is shown.
  useEffect(() => {
    if (isAuthModalOpen && (status === 'idle' || status === 'error')) {
      firstFieldRef.current?.focus();
    }
  }, [isAuthModalOpen, mode, status]);

  if (!mounted || !isAuthModalOpen) return null;

  const gatedDownload = authIntent === 'download';
  const submitting = status === 'submitting';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (mode === 'signup' && !name.trim()) {
      setStatus('error');
      setMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !password) {
      setStatus('error');
      setMessage('Please enter your email and password.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    try {
      if (mode === 'signup') {
        await signUp({ name: name.trim(), email: email.trim(), password });
        finishAuth({ keepOpen: true }); // start gated download, keep modal for verify note
        setStatus('signup-success');
      } else {
        await signIn({ email: email.trim(), password });
        finishAuth({ keepOpen: false }); // close + gated download
      }
    } catch (error) {
      setStatus('error');
      setMessage(mapAuthError(error.code));
    }
  };

  const handleGoogle = async () => {
    if (submitting) return;
    setStatus('submitting');
    setMessage('');
    try {
      await signInWithGoogle();
      finishAuth({ keepOpen: false });
    } catch (error) {
      setStatus('error');
      setMessage(mapAuthError(error.code));
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setStatus('error');
      setMessage('Enter your email above, then tap Forgot password again.');
      return;
    }
    try {
      await resetPassword(email.trim());
      setStatus('reset-sent');
      setMessage(`Password reset email sent to ${email.trim()}.`);
    } catch (error) {
      setStatus('error');
      setMessage(mapAuthError(error.code));
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setStatus('idle');
    setMessage('');
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  const title = mode === 'signup' ? 'Create your account' : 'Welcome back';
  const subtitle = gatedDownload
    ? 'Register to join the beta and download the app.'
    : mode === 'signup'
      ? 'Join the beta and unlock future benefits.'
      : 'Sign in to your MoniLog account.';

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-soft"
      >
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Close"
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          ✕
        </button>

        {status === 'signup-success' ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl text-primary">
              ✓
            </div>
            <h2 id="auth-modal-title" className="text-2xl font-semibold text-white">
              Account created
            </h2>
            <p className="text-sm leading-7 text-slate-300">
              {`We've sent a verification link to ${email}. You can verify anytime — `}
              {gatedDownload ? 'your download is starting now.' : 'you are all set.'}
            </p>
            <button
              type="button"
              onClick={closeAuthModal}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-2">
              <h2 id="auth-modal-title" className="text-2xl font-semibold text-white">
                {title}
              </h2>
              <p className="text-sm text-slate-400">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-700 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-slate-500">
              <span className="h-px flex-1 bg-slate-800" />
              or
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <label className="block space-y-2 text-sm text-slate-300">
                  <span>Name</span>
                  <input
                    ref={firstFieldRef}
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Email</span>
                <input
                  ref={mode === 'signin' ? firstFieldRef : undefined}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Password</span>
                <input
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                />
              </label>

              {mode === 'signin' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-primary transition hover:opacity-80"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Please wait…'
                  : mode === 'signup'
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 text-sm ${status === 'reset-sent' ? 'text-primary' : 'text-rose-400'}`}
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-400">
              {mode === 'signup' ? 'Already have an account?' : 'New to MoniLog?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-primary transition hover:opacity-80"
              >
                {mode === 'signup' ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
