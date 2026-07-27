// Static content for the landing page, kept separate from app/page.jsx so that
// file stays focused on layout/behaviour rather than copy.

export const navItems = ['Features', 'Screenshots', 'Coming Soon', 'Beta Program', 'Feedback'];
export const apkDownloadUrl = '/downloads/Monilog-v1.2.1.apk';

export const features = [
  {
    title: 'Dashboard Overview',
    description: 'See a clear summary of your finances at a glance.',
    points: ['Financial overview', 'Account balances', 'Recent activity', 'Quick access actions'],
    label: 'Dashboard Screen'
  },
  {
    title: 'Income & Expense Tracking',
    description: 'Record every transaction with ease.',
    points: ['Add income', 'Add expenses', 'Edit transactions', 'Transaction details', 'Organized records'],
    label: 'Transaction Entry Screen'
  },
  {
    title: 'Account Management',
    description: 'Manage multiple accounts locally.',
    points: ['Create accounts', 'Track balances', 'Account summaries', 'Financial organization'],
    label: 'Accounts Screen'
  },
  {
    title: 'Money Transfers',
    description: 'Move money between accounts effortlessly.',
    points: ['Account-to-account transfers', 'Transfer history', 'Transfer fee support'],
    label: 'Transfers Screen'
  },
  {
    title: 'Analytics & Insights',
    description: 'Understand where your money goes.',
    points: ['Spending analysis', 'Income trends', 'Financial summaries', 'Visual reports'],
    label: 'Analytics Screen'
  },
  {
    title: 'Import & Export',
    description: 'Keep control of your data.',
    points: ['CSV import', 'CSV export', 'Data portability', 'Local backups'],
    label: 'Import / Export Screen'
  },
  {
    title: 'Personalized Onboarding',
    description: 'Get started in minutes.',
    points: ['Display name setup', 'Language selection', 'Currency selection', 'Starting balance configuration', 'Notification preferences'],
    label: 'Onboarding Screen'
  },
  {
    title: 'Categories & Organization',
    description: 'Sort every transaction into clear, custom categories.',
    points: ['Custom categories', 'Category-based filtering', 'Spending breakdown by category', 'Icon & color tagging'],
    label: 'Categories Screen'
  },
  {
    title: 'Smart Notifications',
    description: 'Stay on top of your finances with timely alerts.',
    points: ['Balance alerts', 'Transaction reminders', 'Customizable notification preferences', 'Low balance warnings'],
    label: 'Notifications Screen'
  }
];

// App screenshots showcased in the "A Closer Look" gallery.
export const screenshotItems = [
  { title: 'Dashboard Overview', gif: '/screenshots/dashboard.webp' },
  { title: 'Add Transaction', gif: '/screenshots/add_transaction.webp' },
  { title: 'Transaction History', gif: '/screenshots/transaction_history.webp' },
  { title: 'Account Management', gif: '/screenshots/accounts.webp' },
  { title: 'Money Transfers', gif: '/screenshots/transfer.webp' },
  { title: 'Analytics & Insights', gif: '/screenshots/analytics.webp' },
  { title: 'Category Management', gif: '/screenshots/category.webp' },
  { title: 'Import & Export', gif: '/screenshots/export_import.webp' },
  { title: 'Notifications', gif: '/screenshots/notifications.webp' },
  { title: 'Personalized Onboarding', gif: '/screenshots/account_setup.webp' },
  { title: 'Currency Selection', gif: '/screenshots/currency.webp' },
  { title: 'Secure Authentication', gif: '/screenshots/authenticate.webp' }
];

export const whyItems = [
  { title: 'Simple', body: 'Designed to be easy for anyone to use.' },
  { title: 'Reliable', body: 'Works even when internet access is unavailable.' },
  { title: 'Built with Users', body: 'Improved continuously based on community feedback.' }
];

export const roadmapItems = [
  {
    title: 'Cloud Sync & Backup',
    description: 'Keep your transactions and account data available across devices with secure Supabase-backed sync.',
    points: ['Cross-device sync', 'Automatic backups', 'Reliable restore flow']
  },
  {
    title: 'Chatbot Transaction Logging',
    description: 'Create entries by describing purchases in plain language, making logging feel effortless.',
    points: ['Voice or text input', 'Smart categorization', 'Fast transaction entry']
  },
  {
    title: 'WhatsApp Integration',
    description: 'Capture expenses and transfers from WhatsApp conversations without leaving your workflow.',
    points: ['Message-based logging', 'Quick reminders', 'Less manual entry']
  },
  {
    title: 'App Lock / PIN',
    description: 'Add an extra layer of protection so your financial data stays private on the device.',
    points: ['Passcode or PIN', 'Biometric readiness', 'Secure app access']
  },
  {
    title: 'iOS Version',
    description: 'Bring the full MoniLog experience to iPhone and iPad with a native iOS release.',
    points: ['Native iOS app', 'Feature parity with Android', 'App Store release']
  },
  {
    title: 'Advanced Analytics',
    description: 'Dive deeper into spending patterns with richer charts and custom reports.',
    points: ['Custom date ranges', 'Category trend charts', 'Exportable reports']
  }
];

