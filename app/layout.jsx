import './globals.css';
import { Poppins } from 'next/font/google';
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

// Poppins is the brand typeface (docs/brand_visual_language.md), and it is what
// both apps render in. Weights are the ones the doc calls for: body regular,
// section titles and buttons 600, large headings 700. Self-hosted by next/font
// rather than fetched from Google at runtime.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
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
