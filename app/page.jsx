'use client';

import { useEffect, useRef, useState } from 'react';
import { FullPageScrollProvider, ScrollViewport, useFullPageScroll } from '../components/FullPageScroll';
import Slide from '../components/Slide';
import ProgressBar from '../components/ProgressBar';
import { Reveal, RevealHeading } from '../components/Reveal';
import HorizontalDeck from '../components/HorizontalDeck';
import MediaPlaceholder from '../components/MediaPlaceholder';
import Parallax from '../components/Parallax';
import { useAuth } from '../context/AuthContext';

const navItems = ['Features', 'Screenshots', 'Coming Soon', 'Beta Program'];
const apkDownloadUrl = '/downloads/monilog-v1_1-release.apk';
const features = [
  {
    title: 'Dashboard Overview',
    description: 'See a clear summary of your finances at a glance.',
    points: ['Financial overview', 'Account balances', 'Recent activity', 'Quick access actions'],
    label: 'Dashboard Screen'
  },
  {
    title: 'Income & Expense Tracking',
    description: 'Record every transaction with ease.',
    points: ['Add income', 'Add expenses', 'Edit transactions', 'Transaction details', 'Organized records'],
    label: 'Transaction Entry Screen'
  },
  {
    title: 'Account Management',
    description: 'Manage multiple accounts locally.',
    points: ['Create accounts', 'Track balances', 'Account summaries', 'Financial organization'],
    label: 'Accounts Screen'
  },
  {
    title: 'Money Transfers',
    description: 'Move money between accounts effortlessly.',
    points: ['Account-to-account transfers', 'Transfer history', 'Transfer fee support'],
    label: 'Transfers Screen'
  },
  {
    title: 'Analytics & Insights',
    description: 'Understand where your money goes.',
    points: ['Spending analysis', 'Income trends', 'Financial summaries', 'Visual reports'],
    label: 'Analytics Screen'
  },
  {
    title: 'Import & Export',
    description: 'Keep control of your data.',
    points: ['CSV import', 'CSV export', 'Data portability', 'Local backups'],
    label: 'Import / Export Screen'
  },
  {
    title: 'Personalized Onboarding',
    description: 'Get started in minutes.',
    points: ['Display name setup', 'Language selection', 'Currency selection', 'Starting balance configuration', 'Notification preferences'],
    label: 'Onboarding Screen'
  },
  {
    title: 'Settings & Customization',
    description: 'Configure the app to match your preferences.',
    points: ['Profile settings', 'Category management', 'Notification settings', 'Data management tools'],
    label: 'Settings Screen'
  }
];

const screenshotItems = features.map(({ label }) => label);
const whyItems = [
  { title: 'Simple', body: 'Designed to be easy for anyone to use.' },
  { title: 'Reliable', body: 'Works even when internet access is unavailable.' },
  { title: 'Built with Users', body: 'Improved continuously based on community feedback.' }
];
const roadmapItems = [
  {
    title: 'Cloud Sync & Backup',
    description: 'Keep your transactions and account data available across devices with secure Supabase-backed sync.',
    points: ['Cross-device sync', 'Automatic backups', 'Reliable restore flow']
  },
  {
    title: 'Chatbot Transaction Logging',
    description: 'Create entries by describing purchases in plain language, making logging feel effortless.',
    points: ['Voice or text input', 'Smart categorization', 'Fast transaction entry']
  },
  {
    title: 'WhatsApp Integration',
    description: 'Capture expenses and transfers from WhatsApp conversations without leaving your workflow.',
    points: ['Message-based logging', 'Quick reminders', 'Less manual entry']
  },
  {
    title: 'App Lock / PIN',
    description: 'Add an extra layer of protection so your financial data stays private on the device.',
    points: ['Passcode or PIN', 'Biometric readiness', 'Secure app access']
  }
];
const faqs = [
  { q: 'What is MoniLog?', a: 'MoniLog is a modern personal finance tracker designed for fast, offline-first money management without requiring an account.' },
  { q: 'Is MoniLog free?', a: 'Yes. The beta remains free to download and use while we refine the experience with community feedback.' },
  { q: 'Will iOS be supported?', a: 'iOS support is under consideration as we prioritize a stable Android beta and strong cross-platform foundations.' },
  { q: 'Can I use MoniLog offline?', a: 'Absolutely. MoniLog is built to work offline and store your data locally for privacy and reliability.' },
  { q: 'How can I submit feedback?', a: 'Feedback tools are coming soon. As the beta progresses, we will share dedicated forms for each test scenario.' }
];

