import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import AgreementModal from '../components/AgreementModal';
import GoogleOneTap from '../components/GoogleOneTap';
import FirebaseAnalyticsInit from '../components/FirebaseAnalyticsInit';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'MoniLog | Personal Finance Beta',
  description: 'MoniLog is an offline-first personal finance tracker in beta testing. Track income, expenses, accounts, transfers, and insights.',
  metadataBase: new URL('https://monilog.vercel.app'),
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
