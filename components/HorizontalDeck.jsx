'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, useInView } from 'framer-motion';
import { useIsDesktop, usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { useFullPageScroll } from './FullPageScroll';

const SPRING = { type: 'spring', stiffness: 260, damping: 30 };
const GAP = 24; // px, matches Tailwind gap-6 on the track

export default function HorizontalDeck({ slideId, items, renderCard, ariaLabel }) {
  const isDesktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const { activeId } = useFullPageScroll();
  const isActive = activeId === slideId;

  const viewportRef = useRef(null);
  const inView = useInView(viewportRef, { amount: 0.3, once: true });
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState({ cardStep: 0, cardWidth: 0, containerWidth: 0 });
  const x = useMotionValue(0);

  const clamp = useCallback((i) => Math.max(0, Math.min(items.length - 1, i)), [items.length]);
  const go = useCallback((i) => setIndex(() => clamp(i)), [clamp]);
  const next = useCallback(() => setIndex((p) => clamp(p + 1)), [clamp]);
  const prev = useCallback(() => setIndex((p) => clamp(p - 1)), [clamp]);

  // Measure card + container width (desktop deck only).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !isDesktop) return;
    const measure = () => {
      const firstCard = viewport.querySelector('[data-card]');
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      setMetrics({ cardWidth, cardStep: cardWidth + GAP, containerWidth: viewport.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [isDesktop, items.length]);

  const targetX = useCallback(
    (i) => {
      const { cardStep, cardWidth, containerWidth } = metrics;
      const centerOffset = (containerWidth - cardWidth) / 2;
      return centerOffset - i * cardStep;
    },
    [metrics]
  );

  // Animate the track to the active card whenever index or metrics change.
  useEffect(() => {
    if (!isDesktop || metrics.cardStep === 0) return;
    const controls = animate(x, targetX(index), reduce ? { duration: 0 } : SPRING);
    return controls.stop;
  }, [index, targetX, isDesktop, reduce, x, metrics.cardStep]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    },
    [next, prev]
  );

  // Hybrid wheel capture: while this deck is the active slide, translate vertical
  // wheel intent into horizontal card movement — but release at the ends so the
  // page can snap to the neighboring slide.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !isDesktop || reduce) return;

    let acc = 0;
    let cooldown = false;
    const THRESHOLD = 40;

    const onWheel = (e) => {
      if (!isActive) return;
      const delta = e.deltaY;
      const atStart = index === 0;
      const atEnd = index === items.length - 1;
      // Let the page scroll (vertical snap) when pushing past an end.
      if ((atStart && delta < 0) || (atEnd && delta > 0)) return;
      e.preventDefault();
      if (cooldown) return;
      acc += delta;
      if (Math.abs(acc) >= THRESHOLD) {
        if (acc > 0) next(); else prev();
        acc = 0;
        cooldown = true;
        setTimeout(() => { cooldown = false; }, 350);
      }
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [isDesktop, reduce, isActive, index, items.length, next, prev]);

  const onDragEnd = (_e, info) => {
    if (metrics.cardStep === 0) return;
    const moved = -info.offset.x / metrics.cardStep;
    const velocityBias = info.velocity.x < -300 ? 1 : info.velocity.x > 300 ? -1 : 0;
    go(index + Math.round(moved) + velocityBias);
  };

  // --- Mobile / coarse pointer: native scroll-snap carousel ---
  if (!isDesktop) {
    return (
      <div
        ref={viewportRef}
        role="group"
        aria-label={ariaLabel}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4"
      >
        {items.map((item, i) => (
          <div key={i} data-card className="w-[82%] shrink-0 snap-center sm:w-[46%]">
            {renderCard(item, i, { isCurrent: true })}
          </div>
        ))}
      </div>
    );
  }

  // --- Desktop: JS-controlled flip deck ---
  return (
    <div
      className="relative w-full focus:outline-none"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      <div ref={viewportRef} className="w-full overflow-hidden">
        <motion.div
          className="flex gap-6"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: targetX(items.length - 1), right: targetX(0) }}
          dragElastic={0.08}
          onDragEnd={onDragEnd}
        >
          {items.map((item, i) => {
            const distance = Math.abs(i - index);
            const scale = reduce ? 1 : Math.max(0.86, 1 - distance * 0.07);
            const opacity = reduce ? 1 : Math.max(0.4, 1 - distance * 0.26);
            return (
              <motion.div
                key={i}
                data-card
                className="w-[340px] shrink-0 sm:w-[380px] lg:w-[420px]"
                animate={{
                  scale,
                  opacity: reduce ? 1 : (inView ? opacity : 0),
                  y: reduce ? 0 : (inView ? 0 : 28)
                }}
                transition={reduce ? { duration: 0 } : { ...SPRING, delay: inView ? Math.min(i, 6) * 0.05 : 0 }}
              >
                {renderCard(item, i, { isCurrent: i === index })}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous"
        className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-2xl text-slate-100 shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-25"
      >
        &#8249;
      </button>
      <button
        type="button"
        onClick={next}
        disabled={index === items.length - 1}
        aria-label="Next"
        className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-2xl text-slate-100 shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-25"
      >
        &#8250;
      </button>

      <div className="mt-8 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to item ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-2 bg-slate-600 hover:bg-slate-500'}`}
          />
        ))}
      </div>
    </div>
  );
}
