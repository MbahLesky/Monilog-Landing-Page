# Full-Page + Horizontal Scroll Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the MoniLog landing page into a full-page vertical-snap experience with hybrid horizontal decks (Features, Screenshots), refined reveal + parallax effects, a bottom progress bar, and desktop-snap / mobile-smooth behavior — preserving all existing content, theme, and the Firebase feedback form.

**Architecture:** A single snap scroll container (`<main>`, `100dvh`, `scroll-snap-type: y`) holds full-screen `Slide`s; header and progress bar are fixed overlays outside it. A React context (`FullPageScrollProvider`) exposes the scroll element ref, scroll progress, and the active slide id to descendants (parallax, progress bar, decks). `framer-motion` drives reveals, parallax, and the `HorizontalDeck` (arrows/drag/swipe/keyboard/dots + desktop wheel capture, native swipe carousel on mobile). No new dependencies.

**Tech Stack:** Next.js 15 (App Router, JSX), React 18, framer-motion 11 (already installed), Tailwind CSS 3, CSS scroll-snap.

## Global Constraints

- **No new dependencies.** Use only what `package.json` already lists (framer-motion 11.0.0, next 15.4.0, react 18.3.1, tailwindcss 3.4.4). Copied verbatim from spec §2 / §9.
- **Preserve content & theme.** No copy rewrite, no color changes, no new sections. Brand colors stay `primary #08D2B5`, `secondary #08867F`, `deepblue #173B7A` (tailwind.config.js).
- **`components/FeedbackForm.jsx` is unchanged** — used as-is. Firebase logic untouched.
- **Effect intensity = Refined/premium** (spec §5): heading reveals ~0.4–0.6s ease-out with ~40ms word stagger; body fade-up translateY 16–24px; parallax travel ±20–40px; deck spring stiffness ~260 / damping ~30.
- **Desktop = `(min-width: 768px) and (pointer: fine)`.** Snap, wheel capture, and parallax are desktop-only; mobile/coarse-pointer gets smooth scroll + native swipe carousels.
- **Honor `prefers-reduced-motion: reduce`:** no parallax, no large reveals (render final state), no snap jank; keyboard/arrow nav still works.
- **Use `100dvh` with `100vh` fallback** to avoid mobile address-bar clipping.
- **No unit-test harness exists and none is added** (spec §8). Verification = `npm run build` clean + scripted manual dev-server checks. Every task ends with a commit.
- All new component files start with `'use client';` (they use hooks / browser APIs).

---

## File Structure

**New files**
- `hooks/useMediaQuery.js` — SSR-safe media-query hook + `useIsDesktop()`.
- `components/FullPageScroll.jsx` — `FullPageScrollProvider` (context: container ref, `activeId`, `scrollYProgress`), `ScrollViewport` (the `<main>` snap container), `useFullPageScroll()` hook.
- `components/Slide.jsx` — full-screen snap slide wrapper.
- `components/ProgressBar.jsx` — fixed bottom progress bar.
- `components/Reveal.jsx` — `Reveal` (fade-up) + `RevealHeading` (word-stagger mask reveal).
- `components/Parallax.jsx` — scroll-linked Y parallax wrapper.
- `components/HorizontalDeck.jsx` — the hybrid deck.

**Modified files**
- `app/globals.css` — snap container utilities, `dvh`, body/html scroll ownership, reduced-motion rules.
- `app/page.jsx` — recompose sections into provider + slides + decks + tail (content preserved).

---

## Task 1: Foundation — media hook + global scroll CSS

**Files:**
- Create: `hooks/useMediaQuery.js`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `useMediaQuery(query: string): boolean`, `useIsDesktop(): boolean` (true when `(min-width: 768px) and (pointer: fine)`).
- Produces (CSS classes): `.snap-container`, `.snap-slide`, `.snap-tail`.

- [ ] **Step 1: Create the media-query hook**

Create `hooks/useMediaQuery.js`:

```jsx
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
```

