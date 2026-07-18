'use client';

import { useEffect, useRef, useState } from 'react';
import { FullPageScrollProvider, ScrollViewport, useFullPageScroll } from '../components/FullPageScroll';
import Slide from '../components/Slide';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import ScreenshotsSection from './sections/ScreenshotsSection';
import ComingSoonSection from './sections/ComingSoonSection';
import WhyMonilogSection from './sections/WhyMonilogSection';
import BetaProgramSection from './sections/BetaProgramSection';
import DownloadCTASection from './sections/DownloadCTASection';
import FAQSection from './sections/FAQSection';
import Footer from './sections/Footer';

// Data
const navItems = ['Features', 'Screenshots', 'Coming Soon', 'Beta Program'];
const apkDownloadUrl = '/downloads/Monilog-v1.2.1.apk';

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
    title: 'Categories & Organization',
    description: 'Sort every transaction into clear, custom categories.',
    points: ['Custom categories', 'Category-based filtering', 'Spending breakdown by category', 'Icon & color tagging'],
    label: 'Categories Screen'
  },
  {
    title: 'Smart Notifications',
    description: 'Stay on top of your finances with timely alerts.',
    points: ['Balance alerts', 'Transaction reminders', 'Customizable notification preferences', 'Low balance warnings'],
    label: 'Notifications Screen'
  }
];

const screenshotItems = [
  'Dashboard Screen',
  'Transaction Entry Screen',
  'Accounts Screen',
  'Transfers Screen',
  'Analytics Screen',
  'Import / Export Screen',
  'Authentication Screen',
  'Currency Screen',
  'Notifications Screen',
  'Categories Screen',
  'History Screen'
];

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
  },
  {
    title: 'iOS Version',
    description: 'Bring the full MoniLog experience to iPhone and iPad with a native iOS release.',
    points: ['Native iOS app', 'Feature parity with Android', 'App Store release']
  },
  {
    title: 'Advanced Analytics',
    description: 'Dive deeper into spending patterns with richer charts and custom reports.',
    points: ['Custom date ranges', 'Category trend charts', 'Exportable reports']
  }
];

const faqs = [
  { q: 'What is MoniLog?', a: 'MoniLog is a modern personal finance tracker designed for fast, offline-first money management without requiring an account.' },
  { q: 'Is MoniLog free?', a: 'Yes. The beta remains free to download and use while we refine the experience with community feedback.' },
  { q: 'Will iOS be supported?', a: 'Yes, an iOS version is on our roadmap as we build on a stable Android beta and strong cross-platform foundations.' },
  { q: 'Can I use MoniLog offline?', a: 'Absolutely. MoniLog is built to work offline and store your data locally for privacy and reliability.' },
  { q: 'How can I submit feedback?', a: 'Feedback tools are coming soon. As the beta progresses, we will share dedicated forms for each test scenario.' }
];

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
          <a href={apkDownloadUrl} download className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95">
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
      <ProgressBar />
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
              onClick={() => setMobileMenuOpen(false)}
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
  return (
    <FullPageScrollProvider>
      <SiteHeader />

      <ScrollViewport>
        {/* Slide 1: Hero */}
        <Slide id="hero" className="pt-28">
          <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 translate-x-1/3 rounded-full bg-secondary/15 blur-3xl" />
          <HeroSection />
        </Slide>

        {/* Slide 2: Features */}
        <Slide id="features">
          <FeaturesSection features={features} />
        </Slide>

        {/* Slide 3: Screenshots */}
        <Slide id="screenshots" className="text-white">
          <ScreenshotsSection screenshotItems={screenshotItems} />
        </Slide>

        {/* Slide 4: Why MoniLog */}
        <Slide id="why">
          <WhyMonilogSection whyItems={whyItems} />
        </Slide>

        {/* Slide 5: Coming Soon */}
        <Slide id="coming-soon">
          <ComingSoonSection roadmapItems={roadmapItems} />
        </Slide>

        {/* Slide 6: Beta Program */}
        <Slide id="beta-program">
          <BetaProgramSection apkDownloadUrl={apkDownloadUrl} />
        </Slide>

        {/* Slide 7: Download CTA */}
        <Slide id="download">
          <DownloadCTASection apkDownloadUrl={apkDownloadUrl} />
        </Slide>

        {/* Tail: FAQ + Footer */}
        <div className="snap-tail bg-slate-950 text-slate-100">
          <section id="faq" className="px-6 py-24 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <FAQSection faqs={faqs} />
            </div>
          </section>

          <Footer />
        </div>
      </ScrollViewport>
    </FullPageScrollProvider>
  );
}
