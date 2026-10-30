import './globals.css';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Moniilog | Smart Personal Finance & WhatsApp Tracking',
  description: 'Moniilog is an offline-first personal finance tracker with conversational WhatsApp logging. Track income, expenses, accounts, transfers, and insights.',
  metadataBase: new URL('https://moniilog.com'),
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
        {children}
      </body>
    </html>
  );
}
