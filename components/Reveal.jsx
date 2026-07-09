'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.06 }
  })
};

export function Reveal({ as = 'div', children, className = '', delay = 0, amount = 0.4 }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </MotionTag>
  );
}

const wordContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } }
};

const wordChild = {
  hidden: { opacity: 0, y: '0.7em' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }
};

// Splits `text` into words; each word rises out of a clipped mask on enter view.
// The inter-word space is a text node between masks so spacing and line
// wrapping are preserved (a trailing space inside an inline-block collapses).
export function RevealHeading({ as = 'h2', text, className = '', amount = 0.5 }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.h2;
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }
  const words = text.split(' ');
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={wordContainer}
      aria-label={text}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom" aria-hidden="true">
            <motion.span className="inline-block will-change-transform" variants={wordChild}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </MotionTag>
  );
}
