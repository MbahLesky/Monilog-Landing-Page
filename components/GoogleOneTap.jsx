'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const GSI_SRC = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window unavailable'));
      return;
    }
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('GSI load error')));
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('GSI load error'));
    document.head.appendChild(script);
  });
}

export default function GoogleOneTap() {
  const { user, loading, signInWithGoogleCredential } = useAuth();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID) return undefined; // One Tap not configured
    if (loading) return undefined; // wait until auth state is known

    if (user) {
      // Already signed in — make sure no prompt is showing.
      window.google?.accounts?.id?.cancel();
      return undefined;
    }

    let cancelled = false;

    loadGsiScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        if (!initializedRef.current) {
          window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            auto_select: true,
            cancel_on_tap_outside: false,
            use_fedcm_for_prompt: true,
            callback: async (response) => {
              try {
                await signInWithGoogleCredential(response.credential);
              } catch (error) {
                console.error('Google One Tap sign-in failed', error);
              }
            }
          });
          initializedRef.current = true;
        }
        window.google.accounts.id.prompt();
      })
      .catch((error) => {
        console.error('Failed to load Google Identity Services', error);
      });

    return () => {
      cancelled = true;
    };
  }, [user, loading, signInWithGoogleCredential]);

  return null;
}
