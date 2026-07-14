'use client';

import { Reveal, RevealHeading } from '../../components/Reveal';
import { useAuth } from '../../context/AuthContext';

export default function BetaProgramSection({ apkDownloadUrl, onDownload }) {
  const { openAuthModal } = useAuth();

  const onGatedDownload = (event) => {
    const { user } = useAuth();
    if (!user) {
      event.preventDefault();
      openAuthModal({ mode: 'signup', intent: 'download' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Currently in Beta</Reveal>
            <RevealHeading text="MoniLog Version 1 is actively being tested and improved." className="mt-3 text-3xl font-semibold text-white sm:text-4xl" />
            <Reveal as="p" delay={1} className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Features may evolve based on user feedback and real-world usage.
            </Reveal>
          </div>
          <div className="rounded-3xl bg-slate-950/95 px-5 py-4 text-white shadow-xl sm:px-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Beta Access</p>
            <p className="mt-2 text-2xl font-semibold">Early users influence every release.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {['Early access benefits', 'Opportunity to influence future features', 'Direct feedback channel'].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 px-5 py-4 shadow-sm">
              <p className="font-semibold text-slate-100">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-6 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Help Shape the Future of MoniLog</Reveal>
            <RevealHeading text="Version 1 is our foundational release focused on offline personal finance management." className="mt-3 text-3xl font-semibold text-white sm:text-4xl" />
            <Reveal as="p" delay={1} className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              As a beta tester, your feedback directly influences future updates and features.
            </Reveal>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Current Focus</p>
            <ul className="mt-6 space-y-3 text-lg font-semibold">
              {['Stability', 'User experience', 'Performance', 'Core finance workflows'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