function useGatedDownload() {
  const { user, openAuthModal } = useAuth();
  return (event) => {
    if (!user) {
      event.preventDefault();
      openAuthModal({ mode: 'signup', intent: 'download' });
    }
    // When signed in, let the <a download> proceed normally.
  };
}

function HeaderAuth({ variant = 'desktop', onNavigate }) {
  const { user, loading, openAuthModal, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    onNavigate?.();
    await signOut();
  };

  if (loading) {
    return <div className="h-9 w-24 rounded-full bg-slate-800/60" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          openAuthModal({ mode: 'signin' });
        }}
        className={`rounded-full border border-slate-700 bg-slate-900 px-5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 ${
          variant === 'mobile' ? 'py-3' : 'py-2.5'
        }`}
      >
        Sign in
      </button>
    );
  }

  const displayName = user.displayName || 'MoniLog tester';
  const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase();

  if (variant === 'mobile') {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-sm font-semibold text-slate-950">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 w-full rounded-full border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 py-1.5 pl-1.5 pr-4 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-semibold text-slate-950">
          {initial}
        </span>
        <span className="max-w-[9rem] truncate">{displayName}</span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-xl">
          <div className="border-b border-slate-800 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeId, containerRef } = useFullPageScroll();
  const onGatedDownload = useGatedDownload();

  const toId = (item) => item.toLowerCase().replace(/\s+/g, '-');

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = containerRef.current?.querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#hero" onClick={scrollTo('hero')} className="flex items-center gap-3 text-2xl font-semibold text-white">
          <img
            src="/icons/monilog_icon.png"
            alt="MoniLog logo"
            className="h-10 w-10 rounded-2xl border border-primary bg-primary/15 object-cover"
          />
          MoniLog
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {navItems.map((item) => {
            const id = toId(item);
            return (
              <a
                key={item}
                href={`#${id}`}
                onClick={scrollTo(id)}
                className={`transition hover:text-primary ${activeId === id ? 'text-primary' : ''}`}
              >
                {item}
              </a>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <HeaderAuth />
          <a href={apkDownloadUrl} download onClick={onGatedDownload} className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95">
            Download Beta
          </a>
        </div>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 md:hidden"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 pb-6 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pt-6 sm:px-8">
            {navItems.map((item) => {
              const id = toId(item);
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  onClick={scrollTo(id)}
                  className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-primary"
                >
                  {item}
                </a>
              );
            })}
            <a
              href={apkDownloadUrl}
              download
              onClick={(e) => {
                onGatedDownload(e);
                setMobileMenuOpen(false);
              }}
              className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
            >
              Download Beta
            </a>
            <HeaderAuth variant="mobile" onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  const { openAuthModal } = useAuth();
  const onGatedDownload = useGatedDownload();

  return (
    <FullPageScrollProvider>
      <ProgressBar />
      <SiteHeader />

      <ScrollViewport>
        {/* Slide 1: Hero */}
        <Slide id="hero" className="pt-28">
          <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 translate-x-1/3 rounded-full bg-secondary/15 blur-3xl" />
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
                {['Offline First', 'No Account Required', 'Fast & Lightweight', 'Local Data Storage'].map((item) => (
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
                <div className="h-[520px] rounded-[1.75rem] bg-slate-950/80 p-6 shadow-inner sm:h-[560px]">
                  <div className="h-full rounded-[1.5rem] border border-slate-800/80 bg-slate-900 p-6 shadow-lg">
                    <div className="flex items-center justify-between rounded-3xl bg-slate-950/90 px-4 py-3 text-white shadow-sm">
                      <span className="text-sm font-semibold">MoniLog</span>
                      <span className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-semibold text-slate-950">Beta</span>
                    </div>
                    <div className="mt-8 h-[380px] rounded-[1.5rem] bg-slate-800 shadow-inner" />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-primary/15 blur-2xl" />
            </Parallax>
          </div>
        </Slide>

        {/* Slide 2: Features */}
        <Slide id="features">
          <div className="mb-12 space-y-4 text-center">
            <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Features</Reveal>
            <RevealHeading text="Everything You Need to Track Your Finances" className="text-3xl font-semibold text-white sm:text-4xl" />
            <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
              MoniLog Version 1 focuses on the essentials of personal finance management, providing a fast, simple, and reliable offline experience.
            </Reveal>
          </div>
          <HorizontalDeck
            slideId="features"
            ariaLabel="Feature highlights"
            items={features}
            renderCard={(item) => (
              <article className="h-full overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-8 shadow-soft transition hover:border-primary/50">
                <MediaPlaceholder item={item} className="mb-6 h-48" />
                <div className="inline-flex rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  {item.label}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-slate-300">{item.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          />
        </Slide>

        {/* Slide 3: Screenshots */}
        <Slide id="screenshots" className="text-white">
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
        </Slide>

        {/* Slide 4: Why MoniLog */}
        <Slide id="why">
          <div className="grid gap-6 lg:grid-cols-3">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i} className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{item.title}</p>
                <p className="mt-4 text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-slate-300">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Slide>

        {/* Slide 5: Coming Soon */}
        <Slide id="coming-soon">
          <div className="mb-10 space-y-4 text-center">
            <Reveal as="p" className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Coming Soon</Reveal>
            <RevealHeading text="What’s Next for MoniLog" className="text-3xl font-semibold text-white sm:text-4xl" />
            <Reveal as="p" delay={1} className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
              These roadmap ideas are planned for future releases and will expand the experience beyond the essentials of Version 1.
            </Reveal>
          </div>
          <HorizontalDeck
            slideId="coming-soon"
            ariaLabel="Upcoming MoniLog features"
            items={roadmapItems}
            renderCard={(item) => (
              <article className="h-full overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-900 p-8 shadow-soft transition hover:border-primary/50">
                <div className="inline-flex rounded-3xl bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
                  Planned
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-slate-300">{item.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-secondary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          />
        </Slide>

        {/* Slide 6: Beta Program (folds in the "Currently in Beta" banner) */}
        <Slide id="beta-program">
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
        </Slide>

        {/* Slide 6: Download CTA */}
        <Slide id="download">
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
        </Slide>

        {/* Tail: FAQ + Footer scroll freely */}
        <div className="snap-tail bg-slate-950 text-slate-100">
          <section id="faq" className="px-6 py-24 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-10 shadow-soft">
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
          </section>

          <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:justify-between">
              <div className="max-w-md">
                <div className="mb-4 flex items-center gap-3 text-2xl font-semibold text-white">
                  <div className="h-10 w-10 rounded-2xl bg-primary/15 ring-1 ring-primary/50" />
                  MoniLog
                </div>
                <p className="text-slate-400">A sleek personal finance tracking experience built for offline reliability, speed, and community-driven growth.</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-white">Quick Links</p>
                  <ul className="mt-4 space-y-3 text-slate-400">
                    <li><a href="#features" className="hover:text-primary">Features</a></li>
                    <li><a href="#screenshots" className="hover:text-primary">Screenshots</a></li>
                    <li><a href="#coming-soon" className="hover:text-primary">Coming Soon</a></li>
                    <li><a href="#beta-program" className="hover:text-primary">Beta Program</a></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">Resources</p>
                  <ul className="mt-4 space-y-3 text-slate-400">
                    <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary">Terms of Use</a></li>
                    <li><a href="#" className="hover:text-primary">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">Contact</p>
                  <p className="mt-4 text-slate-400">support@monilog.app</p>
                  <div className="mt-4 flex items-center gap-3 text-slate-500">
                    <span>Twitter</span>
                    <span>LinkedIn</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-10 text-center text-sm text-slate-500">© 2026 MoniLog. All Rights Reserved.</p>
          </footer>
        </div>
      </ScrollViewport>
    </FullPageScrollProvider>
  );
}
