'use client';

import { Reveal } from '../../components/Reveal';

export default function WhyMonilogSection({ whyItems }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {whyItems.map((item, i) => (
        <Reveal key={item.title} delay={i} className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{item.title}</p>
          <p className="mt-4 text-lg font-semibold text-white">{item.title}</p>
          <p className="mt-3 text-slate-300">{item.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
