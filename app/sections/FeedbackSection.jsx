'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import HorizontalDeck from '../../components/HorizontalDeck';
import { useAuth } from '../../context/AuthContext';
import { trackFirebaseEvent } from '../../lib/firebase';

export default function FeedbackSection({ apkDownloadUrl, testFlows }) {
  const { user, openAuthModal, requestDownload } = useAuth();

  const onGatedDownload = (event) => requestDownload(event, { location: 'feedback_cta' });

  if (user) {
    return (
      <div>
        <div className="mb-10 space-y-4 text-center">
          <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Beta Feedback</Reveal>
          <RevealHeading text="Eight Test Flows. One Form Each." className="text-3xl font-semibold text-white sm:text-4xl" />
          <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
            Work through the flows in order — installation and onboarding set up everything that follows. Capture the required screenshots, then submit the matching form.
          </Reveal>
        </div>
        <HorizontalDeck
          slideId="feedback"
          ariaLabel="Beta test flows"
          items={testFlows}
          renderCard={(flow) => (
            <article className="flex h-full flex-col rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-soft">
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
              <ul className="mt-5 flex-1 space-y-3 text-sm text-slate-300">
                {flow.points.map((point, pointIndex) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {pointIndex + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href={flow.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFirebaseEvent('feedback_form_opened', { flow: flow.id, title: flow.title })}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95"
              >
                Submit Feedback
              </a>
            </article>
          )}
        />
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] bg-gradient-to-r from-primary to-secondary px-8 py-12 text-white shadow-soft sm:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Start Managing Your Finances Better</Reveal>
          <RevealHeading text="Join our beta community and help shape the future of MoniLog." className="mt-3 text-3xl font-semibold sm:text-4xl" />
          <Reveal as="p" delay={1} className="mt-4 max-w-2xl text-base leading-7 text-white/90">Version 1.0 Beta</Reveal>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a href={apkDownloadUrl} download onClick={onGatedDownload} className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-deepblue transition hover:bg-slate-100">
            Download Android APK
          </a>
          <button
            type="button"
            onClick={() => openAuthModal({ mode: 'signup' })}
            className="inline-flex items-center justify-center rounded-full border border-white/90 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Join Beta Testing
          </button>
        </div>
      </div>
    </div>
  );
}
