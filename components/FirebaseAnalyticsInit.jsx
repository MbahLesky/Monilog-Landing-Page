'use client';

import { useEffect } from 'react';
import { initializeFirebaseAnalytics } from '../lib/firebase';

/**
 * Starts Firebase Analytics in the browser. It must be a client component: the
 * root layout is a Server Component, so initialization placed there never runs on
 * the client and no session (or automatic page_view) is ever recorded — explicit
 * trackFirebaseEvent calls would each have to bootstrap analytics themselves.
 */
export default function FirebaseAnalyticsInit() {
  useEffect(() => {
    initializeFirebaseAnalytics().catch(() => {
      // Analytics is optional; a blocked or unsupported browser is not an error.
    });
  }, []);

  return null;
}
