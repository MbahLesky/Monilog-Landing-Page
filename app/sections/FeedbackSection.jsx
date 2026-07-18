'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import HorizontalDeck from '../../components/HorizontalDeck';
import { useAuth } from '../../context/AuthContext';

export default function FeedbackSection({ apkDownloadUrl, feedbackItems }) {
  const { user, openAuthModal } = useAuth();

  const onGatedDownload = (event) => {
    if (!user) {
      event.preventDefault();
      openAuthModal({ mode: 'signup', intent: 'download' });
    }
  };

  if (user) {
    return (
      <div>
        <div className="mb-10 space-y-4 text-center">
          <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Beta Feedback</Reveal>
          <RevealHeading text="Help Us Test MoniLog" className="text-3xl font-semibold text-white sm:text-4xl" />
          <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
            Pick a scenario below, follow the steps in the app, then tell us how it went.
          </Reveal>
        </div>
        <HorizontalDeck
          slideId="feedback"
          ariaLabel="Beta feedback scenarios"
          items={feedbackItems}
          renderCard={(item) => (
            <article className="flex h-full flex-col rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-soft">
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
