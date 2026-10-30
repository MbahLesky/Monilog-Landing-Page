'use client';

import { useState } from 'react';
import { FullPageScrollProvider, ScrollViewport, useFullPageScroll } from '../components/FullPageScroll';
import Slide from '../components/Slide';
import ProgressBar from '../components/ProgressBar';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import ScreenshotsSection from './sections/ScreenshotsSection';
import ComingSoonSection from './sections/ComingSoonSection';
import WhyMonilogSection from './sections/WhyMonilogSection';
import FAQSection from './sections/FAQSection';
import Footer from './sections/Footer';
import {
  navItems,
  apkDownloadUrl,
  webAppUrl,
  features,
  screenshotItems,
  whyItems,
  roadmapItems,
  faqs
} from '../lib/landingContent';

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
        <a href="#hero" onClick={scrollTo('hero')} className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
          <img
            src="/icons/monilog_icon.png"
            alt="Moniilog logo"
            className="h-10 w-10 rounded-2xl border border-primary bg-primary/15 object-cover"
          />
          Moniilog
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
          <a
            href={webAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Launch Web App
          </a>
          <a
            href={apkDownloadUrl}
            download
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-primary/20 transition hover:opacity-95"
          >
            Download App
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
              href={webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Launch Web App
            </a>
            <a
              href={apkDownloadUrl}
              download
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:opacity-95"
            >
              Download App
            </a>
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

        {/* Slide 4: Why Moniilog */}
        <Slide id="why-moniilog">
          <WhyMonilogSection whyItems={whyItems} />
        </Slide>

        {/* Slide 5: Coming Soon */}
        <Slide id="coming-soon">
          <ComingSoonSection roadmapItems={roadmapItems} />
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
