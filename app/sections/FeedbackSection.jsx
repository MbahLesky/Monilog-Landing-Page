'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import { trackFirebaseEvent } from '../../lib/firebase';

const submissionRules = [
  'Complete the flows in order — installation and onboarding unlock the rest.',
  'Test on a real device or browser, not an emulator.',
  'Attach every required screenshot — submissions without them are not counted.',
  'Report anything unexpected, even when a step does not mention it.'
];

export default function FeedbackSection({ testFlows }) {
  return (
    <>
      <div className="mb-12 space-y-4 text-center">
        <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Beta Feedback</Reveal>
        <RevealHeading text="Eight Test Flows. One Form Each." className="text-3xl font-semibold text-white sm:text-4xl" />
        <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
          Each card covers one area of MoniLog. Work through the steps, capture the required screenshots, and submit the matching form.
        </Reveal>
      </div>

      <Reveal delay={1} className="mb-12 grid gap-4 sm:grid-cols-2">
        {submissionRules.map((rule) => (
          <div key={rule} className="flex items-start gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/80 px-5 py-4 text-sm text-slate-300 shadow-sm">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            {rule}
          </div>
        ))}
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {testFlows.map((flow, index) => (
          <Reveal key={flow.id} delay={index % 4} className="h-full">
            <article className="flex h-full flex-col rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-6 shadow-soft transition hover:border-primary/50">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-3xl bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Flow {flow.id}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {flow.screenshots} {flow.screenshots === 1 ? 'screenshot' : 'screenshots'}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{flow.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{flow.objective}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
                {flow.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <a
                  href={flow.formUrl}
                  onClick={() => trackFirebaseEvent('feedback_form_opened', { flow: flow.id, title: flow.title })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-primary/60 hover:bg-slate-800"
                >
                  Submit feedback
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal as="p" delay={2} className="mt-10 text-center text-sm text-slate-400">
        Questions or blockers? Reach out in the MoniLog Beta Testers WhatsApp group. Keep the app and all screenshots confidential.
      </Reveal>
    </>
  );
}
