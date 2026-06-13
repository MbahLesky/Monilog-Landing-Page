'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FeedbackForm from '../components/FeedbackForm';

const navItems = ['Features', 'Screenshots', 'Beta Program', 'Feedback'];
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

const carouselItems = ['Dashboard Screen', 'Transactions Screen', 'Reports Screen', 'Savings Screen', 'Debts & Loans Screen'];
const whyItems = [
  { title: 'Simple', body: 'Designed to be easy for anyone to use.' },
  { title: 'Reliable', body: 'Works even when internet access is unavailable.' },
  { title: 'Built with Users', body: 'Improved continuously based on community feedback.' }
];
const faqs = [
  { q: 'What is MoniLog?', a: 'MoniLog is a modern personal finance tracker designed for fast, offline-first money management without requiring an account.' },
  { q: 'Is MoniLog free?', a: 'Yes. The beta remains free to download and use while we refine the experience with community feedback.' },
  { q: 'Will iOS be supported?', a: 'iOS support is under consideration as we prioritize a stable Android beta and strong cross-platform foundations.' },
  { q: 'Can I use MoniLog offline?', a: 'Absolutely. MoniLog is built to work offline and store your data locally for privacy and reliability.' },
  { q: 'How can I submit feedback?', a: 'Use the feedback form below to share your experience, report issues, and suggest new features.' }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F7FBFF] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3 text-2xl font-semibold text-deepblue">
            <img
              src="/icons/monilog_icon.png"
              alt="MoniLog logo"
              className="h-10 w-10 rounded-2xl border border-primary bg-primary/10 object-cover"
            />
            MoniLog
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="transition hover:text-deepblue">
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href={apkDownloadUrl} download className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary">
              Download Beta
            </a>
          </div>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white pb-6 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pt-6 sm:px-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-primary/10 hover:text-deepblue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a
                href={apkDownloadUrl}
                download
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
              >
                Download Beta
              </a>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden px-6 py-16 sm:px-8 lg:px-10">
        <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 translate-x-1/3 rounded-full bg-secondary/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-deepblue shadow-sm">
              Version 1 Beta Testing
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Take Control of Your Money, One Transaction at a Time.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              MoniLog helps you track income, expenses, debts, loans, savings, and financial goals with ease. Built for simplicity, speed, and complete visibility over your finances.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={apkDownloadUrl} download className="inline-flex items-center justify-center rounded-full bg-deepblue px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-deepblue/10 transition hover:bg-[#152F6A]">
                Download Beta
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Learn More
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['Offline First', 'No Account Required', 'Fast & Lightweight', 'Local Data Storage'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto max-w-lg">
            <div className="absolute -left-10 top-12 h-28 w-28 rounded-3xl bg-[#08D2B5]/15 blur-2xl" />
            <div className="absolute right-8 top-[-18px] h-24 w-24 rounded-3xl bg-[#173B7A]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-white to-slate-100 p-5 shadow-soft">
              <div className="h-[520px] rounded-[1.75rem] bg-slate-950/5 p-6 shadow-inner sm:h-[560px]">
                <div className="h-full rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 shadow-lg">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950/90 px-4 py-3 text-white shadow-sm">
                    <span className="text-sm font-semibold">MoniLog</span>
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Beta</span>
                  </div>
                  <div className="mt-8 h-[380px] rounded-[1.5rem] bg-slate-100 shadow-inner" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-primary/10 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Currently in Beta</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">MoniLog Version 1 is actively being tested and improved.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Features may evolve based on user feedback and real-world usage.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/95 px-5 py-4 text-white shadow-xl sm:px-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Beta Access</p>
              <p className="mt-2 text-2xl font-semibold">Early users influence every release.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['Early access benefits', 'Opportunity to influence future features', 'Direct feedback channel'].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-5 shadow-sm">
                <p className="font-semibold text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="mb-12 space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Features</p>
          <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Everything You Need to Track Your Finances</h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
            MoniLog Version 1 focuses on the essentials of personal finance management, providing a fast, simple, and reliable offline experience.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {features.map((item) => (
            <motion.article key={item.title} whileHover={{ y: -4 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-soft">
              <div className="inline-flex rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold text-deepblue">
                {item.label}
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 text-slate-600">{item.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="screenshots" className="bg-slate-950 px-6 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">See MoniLog in Action</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">See MoniLog in Action</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {carouselItems.map((item) => (
              <div key={item} className="group rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60">
                <div className="h-48 rounded-3xl bg-slate-800" />
                <p className="mt-5 text-lg font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {whyItems.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{item.title}</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">{item.title}</p>
              <p className="mt-3 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="beta-program" className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-10 shadow-soft">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Help Shape the Future of MoniLog</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Version 1 is our foundational release focused on offline personal finance management.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                As a beta tester, your feedback directly influences future updates and features.
              </p>
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
      </section>

      <section id="download" className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[1.75rem] bg-gradient-to-r from-primary to-secondary px-8 py-12 text-white shadow-soft sm:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Start Managing Your Finances Better</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Join our beta community and help shape the future of MoniLog.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/90">Version 1.0 Beta</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href={apkDownloadUrl} download className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-deepblue transition hover:bg-slate-100">
                Download Android APK
              </a>
              <a href="#feedback" className="inline-flex items-center justify-center rounded-full border border-white/90 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Join Beta Testing
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="feedback" className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Help Us Improve MoniLog</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">We’re actively collecting feedback from beta testers.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Tell us what's working, what isn't, and what you'd like to see next.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-soft">
            <FeedbackForm />
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-10 shadow-soft">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-950">{item.q}</h3>
                <p className="mt-3 text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white px-6 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-3 text-2xl font-semibold text-deepblue">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 ring-1 ring-primary" />
              MoniLog
            </div>
            <p className="text-slate-600">A sleek personal finance tracking experience built for offline reliability, speed, and community-driven growth.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-950">Quick Links</p>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li><a href="#features" className="hover:text-deepblue">Features</a></li>
                <li><a href="#screenshots" className="hover:text-deepblue">Screenshots</a></li>
                <li><a href="#feedback" className="hover:text-deepblue">Feedback</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Resources</p>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li><a href="#" className="hover:text-deepblue">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-deepblue">Terms of Use</a></li>
                <li><a href="#" className="hover:text-deepblue">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Contact</p>
              <p className="mt-4 text-slate-600">support@monilog.app</p>
              <div className="mt-4 flex items-center gap-3 text-slate-500">
                <span>Twitter</span>
                <span>LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">© 2026 MoniLog. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