- [ ] **Step 2: Add scroll-snap CSS to globals**

In `app/globals.css`, keep the existing `@tailwind` lines, `:root`, `body` gradient, `*`, form, and `::selection` rules. Change the `html`/`body` block so the container owns scrolling, and append the snap utilities. Replace the current `html { scroll-behavior: smooth; }` block with:

```css
html,
body {
  height: 100%;
}

body {
  /* The .snap-container owns scrolling; prevent a second document scrollbar. */
  overflow: hidden;
}

/* Full-page snap container (desktop). */
.snap-container {
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

.snap-slide {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  min-height: 100vh;
  min-height: 100dvh;
}

/* Tail region snaps only at its top; content inside scrolls freely. */
.snap-tail {
  scroll-snap-align: start;
}

/* Mobile / coarse pointer: smooth normal scroll, no snapping. */
@media (max-width: 767px), (pointer: coarse) {
  .snap-container {
    scroll-snap-type: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .snap-container {
    scroll-snap-type: none;
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Build to verify no errors**

Run: `npm run build`
Expected: Build completes successfully (compiles `hooks/useMediaQuery.js`; CSS is valid). The page still renders the old layout — nothing consumes the new classes yet.

- [ ] **Step 4: Commit**

```bash
git add hooks/useMediaQuery.js app/globals.css
git commit -m "feat: add media-query hook and scroll-snap CSS foundation"
```

---

## Task 2: Snap container, provider, and Slide — wire the vertical skeleton

Establishes the full slide structure per the spec slide map (with the beta banner folded into Beta Program) and gets real vertical snapping working with existing content. Features/Screenshots stay as their current grids for now; decks arrive in Task 6.

**Files:**
- Create: `components/FullPageScroll.jsx`
- Create: `components/Slide.jsx`
- Modify: `app/page.jsx`

**Interfaces:**
- Consumes: `useIsDesktop` (not directly here, but same env model).
- Produces:
  - `FullPageScrollProvider({ children })` — context provider.
  - `ScrollViewport({ children, className })` — renders `<main ref className="snap-container">`.
  - `useFullPageScroll(): { containerRef, activeId, scrollYProgress }` (`scrollYProgress` is a framer-motion `MotionValue<number>` 0→1; `activeId: string | null`).
  - `Slide({ id, children, className })` — renders `<section id data-slide={id} className="snap-slide …">`.

- [ ] **Step 1: Create the Slide wrapper**

Create `components/Slide.jsx`:

```jsx
'use client';

