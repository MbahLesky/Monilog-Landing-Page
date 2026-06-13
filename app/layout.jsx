import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
