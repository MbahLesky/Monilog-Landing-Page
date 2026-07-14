'use client';

import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

export default function MediaPlaceholder({ item, className = '' }) {
  const reduceMotion = usePrefersReducedMotion();
  const mediaPath = item?.gif;
  const isVideo = typeof mediaPath === 'string' && /\.(mp4|webm|ogg)$/i.test(mediaPath);

  if (mediaPath) {
    return (
      <div className={`overflow-hidden rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 ${className}`.trim()}>
        {isVideo ? (
          <video src={mediaPath} autoPlay loop muted playsInline className="h-full w-full object-cover" />
        ) : (
          <img src={mediaPath} alt={`${item?.title ?? 'Preview'} preview`} className="h-full w-full object-cover" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] border border-slate-800/70 bg-slate-950/90 p-4 shadow-inner transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl ${className}`.trim()}>
      <div className={`media-placeholder-shimmer absolute inset-0 ${reduceMotion ? 'opacity-40' : ''}`} />
      <div className="relative flex min-h-[12rem] items-center justify-center rounded-[1.25rem] border border-dashed border-slate-700/80 bg-slate-900/70 p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M8 13l2.5-2.5 2 2 3.5-4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white">Preview coming soon</p>
          <p className="mt-2 text-xs leading-6 text-slate-400">A polished screenshot or GIF will appear here when it is ready.</p>
        </div>
      </div>
    </div>
  );
}
