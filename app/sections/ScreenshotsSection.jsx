'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import HorizontalDeck from '../../components/HorizontalDeck';
import MediaPlaceholder from '../../components/MediaPlaceholder';

export default function ScreenshotsSection({ screenshotItems }) {
  return (
    <>
      <div className="mb-10 text-center">
        <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">See MoniLog in Action</Reveal>
        <RevealHeading text="A Closer Look at the App" className="mt-3 text-3xl font-semibold sm:text-4xl" />
      </div>
      <HorizontalDeck
        slideId="screenshots"
        ariaLabel="App screenshots"
        items={screenshotItems}
        renderCard={(item) => (
          <div className="h-full rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
            <MediaPlaceholder item={{ title: item }} className="h-72" />
            <p className="mt-5 text-lg font-semibold text-white">{item}</p>
          </div>
        )}
      />
    </>
  );
}
