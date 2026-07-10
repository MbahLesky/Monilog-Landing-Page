'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';

const ScrollContext = createContext(null);

export function useFullPageScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useFullPageScroll must be used within <FullPageScrollProvider>');
  return ctx;
}

export function FullPageScrollProvider({ children }) {
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Track which slide is centered in the viewport.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const slides = Array.from(container.querySelectorAll('[data-slide]'));
    if (slides.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.getAttribute('data-slide'));
        });
      },
      { root: container, threshold: 0.5 }
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <ScrollContext.Provider value={{ containerRef, activeId, scrollYProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function ScrollViewport({ children, className = '' }) {
  const { containerRef } = useFullPageScroll();
  return (
    <main ref={containerRef} className={`snap-container bg-slate-950 text-slate-100 ${className}`}>
      {children}
    </main>
  );
}
