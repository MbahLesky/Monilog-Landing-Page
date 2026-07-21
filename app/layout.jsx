import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import AgreementModal from '../components/AgreementModal';
import GoogleOneTap from '../components/GoogleOneTap';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { initializeFirebaseAnalytics } from '../lib/firebase';

export const metadata = {
  title: 'MoniLog | Personal Finance Beta',
  description: 'MoniLog is an offline-first personal finance tracker in beta testing. Track income, expenses, accounts, transfers, and insights.',
  metadataBase: new URL('https://monilog.example.com'),
  icons: [
    {
      rel: 'icon',
      url: '/icons/monilog_icon.png',
      type: 'image/png'
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VercelAnalytics />
        <AuthProvider>
          {children}
          <AuthModal />
          <AgreementModal />
          <GoogleOneTap />
        </AuthProvider>
        <FirebaseAnalyticsInit />
      </body>
    </html>
  );
}

function FirebaseAnalyticsInit() {
  if (typeof window === 'undefined') return null;

  initializeFirebaseAnalytics().catch(() => {});
  return null;
}
