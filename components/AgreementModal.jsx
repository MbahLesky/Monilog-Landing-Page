'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { AGREEMENT_VERSION, agreementMeta, agreementSections } from '../lib/betaAgreement';

function AgreementItem({ item }) {
  if (typeof item === 'string') return <>{item}</>;
  return (
    <>
      <span className="font-semibold text-slate-100">{item.lead}</span> {item.text}
    </>
  );
}

function AgreementSection({ section }) {
  const ListTag = section.ordered ? 'ol' : 'ul';
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-white">{section.title}</h3>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-7 text-slate-300">{paragraph}</p>
      ))}

      {section.items && (
        <ListTag className={`space-y-2 text-sm leading-6 text-slate-300 ${section.ordered ? 'list-decimal pl-5' : ''}`}>
          {section.items.map((item, index) => (
            <li key={typeof item === 'string' ? item : item.lead} className={section.ordered ? '' : 'flex items-start gap-3'}>
              {!section.ordered && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
              <span>
                <AgreementItem item={item} />
              </span>
            </li>
          ))}
        </ListTag>
      )}

      {section.trailingParagraphs?.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-7 text-slate-300">{paragraph}</p>
      ))}

      {section.subsections?.map((sub) => (
        <div key={sub.title} className="space-y-1.5">
          <h4 className="text-sm font-semibold text-primary">{sub.title}</h4>
          <p className="text-sm leading-7 text-slate-300">{sub.body}</p>
        </div>
      ))}

      {section.severities && (
        <dl className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800">
          {section.severities.map((severity) => (
            <div key={severity.level} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
              <dt className="flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-100 sm:w-24">
                <span className={`h-2.5 w-2.5 rounded-full ${severity.color}`} />
                {severity.level}
              </dt>
              <dd className="text-sm leading-6 text-slate-300">{severity.description}</dd>
            </div>
          ))}
        </dl>
      )}

      {section.callout && (
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">{section.callout.title}</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-300">
            {section.callout.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function AgreementModal() {
  const { user, isAgreementOpen, closeAgreement, acceptAgreement } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Move focus into the dialog on open so screen readers and keyboard users
  // land on the agreement rather than the page behind it.
  useEffect(() => {
    if (isAgreementOpen) dialogRef.current?.focus();
  }, [isAgreementOpen]);

  // Reset the tick every time the agreement is presented — consent has to be a
  // deliberate action each time it is asked for.
  useEffect(() => {
    if (isAgreementOpen) {
      setAgreed(false);
      setSubmitting(false);
    }
  }, [isAgreementOpen]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!isAgreementOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isAgreementOpen]);

  // ESC to dismiss + focus trap. Dismissing does not accept — the download stays
  // gated until the box is ticked.
  useEffect(() => {
    if (!isAgreementOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAgreement();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAgreementOpen, closeAgreement]);

  if (!mounted || !isAgreementOpen) return null;

  const handleAccept = async () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    await acceptAgreement();
  };

  const signedName = user?.displayName || user?.email || '';

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-modal-title"
        tabIndex={-1}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 shadow-soft"
      >
        <header className="shrink-0 border-b border-slate-800 px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">MoniLog Closed Beta</p>
          <h2 id="agreement-modal-title" className="mt-2 text-2xl font-semibold text-white">
            Beta Tester Agreement
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Please read this before downloading the app. You need to accept it once to join the beta.
          </p>
        </header>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8">
          <dl className="grid gap-x-6 gap-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:grid-cols-2">
            {agreementMeta.map((entry) => (
              <div key={entry.label}>
                <dt className="text-xs uppercase tracking-widest text-slate-500">{entry.label}</dt>
                <dd className="mt-1 text-sm text-slate-200">{entry.value}</dd>
              </div>
            ))}
          </dl>

          {agreementSections.map((section) => (
            <AgreementSection key={section.title} section={section} />
          ))}
        </div>

        <footer className="shrink-0 space-y-4 border-t border-slate-800 bg-slate-950/60 px-6 py-5 sm:px-8">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-200">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-600 bg-slate-900 accent-primary"
            />
            <span>
              I have read and agree to the MoniLog Beta Tester Agreement, including the confidentiality
              terms in Section 6.
              {signedName && (
                <span className="mt-1 block text-xs text-slate-500">
                  Signing as {signedName} · version {AGREEMENT_VERSION}
                </span>
              )}
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleAccept}
              disabled={!agreed || submitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {submitting ? 'Please wait…' : 'Agree & continue'}
            </button>
            <button
              type="button"
              onClick={closeAgreement}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 sm:w-auto"
            >
              Not now
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
