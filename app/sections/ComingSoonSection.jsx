'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import HorizontalDeck from '../../components/HorizontalDeck';

export default function ComingSoonSection({ roadmapItems }) {
  return (
    <>
      <div className="mb-10 space-y-4 text-center">
        <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Coming Soon</Reveal>
        <RevealHeading text="What's Next for MoniLog" className="text-3xl font-semibold text-white sm:text-4xl" />
        <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
          These roadmap ideas are planned for future releases and will expand the experience beyond the essentials of Version 1.
        </Reveal>
      </div>
      <HorizontalDeck
        slideId="coming-soon"
        ariaLabel="Upcoming MoniLog features"
        items={roadmapItems}
        renderCard={(item) => (
          <article className="h-full overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-8 shadow-soft transition hover:border-primary/50">
            <div className="inline-flex rounded-3xl bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
              Planned
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-slate-300">{item.description}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {item.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-secondary" />
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
