'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';

export default function FAQSection({ faqs }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-10 shadow-soft">
      <div className="mb-10 text-center">
        <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">FAQ</Reveal>
        <RevealHeading text="Frequently Asked Questions" className="mt-3 text-3xl font-semibold text-white sm:text-4xl" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <h3 className="text-lg font-semibold text-white">{item.q}</h3>
            <p className="mt-3 text-slate-300">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
