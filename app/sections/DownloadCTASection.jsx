'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import { useAuth } from '../../context/AuthContext';
import { trackFirebaseEvent } from '../../lib/firebase';

export default function DownloadCTASection({ apkDownloadUrl }) {
  const { user, openAuthModal } = useAuth();

  const onGatedDownload = (event) => {
    trackFirebaseEvent('download_click', { location: 'download_cta' });
    if (!user) {
      event.preventDefault();
      openAuthModal({ mode: 'signup', intent: 'download' });
    }
  };

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
