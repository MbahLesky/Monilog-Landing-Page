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
