'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useFullPageScroll } from './FullPageScroll';
import { useIsDesktop } from '../hooks/useMediaQuery';

export default function Parallax({ children, strength = 40, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { containerRef } = useFullPageScroll();

  // Progress of this element through the scroll container's viewport (0→1).
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  const active = !reduce && isDesktop;
  return (
    <motion.div ref={ref} style={active ? { y } : undefined} className={className}>
      {children}
    </motion.div>
  );
}
