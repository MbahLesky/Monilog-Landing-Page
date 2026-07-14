'use client';

export default function Footer() {
  return (
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
  );
}
