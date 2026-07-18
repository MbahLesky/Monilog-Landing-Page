'use client';

import { motion } from 'framer-motion';
import { useFullPageScroll } from './FullPageScroll';

export default function ProgressBar() {
  const { scrollYProgress } = useFullPageScroll();
  return (
    <div className="pointer-events-none h-1 w-full bg-slate-800/60">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-primary to-secondary"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
