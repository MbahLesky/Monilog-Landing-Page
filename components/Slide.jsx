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
