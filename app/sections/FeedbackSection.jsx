'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import { useAuth } from '../../context/AuthContext';

export default function FeedbackSection({ feedbackItems }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <section id="feedback" className="px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-4 text-center">
          <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Beta Feedback</Reveal>
          <RevealHeading text="Help Us Test MoniLog" className="text-3xl font-semibold text-white sm:text-4xl" />
          <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
            Pick a scenario below, follow the steps in the app, then tell us how it went.
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {feedbackItems.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i}
              as="article"
              className="flex h-full flex-col rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-soft"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <ol className="mt-4 flex-1 space-y-3 text-sm text-slate-300">
                {item.steps.map((step, stepIndex) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {stepIndex + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={item.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95"
              >
                Submit Feedback
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
