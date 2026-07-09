# MoniLog Landing Page — Full-Page + Horizontal Scroll Redesign

**Date:** 2026-07-09
**Status:** Approved design, ready for implementation planning
**Scope:** Motion/layout redesign of the existing single-page marketing site. Content, copy, brand theme, and the Firebase-backed feedback form are preserved.

## 1. Goal

Convert the existing vertically-stacked landing page into a **full-page scroll experience**:

1. **Vertical full-page snap** — showcase sections each occupy the full viewport and snap to the next "slide" on scroll.
2. **Horizontal hybrid decks** — the Features and Screenshots sections present their cards as a sideways-flipping deck (like flipping through a photo album / slide deck), driven by arrows, drag, swipe, keyboard, and wheel/trackpad capture.
3. **Reveal + parallax effects** — headings and body text animate in when a section enters view; images/mockups use subtle parallax; deck cards get entrance stagger and depth.

Intensity target: **Refined / premium** — smooth, tasteful, professional (finance brand), not flashy.

## 2. Confirmed decisions

| Decision | Choice |
|---|---|
| Horizontal interaction | **Hybrid**: carousel controls (arrows/drag/swipe/keyboard) **plus** wheel/trackpad capture while inside the deck |
| Mobile / touch | **Desktop snap, mobile smooth**: snap + wheel-capture on desktop; mobile falls back to normal smooth vertical scroll with native swipe carousels; reveal animations still run |
| Overflow sections | **Group tail into a scroll zone**: Hero, Features, Screenshots, Why, Beta Program, Download snap as full screens; Feedback + FAQ + Footer scroll normally as a final region |
| Navigation aids | Keep existing **top nav bar** (anchors that snap to slides) + **progress bar pinned to the bottom** of the viewport. No side dots, no scroll cue |
| Effect intensity | **Refined / premium** |
| Beta banner | **Folded into the Beta Program slide** (removes topic redundancy) |
| Tech approach | **Custom**: `framer-motion` (already installed) + CSS scroll-snap. No fullpage.js / licensed library |

## 3. Slide map

The page is a single snap scroll container. Header and progress bar are fixed overlays outside it.

| # | Slide (100dvh, snaps) | Motion notes |
|---|---|---|
| 1 | **Hero** | Headline word/line stagger reveal; phone mockup parallax; feature-chip stagger |
| 2 | **Features** | Horizontal hybrid deck, 8 cards; entrance stagger + center-depth |
| 3 | **Screenshots** ("See MoniLog in Action") | Horizontal hybrid deck, 5 cards; parallax on the screenshot image inside each card |
| 4 | **Why MoniLog** | 3 cards, staggered fade-up |
| 5 | **Beta Program** | Absorbs the current "Currently in Beta" banner content; two-column reveal |
| 6 | **Download CTA** | Gradient panel, fade-up |
| — | **Tail (normal scroll):** Feedback → FAQ → Footer | Snap-align only at the tail's top; free scroll within |

## 4. Architecture

### 4.1 DOM / overlay structure

```
<div id="app-root">
  <Header fixed />              // existing nav, now a fixed overlay
  <ProgressBar fixed-bottom />  // fills with scroll progress
  <FullPageScroll>             // the snap scroll container (100dvh, overflow-y, scroll-snap-type: y)
    <Slide> Hero </Slide>
    <Slide> <HorizontalDeck> Features </HorizontalDeck> </Slide>
    <Slide> <HorizontalDeck> Screenshots </HorizontalDeck> </Slide>
    <Slide> Why </Slide>
    <Slide> Beta Program </Slide>
    <Slide> Download CTA </Slide>
    <TailRegion> Feedback + FAQ + Footer </TailRegion>
  </FullPageScroll>
</div>
```

- The **container** (not `window`) is the scroll element. Snap: `scroll-snap-type: y mandatory` on desktop (tunable to `proximity` if mandatory feels aggressive on the tail). Each `Slide`: `height: 100dvh; scroll-snap-align: start; scroll-snap-stop: always`.
- **TailRegion** gets `scroll-snap-align: start` only at its top; its inner children have no snap alignment, so once entered it scrolls freely through Feedback/FAQ/Footer.
- Header is `fixed` (not a `Slide` child), so it floats above and does not consume a snap slide. Hero adds top padding to clear it.
- Nav anchor links smooth-scroll the container to the target slide (via `scrollIntoView` / `container.scrollTo`, honoring `scroll-behavior: smooth` on the container).

### 4.2 Components (new, under `components/`)

Each has one clear purpose, a small prop interface, and is independently testable/understandable.

- **`FullPageScroll`** (client)
  - What: the snap scroll container. Provides its scroll element `ref` via context so children (`Parallax`, `ProgressBar`, `HorizontalDeck`) can read scroll position. Tracks scroll progress (0–1) and the active slide index; syncs the header's active link.
  - Depends on: `useMediaQuery`/`useReducedMotion`, framer-motion `useScroll`.
- **`Slide`** (presentational)
  - What: `h-[100dvh] snap-start snap-always` flex wrapper that vertically centers content. Props: `id`, `className`, `children`.
- **`Reveal`** (client)
  - What: wraps content and animates it in on `whileInView`. Variants: `fade-up` (default, body/blocks) and `heading` (word/line stagger for the "subtitle effect"). Props: `as`, `variant`, `stagger`, `delay`. Respects reduced motion (renders static). A small `SplitText` helper splits a heading into animated word/line spans.
