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
import FeedbackSection from './sections/FeedbackSection';
import FAQSection from './sections/FAQSection';
import Footer from './sections/Footer';
import {
  navItems,
  apkDownloadUrl,
  features,
  screenshotItems,
  whyItems,
  roadmapItems,
  testFlows,
  faqs
} from '../lib/landingContent';

function UserAvatar({ user, initial, sizeClass }) {
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'Profile photo'}
        referrerPolicy="no-referrer"
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }
  return (
    <span className={`flex ${sizeClass} items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary font-semibold text-slate-950`}>
      {initial}
    </span>
  );
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
          <UserAvatar user={user} initial={initial} sizeClass="h-9 w-9 text-sm" />
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
        <UserAvatar user={user} initial={initial} sizeClass="h-7 w-7 text-xs" />
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
  const { user, requestDownload, requestWebAppAccess, webAppUrl } = useAuth();

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
          {user && (
            <>
              <a
                href={webAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => requestWebAppAccess(e, { location: 'header' })}
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                Open Web App
              </a>
              <a
                href={apkDownloadUrl}
                download
                onClick={(e) => requestDownload(e, { location: 'header' })}
                className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95"
              >
                Download Beta
              </a>
            </>
          )}
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
            {user && (
              <>
                <a
                  href={webAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    requestWebAppAccess(e, { location: 'header_mobile' });
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                >
                  Open Web App
                </a>
                <a
                  href={apkDownloadUrl}
                  download
                  onClick={(e) => {
                    requestDownload(e, { location: 'header_mobile' });
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
                >
                  Download Beta
                </a>
              </>
            )}
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
          <HeroSection apkDownloadUrl={apkDownloadUrl} />
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
          <BetaProgramSection />
        </Slide>

        {/* Slide 7: Feedback / Download CTA — CTA to join beta when signed out, test flows once signed in */}
        <Slide id="feedback">
          <FeedbackSection testFlows={testFlows} />
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