// Beta test flows from the Beta Testing Guide (v0, MVP release). Testers work
// through them in order — flows 1 and 2 set up the app state every later flow
// depends on. Flow 9 has no required screenshots; it's a general feedback form.
export const testFlows = [
  {
    id: 1,
    title: 'App Installation',
    objective: 'Accept the invite, install MoniLog, and confirm it launches.',
    points: [
      'Accept the Firebase App Distribution invite',
      'Download from the Firebase email link',
      'Android: allow unknown sources if prompted · iOS/Web: add to your home screen',
      'Launch the app and confirm it reaches the welcome screen'
    ],
    screenshots: 1,
    formUrl: 'https://forms.gle/SoX6cRnf21n1cXot9'
  },
  {
    id: 2,
    title: 'Onboarding & Tutorials',
    objective: 'Complete first-time setup and explore the in-app tutorials.',
    points: [
      'Sign up with email, Google, or one-tap',
      'Set display name, language, and currency',
      'Add starting accounts and opening balances',
      'Enable the daily reminder, then run two tutorials'
    ],
    screenshots: 1,
    formUrl: 'https://forms.gle/HuAnxrRuZaxiBiZi8'
  },
  {
    id: 3,
    title: 'Transactions',
    objective: 'Add, edit, and delete income and expense entries.',
    points: [
      'Add an income transaction with amount, category, and account',
      'Add an expense transaction the same way',
      'Edit one transaction and delete the other',
      'Confirm the dashboard balance updates correctly'
    ],
    screenshots: 2,
    formUrl: 'https://forms.gle/LFBjVjMSTZmDyHTG7'
  },
  {
    id: 4,
    title: 'Transfers & Accounts',
    objective: 'Manage accounts and transfer money between them with a fee.',
    points: [
      'Update an existing account balance',
      'Add a new account and delete a different one',
      'Transfer between accounts, including a fee',
      'Confirm both account balances updated correctly'
    ],
    screenshots: 2,
    formUrl: 'https://forms.gle/MZat2R1BMbYeN7Qe8'
  },
  {
    id: 5,
    title: 'Categories & Analytics',
    objective: 'Create and manage categories, then review the analytics screen.',
    points: [
      'Add a new income category and a new expense category',
      'Assign each to a new transaction',
      'Edit an existing income and expense category',
      'Review Analytics for today, 30 days, and 90 days'
    ],
    screenshots: 3,
    formUrl: 'https://forms.gle/EDrsQ6R62qcGmyim8'
  },
  {
    id: 6,
    title: 'Notifications, Theme, Language & Currency',
    objective: 'Verify reminders, theme switching, and language/currency changes.',
    points: [
      'Confirm the daily reminder fires and appears in your notification bar',
      'Switch between Light and Dark themes',
      'Switch between English and French',
      'Change the currency and confirm it applies app-wide'
    ],
    screenshots: 3,
    formUrl: 'https://forms.gle/ni7jQPkjzkTQ1PRV9'
  },
  {
    id: 7,
    title: 'Export & Import, Backup & Restore',
    objective: 'Test the full data lifecycle end to end.',
    points: [
      'Create a backup, then clear all app data',
      'Restore from the backup and confirm your data matches',
      'Export your data to CSV, then delete some transactions',
      'Import the CSV back and confirm everything is restored'
    ],
    screenshots: 6,
    formUrl: 'https://forms.gle/PqPqiNji36UXsdBTA'
  },
  {
    id: 8,
    title: 'Sign Out & Sign In',
    objective: 'Verify the authentication flow and password recovery.',
    points: [
      'Sign out from Settings',
      'Run the Forgot Password flow from the sign-in screen',
      'Reset your password from the email link',
      'Sign back in and confirm you reach the dashboard'
    ],
    screenshots: 2,
    formUrl: 'https://forms.gle/PzMgYmjwJEwrDXjr7'
  },
  {
    id: 9,
    title: 'General Feedback & Suggestions',
    objective: 'Share your overall impressions beyond the structured test flows.',
    points: [
      'Features you found useful or enjoyable',
      'Anything that felt confusing, slow, or frustrating',
      'Features you expected to find but did not',
      'Any bugs not already covered in another test flow'
    ],
    screenshots: 0,
    formUrl: 'https://forms.gle/rLarW6wYgrFQGz9DA'
  }
];

export const faqs = [
  { q: 'What is MoniLog?', a: 'MoniLog is a modern personal finance tracker designed for fast, offline-first money management without requiring an account.' },
  { q: 'Is MoniLog free?', a: 'Yes. The beta remains free to download and use while we refine the experience with community feedback.' },
  { q: 'Will iOS be supported?', a: 'Yes, an iOS version is on our roadmap as we build on a stable Android beta and strong cross-platform foundations.' },
  { q: 'Can I use MoniLog offline?', a: 'Absolutely. MoniLog is built to work offline and store your data locally for privacy and reliability.' },
  { q: 'How can I submit feedback?', a: 'Sign in and open the Feedback section. Each of the nine test flows has its own form — complete the steps, attach the required screenshots, and submit.' }
];
