'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const deviceTypes = ['Android Phone', 'Android Tablet', 'Other'];
const financeFrequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Rarely'];

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    deviceType: deviceTypes[0],
    rating: '5',
    financeFrequency: financeFrequencyOptions[1],
    favoriteFeature: '',
    problemsEncountered: '',
    suggestedFeatures: '',
    overallFeedback: '',
    futureTester: false
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [lastSubmittedAt, setLastSubmittedAt] = useState(null);

  const isDisabled = status === 'submitting' || (lastSubmittedAt && Date.now() - lastSubmittedAt < 3000);
  const userAgent = useMemo(() => (typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent), []);
  const browserLanguage = useMemo(() => (typeof navigator === 'undefined' ? 'unknown' : navigator.language), []);

  useEffect(() => {
    if (status === 'success') {
      const timer = window.setTimeout(() => setStatus('idle'), 6000);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isDisabled) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus('error');
      setMessage('Please provide your name and email address.');
      return;
    }

    setStatus('submitting');
    setMessage('Sending feedback...');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
        deviceType: formData.deviceType,
        rating: Number(formData.rating),
        financeFrequency: formData.financeFrequency,
        favoriteFeature: formData.favoriteFeature.trim(),
        problemsEncountered: formData.problemsEncountered.trim(),
        suggestedFeatures: formData.suggestedFeatures.trim(),
        overallFeedback: formData.overallFeedback.trim(),
        futureTester: formData.futureTester,
        createdAt: serverTimestamp(),
        userAgent,
        browserLanguage,
        platform: typeof navigator === 'undefined' ? 'unknown' : navigator.platform,
        referrer: typeof document === 'undefined' ? 'unknown' : document.referrer,
        screenSize: typeof window === 'undefined' ? 'unknown' : `${window.screen.width}x${window.screen.height}`,
        version: '1.0.0-beta'
      };

      await addDoc(collection(db, 'feedback'), payload);
      setStatus('success');
      setMessage('Thank you! Your feedback has been submitted.');
      setLastSubmittedAt(Date.now());
      setFormData((current) => ({ ...current, favoriteFeature: '', problemsEncountered: '', suggestedFeatures: '', overallFeedback: '' }));
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Unable to submit feedback right now. Please try again later.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Name</span>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Country</span>
          <input
            type="text"
            value={formData.country}
            onChange={(event) => handleChange('country', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Device Type</span>
          <select
            value={formData.deviceType}
            onChange={(event) => handleChange('deviceType', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {deviceTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Experience Rating</span>
          <select
            value={formData.rating}
            onChange={(event) => handleChange('rating', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>How often do you manage your finances?</span>
          <select
            value={formData.financeFrequency}
            onChange={(event) => handleChange('financeFrequency', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {financeFrequencyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="space-y-2 text-sm text-slate-700">
        <span>Favorite Feature</span>
        <input
          type="text"
          value={formData.favoriteFeature}
          onChange={(event) => handleChange('favoriteFeature', event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <label className="space-y-2 text-sm text-slate-700">
        <span>Problems Encountered</span>
        <textarea
          value={formData.problemsEncountered}
          onChange={(event) => handleChange('problemsEncountered', event.target.value)}
          rows="4"
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <label className="space-y-2 text-sm text-slate-700">
        <span>Suggested Features</span>
        <textarea
          value={formData.suggestedFeatures}
          onChange={(event) => handleChange('suggestedFeatures', event.target.value)}
          rows="4"
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <label className="space-y-2 text-sm text-slate-700">
        <span>Overall Feedback</span>
        <textarea
          value={formData.overallFeedback}
          onChange={(event) => handleChange('overallFeedback', event.target.value)}
          rows="4"
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={formData.futureTester}
          onChange={(event) => handleChange('futureTester', event.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
        />
        Would you like to join future testing programs?
      </label>
      <button
        type="submit"
        disabled={isDisabled}
        className="inline-flex w-full items-center justify-center rounded-full bg-deepblue px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#152F6A]"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
      </button>
      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
