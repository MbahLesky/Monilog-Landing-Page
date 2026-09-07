import Link from 'next/link';

// The landing page owns scrolling through .snap-container, and globals.css keeps
// the document itself from scrolling. Legal routes therefore need their own
// scroll viewport, or their content would be unreachable below the fold.
export default function LegalPage({ title, updated, summary, bodyClassName = '', children }) {
  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-primary"
        >
          <span aria-hidden="true">&larr;</span> Back to MoniLog
        </Link>

        <header className="mt-10 border-b border-slate-800/80 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            MoniLog Finance Tracker
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated {updated}</p>
          {summary && <p className="mt-6 text-lg leading-relaxed text-slate-300">{summary}</p>}
        </header>

        <div className={`legal-prose mt-4 ${bodyClassName}`.trimEnd()}>{children}</div>

        <footer className="mt-16 border-t border-slate-800/80 pt-8 text-sm text-slate-500">
          <p>
            Questions about this document? Email{' '}
            <a href="mailto:mbahlesky4@gmail.com" className="text-primary hover:text-white">
              mbahlesky4@gmail.com
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/whatsapp-guide" className="hover:text-primary">WhatsApp guide</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
            <Link href="/data-deletion" className="hover:text-primary">Delete your data</Link>
          </div>
          <p className="mt-6">&copy; 2026 MoniLog. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
