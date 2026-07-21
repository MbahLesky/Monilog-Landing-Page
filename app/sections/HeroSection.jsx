'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import Parallax from '../../components/Parallax';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection({ apkDownloadUrl }) {
  const { requestDownload } = useAuth();

  const onGatedDownload = (event) => requestDownload(event, { location: 'hero' });

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-6">
        <Reveal className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
          Version 1 Beta Testing
        </Reveal>
        <RevealHeading
          as="h1"
          text="Take Control of Your Money, One Transaction at a Time."
          className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
        />
        <Reveal as="p" delay={1} className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          MoniLog helps you track transactions, move money between accounts, manage multiple balances, and understand your finances with clear analytics. It is designed for simple, reliable, offline-first money management.
        </Reveal>
        <Reveal delay={2} className="flex flex-wrap gap-4">
          <a href={apkDownloadUrl} download onClick={onGatedDownload} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-primary/20 transition hover:opacity-95">
            Download Beta
          </a>
          <a href="#features" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800">
            Learn More
          </a>
        </Reveal>
        <Reveal delay={3} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Privacy First', 'Lightweight & Fast', 'Data Control', 'Community Driven'].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-200 shadow-sm">
              {item}
            </div>
          ))}
        </Reveal>
      </div>

      <Parallax strength={36} className="relative mx-auto max-w-lg">
        <div className="absolute -left-10 top-12 h-28 w-28 rounded-3xl bg-primary/15 blur-2xl" />
        <div className="absolute right-8 top-[-18px] h-24 w-24 rounded-3xl bg-secondary/20 blur-2xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-5 shadow-soft">
          <div className="h-[520px] overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-950/80 shadow-inner sm:h-[560px]">
            {/* Negative margin is width-relative, so it always trims the same
                ~48px of the source: the phone status bar. */}
            <img
              src="/screenshots/dashboard_vid.webp"
              alt="MoniLog dashboard preview"
              className="-mt-[20px] h-full w-full object-cover object-top"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-primary/15 blur-2xl" />
      </Parallax>
    </div>
  );
}