- **`Parallax`** (client)
  - What: translates its child on the Y axis relative to container scroll. Uses framer-motion `useScroll({ container, target })` + `useTransform`. Props: `strength` (px travel), `axis`. No-op under reduced motion / mobile.
- **`HorizontalDeck`** (client) — core piece
  - What: horizontal card deck with the hybrid interaction model.
    - Controls: prev/next **arrows**, **drag** (pointer), **touch swipe**, **keyboard ←/→** when the deck slide is active, **dot indicators**.
    - **Wheel capture (desktop):** while the deck is the active slide and not at either end, a non-passive `wheel` handler `preventDefault()`s vertical delta and advances the deck horizontally; at an end, continued scroll in that direction releases control so vertical snap proceeds to the neighboring slide.
    - Card motion: entrance stagger; subtle depth (scale/opacity as a function of distance from center); existing hover-lift retained.
    - Optional per-card `renderParallax` slot (used by Screenshots for image-in-frame parallax).
  - Props: `items`, `renderCard`, `isActive`, `ariaLabel`.
  - Mobile fallback: renders a native `overflow-x-auto` `snap-x` track (no wheel capture, no JS translate).
- **`ProgressBar`** (client)
  - What: fixed thin bar at viewport bottom; width scales to container scroll progress from `FullPageScroll`.
- **`hooks/useMediaQuery.js`** — small SSR-safe hook to detect desktop vs mobile/coarse-pointer.

`app/page.jsx` becomes the **composition layer**: it keeps the existing data arrays (`features`, `carouselItems`, `whyItems`, `faqs`, `navItems`) and wires them into the components above. The existing `FeedbackForm` is used unchanged.

### 4.3 State & data flow

- Static content arrays remain in `page.jsx` (no data layer changes).
- `FullPageScroll` owns: `scrollProgress` (→ ProgressBar), `activeIndex` (→ Header active state + tells each `HorizontalDeck` whether it `isActive`).
- Each `HorizontalDeck` owns its own `deckIndex` (current card).
- Environment flags: `isDesktop` (media query), `prefersReducedMotion` — gate snap, wheel capture, and parallax.

## 5. Effects spec (Refined / premium)

- **Headings:** word/line stagger, mask-up reveal on enter view (~0.4–0.6s, ease-out, ~30–50ms stagger).
- **Body / blocks / chips:** fade-up (translateY ~16–24px → 0), light stagger for grids.
- **Images / phone mockup:** parallax translateY, gentle (±20–40px over the slide's scroll range).
- **Deck cards:** entrance stagger on first reveal; depth = center card full scale/opacity, neighbors slightly smaller/dimmer; hover-lift retained.
- **Screenshots cards:** the framed screenshot image parallaxes slightly within its frame as the deck moves.
- **Transitions:** rely on CSS snap for slide-to-slide; content animates on enter, not on a global timeline.

## 6. Responsiveness & accessibility

- **Desktop:** snap + wheel-capture decks + parallax.
- **Mobile / coarse pointer:** `scroll-snap-type: none`; sections use `min-height` instead of fixed `100dvh` where content needs it; decks become native swipe carousels; reveals still run.
- **`prefers-reduced-motion: reduce`:** disable parallax and large reveals (render final state), disable wheel capture and snap "jank"; keep plain scrolling; keyboard ←/→ deck nav still works.
- **Keyboard:** header anchors focusable; decks operable via ←/→ with visible focus; dots are buttons; no keyboard trap in wheel capture.
- **Reduced-motion and mobile paths must be functionally complete**, not degraded dead-ends.
- Use `100dvh` (not `100vh`) to avoid mobile address-bar clipping (with `100vh` fallback).

## 7. File plan

**New**
- `components/FullPageScroll.jsx`
- `components/Slide.jsx`
- `components/Reveal.jsx`
- `components/Parallax.jsx`
- `components/HorizontalDeck.jsx`
- `components/ProgressBar.jsx`
- `hooks/useMediaQuery.js`

**Modified**
- `app/page.jsx` — recompose sections into slides + decks + tail (content preserved)
- `app/globals.css` — snap container utilities, `dvh`, reduced-motion rules; keep existing `scroll-behavior: smooth` intent on the container
- `components/FeedbackForm.jsx` — **unchanged** (used as-is)

## 8. Verification (manual QA)

Static marketing page → no unit tests. Verify:

1. Vertical snap between all showcase slides (desktop).
2. Wheel/trackpad capture: entering a deck moves cards sideways; reaching an end releases to vertical snap in both directions, both decks.
3. Deck controls: arrows, drag, touch swipe, keyboard ←/→, dot indicators.
4. Header nav anchors smooth-scroll/snap to the correct slide; active link updates.
5. Bottom progress bar tracks scroll position 0→100%.
6. Tail region (Feedback/FAQ/Footer) scrolls freely; **FeedbackForm still submits** (Firebase path untouched).
7. Mobile fallback: smooth scroll, native swipe carousels, no wheel-capture lock-ups.
8. `prefers-reduced-motion`: parallax/large reveals off, everything still navigable.
9. `npm run build` clean; no console errors.

## 9. Out of scope (YAGNI)

- No content/copy rewrite, no new sections, no theme/color change.
- No side-dot navigation, no scroll cue.
- No changes to Firebase/feedback logic.
- No new third-party dependencies.
