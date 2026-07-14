'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import HorizontalDeck from '../../components/HorizontalDeck';
import MediaPlaceholder from '../../components/MediaPlaceholder';

export default function FeaturesSection({ features }) {
  return (
    <>
      <div className="mb-12 space-y-4 text-center">
        <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Features</Reveal>
        <RevealHeading text="Everything You Need to Track Your Finances" className="text-3xl font-semibold text-white sm:text-4xl" />
        <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
          MoniLog Version 1 focuses on the essentials of personal finance management, providing a fast, simple, and reliable offline experience.
        </Reveal>
      </div>
      <HorizontalDeck
        slideId="features"
        ariaLabel="Feature highlights"
        items={features}
        renderCard={(item) => (
          <article className="h-full overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-8 shadow-soft transition hover:border-primary/50">
            <MediaPlaceholder item={item} className="mb-6 h-48" />
            <div className="inline-flex rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {item.label}
            </div>
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
    </>
  );
}