// One full-viewport snap slide. `data-slide` is read by the provider's
// IntersectionObserver and by HorizontalDeck to know which slide is active.
export default function Slide({ id, children, className = '' }) {
  return (
    <section
      id={id}
      data-slide={id}
      className={`snap-slide relative flex w-full flex-col justify-center overflow-hidden px-6 py-24 sm:px-8 lg:px-10 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Create the provider + viewport**

Create `components/FullPageScroll.jsx`:

```jsx
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
```

- [ ] **Step 3: Recompose `app/page.jsx` structure**

Rework `app/page.jsx` so the root renders the provider, the existing header (temporarily still inside the flow — refined in Task 4), and the `ScrollViewport` with slides. Keep ALL existing data arrays (`navItems`, `apkDownloadUrl`, `features`, `carouselItems`, `whyItems`, `faqs`) and the `FeedbackForm` import exactly as they are.

Change the imports at the top:

```jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FeedbackForm from '../components/FeedbackForm';
import { FullPageScrollProvider, ScrollViewport } from '../components/FullPageScroll';
import Slide from '../components/Slide';
```

Replace the `return (...)` tree. The header markup stays exactly as the current file has it (the `<header>…</header>` block, lines ~79–132 of the original). Wrap everything in the provider and move the sections into `ScrollViewport` as slides:

```jsx
  return (
    <FullPageScrollProvider>
      {/* Existing header block, unchanged for now — pasted verbatim from current file */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        {/* …existing header inner markup unchanged… */}
      </header>

      <ScrollViewport>
        {/* Slide 1: Hero — move the current hero <section> inner content here */}
        <Slide id="hero" className="pt-28">
          {/* …existing hero grid markup (the two-column hero) unchanged… */}
        </Slide>

        {/* Slide 2: Features — keep current grid for now (deck added in Task 6) */}
        <Slide id="features">
          {/* …existing Features header + grid markup unchanged… */}
        </Slide>

        {/* Slide 3: Screenshots */}
        <Slide id="screenshots">
          {/* …existing Screenshots header + grid markup unchanged… */}
        </Slide>

        {/* Slide 4: Why MoniLog */}
        <Slide id="why">
          {/* …existing whyItems grid markup unchanged… */}
        </Slide>

        {/* Slide 5: Beta Program — fold the old "Currently in Beta" banner in above the beta-program panel */}
        <Slide id="beta-program">
          {/* …existing "Currently in Beta" banner markup… */}
          {/* …existing Beta Program panel markup… */}
        </Slide>

        {/* Slide 6: Download CTA */}
        <Slide id="download">
          {/* …existing Download CTA panel markup unchanged… */}
        </Slide>

        {/* Tail: Feedback + FAQ + Footer scroll freely */}
        <div className="snap-tail">
          <section id="feedback" className="px-6 py-24 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              {/* …existing Feedback grid + <FeedbackForm /> markup unchanged… */}
            </div>
          </section>
          <section id="faq" className="px-6 pb-24 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              {/* …existing FAQ markup unchanged… */}
            </div>
          </section>
          {/* …existing <footer> markup unchanged… */}
        </div>
      </ScrollViewport>
    </FullPageScrollProvider>
  );
```

Notes for this step:
- The old top-level `<main className="min-h-screen …">` wrapper is removed; `ScrollViewport` is the new `<main>`.
- Each former `<section>`'s own outer padding/`max-w-7xl` wrapper is replaced by `Slide` (which supplies `px`/`py` and `max-w-7xl`). Move the *inner* content of each section into the corresponding `Slide`.
- Header changed from `sticky` to `fixed` + `w-full`; hero gets `pt-28` to clear it.
- The beta banner and beta-program panel are now siblings inside one `Slide id="beta-program"`; stack them with a `space-y-8` wrapper if needed to fit one screen.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: Build succeeds. No unused-import or JSX errors.

- [ ] **Step 5: Manual verify (dev server)**

Run: `npm run dev`, open `http://localhost:3000` in a desktop-width window.
Expected:
- Scrolling with the wheel snaps from Hero → Features → Screenshots → Why → Beta Program → Download, one full screen at a time.
- After the Download slide, the Feedback → FAQ → Footer region scrolls **freely** (no snapping).
- Header is fixed at the top over the content; hero content is not hidden behind it.
- Resize to a narrow (<768px) window: snapping stops, page scrolls smoothly and continuously.

- [ ] **Step 6: Commit**

```bash
git add components/FullPageScroll.jsx components/Slide.jsx app/page.jsx
git commit -m "feat: wire full-page snap container, provider, and slide skeleton"
```

---

## Task 3: Bottom progress bar

**Files:**
- Create: `components/ProgressBar.jsx`
- Modify: `app/page.jsx`

**Interfaces:**
- Consumes: `useFullPageScroll().scrollYProgress` (MotionValue 0→1).
- Produces: `ProgressBar()` — default export, a fixed bottom bar.

- [ ] **Step 1: Create the progress bar**

Create `components/ProgressBar.jsx`:

```jsx
'use client';

import { motion } from 'framer-motion';
import { useFullPageScroll } from './FullPageScroll';

export default function ProgressBar() {
  const { scrollYProgress } = useFullPageScroll();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-1 bg-slate-800/60">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-primary to-secondary"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `app/page.jsx`**

Add the import:

```jsx
import ProgressBar from '../components/ProgressBar';
```

Render it inside `FullPageScrollProvider`, as a sibling right after the `<header>` block:

```jsx
      <ProgressBar />
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Manual verify**

Run: `npm run dev`. Scroll the page.
Expected: a thin teal→green bar pinned to the bottom edge grows from left (empty at Hero) to full width when you reach the footer.

- [ ] **Step 5: Commit**

```bash
git add components/ProgressBar.jsx app/page.jsx
git commit -m "feat: add bottom scroll progress bar"
```

---

## Task 4: Header as fixed overlay — anchor snapping + active link

**Files:**
- Modify: `app/page.jsx`

**Interfaces:**
- Consumes: `useFullPageScroll().activeId`.
- Produces: nav links that smooth-scroll the container to a slide; active link is highlighted.

- [ ] **Step 1: Extract the header into a component that reads active state**

In `app/page.jsx`, add `useFullPageScroll` to the FullPageScroll import:

```jsx
import { FullPageScrollProvider, ScrollViewport, useFullPageScroll } from '../components/FullPageScroll';
```

Define a `SiteHeader` component in `app/page.jsx` (above `Home`) so it can consume the context (it must render *inside* the provider). It reuses the existing header markup, but nav anchors call a scroll handler and reflect `activeId`. `navItems` map to ids via the existing slug rule, except "Screenshots"/"Features" already match; map "Beta Program" → `beta-program`, "Feedback" → `feedback`.

```jsx
function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeId, containerRef } = useFullPageScroll();

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = containerRef.current?.querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toId = (item) => item.toLowerCase().replace(/\s+/g, '-');

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#hero" onClick={scrollTo('hero')} className="flex items-center gap-3 text-2xl font-semibold text-white">
          <img src="/icons/monilog_icon.png" alt="MoniLog logo" className="h-10 w-10 rounded-2xl border border-primary bg-primary/15 object-cover" />
          MoniLog
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {navItems.map((item) => {
            const id = toId(item);
            return (
              <a
                key={item}
                href={`#${id}`}
                onClick={scrollTo(id)}
                className={`transition hover:text-primary ${activeId === id ? 'text-primary' : ''}`}
              >
                {item}
              </a>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <a href={apkDownloadUrl} download className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95">
            Download Beta
          </a>
        </div>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 md:hidden"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 pb-6 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pt-6 sm:px-8">
            {navItems.map((item) => {
              const id = toId(item);
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  onClick={scrollTo(id)}
                  className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-primary"
                >
                  {item}
                </a>
              );
            })}
            <a href={apkDownloadUrl} download onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95">
              Download Beta
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
```

Then in `Home`, replace the inline `<header>…</header>` block with `<SiteHeader />`, and remove the now-unused `mobileMenuOpen` state from `Home` (it lives in `SiteHeader` now).

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success; no unused-variable warnings for `mobileMenuOpen`/`useState` in `Home`.

- [ ] **Step 3: Manual verify**

Run: `npm run dev` (desktop width).
Expected:
- Clicking a nav item (e.g. "Screenshots") smoothly scrolls/snaps the container to that slide.
- The nav item for the slide currently in view is highlighted in `primary`.
- Mobile menu (narrow width) opens, links jump to sections, menu closes on click.

- [ ] **Step 4: Commit**

```bash
git add app/page.jsx
git commit -m "feat: fixed header with anchor snapping and active-link sync"
```

---

## Task 5: Reveal animations (text + headings)

**Files:**
- Create: `components/Reveal.jsx`
- Modify: `app/page.jsx`

**Interfaces:**
- Consumes: framer-motion `useReducedMotion`.
- Produces:
  - `Reveal({ as, children, className, delay, amount })` — fade-up on enter view. `as` = tag string (default `'div'`); `delay` = numeric stagger index (each unit ≈ 60ms).
  - `RevealHeading({ as, text, className, amount })` — word-stagger mask reveal for a plain string `text`.

- [ ] **Step 1: Create the Reveal components**

Create `components/Reveal.jsx`:

```jsx
'use client';

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
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          <motion.span className="inline-block will-change-transform" variants={wordChild}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
```

- [ ] **Step 2: Apply to section headings and body in `app/page.jsx`**

Add the import:

```jsx
import { Reveal, RevealHeading } from '../components/Reveal';
```

Apply to each slide's heading/eyebrow/body. Concrete edits:
- Hero `<h1>…</h1>` → `<RevealHeading as="h1" text="Take Control of Your Money, One Transaction at a Time." className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl" />`
- Hero paragraph → wrap in `<Reveal as="p" delay={1} className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">…</Reveal>`
- Hero button row and chip grid → wrap each in `<Reveal delay={2}>…</Reveal>` / `<Reveal delay={3}>…</Reveal>`.
- Features section heading → `<RevealHeading text="Everything You Need to Track Your Finances" className="text-3xl font-semibold text-white sm:text-4xl" />`; its eyebrow `<p>` and description `<p>` → wrap in `<Reveal>`.
- Screenshots, Why, Beta Program, Download headings → same `RevealHeading` treatment; eyebrows/bodies wrapped in `<Reveal>`.
- Tail (Feedback/FAQ) headings may also use `RevealHeading` (they animate on normal scroll).

Keep existing className strings on the elements; just move them onto the `Reveal`/`RevealHeading` wrappers as shown.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Manual verify**

Run: `npm run dev`.
Expected:
- On landing, the hero headline words rise into place in sequence; paragraph and buttons fade up shortly after.
- Snapping to each subsequent slide plays that slide's heading word-reveal + body fade-up once.
- In Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload: text appears immediately with no motion, everything still readable and navigable.

- [ ] **Step 5: Commit**

```bash
git add components/Reveal.jsx app/page.jsx
git commit -m "feat: add reveal + heading word-stagger animations"
```

---

## Task 6: HorizontalDeck (base) — Features & Screenshots as flip decks

Delivers the deck with arrows, drag, touch-swipe, keyboard, and dots, plus the native mobile swipe carousel. **Wheel capture is deliberately deferred to Task 7** so a reviewer can accept the base deck independently.

**Files:**
- Create: `components/HorizontalDeck.jsx`
- Modify: `app/page.jsx`

**Interfaces:**
- Consumes: `useIsDesktop`, `useFullPageScroll().activeId`, framer-motion `useMotionValue`/`animate`/`useReducedMotion`.
- Produces: `HorizontalDeck({ slideId, items, renderCard, ariaLabel })` where `renderCard(item, index, { isCurrent }) => JSX`.

- [ ] **Step 1: Create the deck (no wheel capture yet)**

Create `components/HorizontalDeck.jsx`:

```jsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { useFullPageScroll } from './FullPageScroll';

const SPRING = { type: 'spring', stiffness: 260, damping: 30 };
const GAP = 24; // px, matches Tailwind gap-6 on the track

export default function HorizontalDeck({ slideId, items, renderCard, ariaLabel }) {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const { activeId } = useFullPageScroll();

  const viewportRef = useRef(null);
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
                animate={{ scale, opacity }}
                transition={reduce ? { duration: 0 } : SPRING}
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
```

- [ ] **Step 2: Use the deck for Features in `app/page.jsx`**

Add the import:

```jsx
import HorizontalDeck from '../components/HorizontalDeck';
```

In the Features slide, replace the `<div className="grid …">…features.map(...)…</div>` block with a deck. Move the existing feature-card markup into a `renderCard` function (the current `motion.article` becomes the card). Example:

```jsx
        <Slide id="features">
          <div className="mb-10 space-y-4 text-center">
            <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Features</Reveal>
            <RevealHeading text="Everything You Need to Track Your Finances" className="text-3xl font-semibold text-white sm:text-4xl" />
          </div>
          <HorizontalDeck
            slideId="features"
            ariaLabel="Feature highlights"
            items={features}
            renderCard={(item) => (
              <article className="h-full overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-8 shadow-soft">
                <div className="inline-flex rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{item.label}</div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-slate-300">{item.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          />
        </Slide>
```

- [ ] **Step 3: Use the deck for Screenshots**

Replace the Screenshots grid similarly:

```jsx
        <Slide id="screenshots">
          <div className="mb-10 text-center">
            <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">See MoniLog in Action</Reveal>
            <RevealHeading text="See MoniLog in Action" className="mt-3 text-3xl font-semibold text-white sm:text-4xl" />
          </div>
          <HorizontalDeck
            slideId="screenshots"
            ariaLabel="App screenshots"
            items={carouselItems}
            renderCard={(item) => (
              <div className="h-full rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
                <div className="h-72 overflow-hidden rounded-3xl bg-slate-800" />
                <p className="mt-5 text-lg font-semibold text-white">{item}</p>
              </div>
            )}
          />
        </Slide>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Manual verify (desktop + mobile)**

Run: `npm run dev`.
Desktop expected:
- Features slide shows a centered card with peeking neighbors; `‹`/`›` arrows move between cards with a spring; the centered card is full-size/opacity, neighbors slightly smaller and dimmer.
- Dragging cards left/right snaps to the nearest card; dots reflect and control position; arrows disable at the ends.
- Click the deck, press ← / → : moves between cards.
- Same for Screenshots.
Mobile expected (narrow window / device emulation):
- Decks become horizontally swipeable strips with snap; no arrows required; vertical page scroll still works.

- [ ] **Step 6: Commit**

```bash
git add components/HorizontalDeck.jsx app/page.jsx
git commit -m "feat: horizontal flip decks for features and screenshots"
```

---

## Task 7: Wheel/trackpad capture for the decks

Adds the "hybrid" behavior: on desktop, while a deck slide is active and not at an end, vertical wheel/trackpad input moves the deck sideways; at an end, continued input releases to vertical snap.

**Files:**
- Modify: `components/HorizontalDeck.jsx`

**Interfaces:**
- Consumes: existing deck internals (`viewportRef`, `index`, `items.length`, `next`, `prev`, `activeId`, `isDesktop`, `reduce`) plus adds `slideId` comparison for active state.
- Produces: no new exports; behavior change only.

- [ ] **Step 1: Compute active state and add the wheel effect**

In `components/HorizontalDeck.jsx`, add near the other derived values:

```jsx
  const isActive = activeId === slideId;
```

Then add this effect after the track-animation effect:

```jsx
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
```

Note: the listener must be `{ passive: false }` so `preventDefault()` works. It attaches to `viewportRef`, which exists on the desktop branch (the mobile branch returns earlier and never runs this — but the effect is defined before the early return, so it simply no-ops when `viewportRef` points at the mobile node; guarding on `isDesktop` keeps it inert on mobile).

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Manual verify**

Run: `npm run dev` (desktop, precise pointer).
Expected:
- Snap down to the Features slide, then keep scrolling down with the wheel/trackpad: the page does **not** advance to Screenshots yet — instead cards advance one at a time.
- After the last Features card, one more downward scroll releases and the page snaps to Screenshots.
- Scrolling up while on the first card releases upward to the previous slide.
- Same behavior on the Screenshots deck.
- With `prefers-reduced-motion` emulated, wheel capture is disabled (normal vertical scroll), arrows/keyboard still move the deck.

- [ ] **Step 4: Commit**

```bash
git add components/HorizontalDeck.jsx
git commit -m "feat: wheel/trackpad capture for horizontal decks"
```

---

## Task 8: Parallax — hero mockup + screenshot images

**Files:**
- Create: `components/Parallax.jsx`
- Modify: `app/page.jsx`

**Interfaces:**
- Consumes: `useFullPageScroll().containerRef`, `useIsDesktop`, framer-motion `useScroll`/`useTransform`/`useReducedMotion`.
- Produces: `Parallax({ children, strength, className })` — translates children on Y relative to container scroll; no-op on mobile / reduced-motion.

- [ ] **Step 1: Create the Parallax wrapper**

Create `components/Parallax.jsx`:

```jsx
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
```

- [ ] **Step 2: Apply parallax in `app/page.jsx`**

Add the import:

```jsx
import Parallax from '../components/Parallax';
```

- Wrap the hero phone-mockup container (the `<div className="relative mx-auto max-w-lg">…</div>`) in `<Parallax strength={36}>…</Parallax>`.
- In the Screenshots `renderCard`, wrap the image placeholder so it drifts inside its frame:

```jsx
            renderCard={(item) => (
              <div className="h-full rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
                <div className="h-72 overflow-hidden rounded-3xl bg-slate-800">
                  <Parallax strength={24} className="h-[130%] w-full bg-gradient-to-b from-slate-700 to-slate-900" />
                </div>
                <p className="mt-5 text-lg font-semibold text-white">{item}</p>
              </div>
            )}
```

(The inner element is taller than its frame so vertical drift stays covered.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Manual verify**

Run: `npm run dev` (desktop).
Expected:
- As you snap toward/away from the hero, the phone mockup drifts slightly vertically against the surrounding text (subtle, ~±36px).
- On the Screenshots deck, each framed image drifts gently within its clipped frame.
- On mobile emulation and with reduced-motion, parallax is disabled and layout is static/clean (no clipping artifacts).

- [ ] **Step 5: Commit**

```bash
git add components/Parallax.jsx app/page.jsx
git commit -m "feat: scroll-linked parallax for hero mockup and screenshots"
```

---

## Task 9: Deck entrance stagger + final polish

Adds a one-time entrance stagger to deck cards when a deck first comes into view, and tidies spacing so each slide sits comfortably in one screen.

**Files:**
- Modify: `components/HorizontalDeck.jsx`
- Modify: `app/page.jsx` (spacing only, if needed)

**Interfaces:**
- Consumes: framer-motion `useInView`.
- Produces: no new exports.

- [ ] **Step 1: Add entrance stagger to the desktop deck track**

In `components/HorizontalDeck.jsx`, import `useInView`:

```jsx
import { motion, useMotionValue, animate, useReducedMotion, useInView } from 'framer-motion';
```

Add an in-view flag for the desktop deck (place with other refs/hooks):

```jsx
  const inView = useInView(viewportRef, { amount: 0.3, once: true });
```

On the desktop card `motion.div`, combine the depth animation with a one-time entrance offset. Replace the card's `animate`/`transition` with:

```jsx
                animate={{
                  scale,
                  opacity: reduce ? 1 : (inView ? opacity : 0),
                  y: reduce ? 0 : (inView ? 0 : 28)
                }}
                transition={reduce ? { duration: 0 } : { ...SPRING, delay: inView ? Math.min(i, 6) * 0.05 : 0 }}
```

(This keeps the depth `scale`/`opacity` behavior after entry, but on first reveal the cards rise and fade in with a slight per-card delay.)

- [ ] **Step 2: Verify one-screen fit and adjust spacing**

In `app/page.jsx`, confirm each `Slide`'s content fits within `100dvh` at a typical 1366×768 laptop viewport. If the Beta Program slide (banner + panel) overflows, tighten it: wrap its two blocks in `<div className="space-y-6">` and reduce inner padding (e.g. panel `p-10` → `p-8`). Only adjust spacing — do not cut content.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Manual verify**

Run: `npm run dev`.
Expected:
- Snapping to Features/Screenshots for the first time plays a brief staggered rise-in of the cards; navigating within the deck afterward uses the normal spring (no re-stagger).
- No slide requires internal vertical scrolling on a 1366×768 viewport (except the intended tail region).
- Reduced-motion: cards appear immediately, fully functional.

- [ ] **Step 5: Commit**

```bash
git add components/HorizontalDeck.jsx app/page.jsx
git commit -m "feat: deck entrance stagger and slide spacing polish"
```

---

## Task 10: Full QA pass + build verification

Runs the spec §8 checklist end-to-end and fixes any regressions found. No new features.

**Files:**
- Modify: any of the above as needed for fixes discovered during QA.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: clean build, no errors or warnings introduced by this work.

- [ ] **Step 2: Desktop QA (precise pointer, ≥768px)**

Run: `npm run dev`. Verify each item; note any failure and fix before commit:
1. Vertical snap across Hero → Features → Screenshots → Why → Beta Program → Download.
2. Wheel capture enters/moves/releases correctly on both decks, both directions.
3. Deck controls: arrows, drag, keyboard ←/→, dots all work; arrows disable at ends.
4. Header anchors snap to the right slide; active link highlights the current slide.
5. Bottom progress bar advances 0→100% across the whole page.
6. Tail (Feedback → FAQ → Footer) scrolls freely; **submit the FeedbackForm and confirm it still works** (Firebase path untouched).
7. Reveals and parallax play smoothly; no layout shift or clipping.

- [ ] **Step 3: Mobile QA (device emulation / narrow width, coarse pointer)**

1. Page scrolls smoothly with no snapping.
2. Features/Screenshots are native swipe carousels; no wheel-capture lock-ups.
3. Header mobile menu works; anchors jump correctly.
4. No horizontal page overflow; content readable.

- [ ] **Step 4: Reduced-motion QA**

Emulate `prefers-reduced-motion: reduce`:
1. No parallax, no large reveals, no snap jank.
2. Decks still operable via arrows/keyboard/dots.
3. Everything reachable and readable.

- [ ] **Step 5: Console check**

With the dev server open, confirm no React warnings/errors in the browser console during scroll, deck interaction, and resize (watch for passive-listener or hydration warnings).

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: address QA findings for full-page + horizontal scroll redesign"
```

(If no fixes were needed, skip the commit and note QA passed clean.)

---

## Self-Review (completed during authoring)

**Spec coverage** — every spec section maps to a task:
- §3 slide map + beta-banner fold → Task 2 (structure), Tasks 6/8 (decks, parallax).
- §4.1 overlay structure, tail grouping → Tasks 2, 3, 4.
- §4.2 components: FullPageScroll → T2; Slide → T2; Reveal → T5; Parallax → T8; HorizontalDeck → T6+T7+T9; ProgressBar → T3; useMediaQuery → T1.
- §4.3 state/data flow (activeId, scrollYProgress, per-deck index, env flags) → T2, T3, T6.
- §5 effects (headings, body, parallax, deck depth, screenshot image parallax, entrance stagger) → T5, T8, T9.
- §6 responsiveness/accessibility (desktop/mobile split, reduced-motion, keyboard, dvh) → T1 (CSS), T6 (mobile fallback + keyboard), T7/T8 (reduced-motion gates), T10 (QA).
- §7 file plan → matches the File Structure section above.
- §8 verification → Task 10.
- §9 out-of-scope respected (no deps, no content/theme change, FeedbackForm untouched).

**Placeholder scan** — the `{/* …existing markup unchanged… */}` notes in Task 2 point to concrete, existing blocks in `app/page.jsx` (not unwritten code); all new component code is provided in full. No "TBD"/"add error handling"/"write tests for the above".

**Type/name consistency** — `useFullPageScroll()` returns `{ containerRef, activeId, scrollYProgress }` everywhere it's consumed (ProgressBar, Parallax, HorizontalDeck, SiteHeader). `HorizontalDeck` prop set `{ slideId, items, renderCard, ariaLabel }` is identical at definition (T6) and call sites (T6), and `slideId`/`activeId` comparison added in T7 uses the same `activeId`. `renderCard(item, index, { isCurrent })` signature is consistent. `Reveal`/`RevealHeading` prop names match between definition (T5) and usage.
