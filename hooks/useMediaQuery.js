'use client';

import { useEffect, useState } from 'react';

// SSR-safe: returns false during SSR and the first client render, then
// updates after mount so we never diverge from server HTML (no hydration flash
// that changes DOM structure — callers only toggle styling/behavior).
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// Desktop = wide enough AND a precise pointer. Gates snap, wheel capture, parallax.
export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px) and (pointer: fine)');
}

// Hydration-safe reduced-motion signal. Unlike framer-motion's useReducedMotion
// (which reads matchMedia during render and so returns true on the client's
// first render while the server returns false — a hydration mismatch), this
// returns false on the server AND the first client render, then updates after
// mount. Callers must therefore render the animated tree on first paint.
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
