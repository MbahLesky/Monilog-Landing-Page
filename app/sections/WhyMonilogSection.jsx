'use client';

import HorizontalDeck from '../../components/HorizontalDeck';

export default function WhyMonilogSection({ whyItems }) {
  return (
    <HorizontalDeck
      slideId="why"
      ariaLabel="Why MoniLog"
      items={whyItems}
      renderCard={(item) => (
        <article className="h-full rounded-[1.75rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-soft">
          <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
          <p className="mt-4 text-slate-300">{item.body}</p>
        </article>
      )}
    />
  );
}
