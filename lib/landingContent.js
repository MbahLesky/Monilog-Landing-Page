// Static content for the Moniilog landing page

export const navItems = ['Features', 'Screenshots', 'Why Moniilog', 'Coming Soon', 'FAQ'];
export const apkDownloadUrl = '/downloads/Monilog-v1.2.1.apk';
export const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://monilog-web.vercel.app';

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
    description: 'Manage multiple accounts locally and in the cloud.',
    points: ['Cash, Bank, and MoMo', 'Track balances', 'Account summaries', 'Financial organization'],
    label: 'Accounts Screen'
  },
  {
    title: 'Money Transfers & Fees',
    description: 'Move money between accounts effortlessly with fee tracking.',
    points: ['Account-to-account transfers', 'Transfer history', 'Transfer fee support'],
    label: 'Transfers Screen'
  },
  {
    title: 'Analytics & Insights',
    description: 'Understand where your money goes with visual breakdown.',
    points: ['Spending analysis', 'Income trends', 'Financial summaries', 'Visual reports'],
    label: 'Analytics Screen'
  },
  {
    title: 'Conversational WhatsApp Bot',
    description: 'Log and query transactions straight from WhatsApp.',
    points: ['Log expenses by chat (-5000 food)', 'Check balance instantly', 'Bilingual EN/FR commands'],
    label: 'WhatsApp Bot'
  },
  {
    title: 'Offline-First & Local Control',
    description: 'Full functionality even without internet connection.',
    points: ['Local database storage', 'Instant app launches', 'Automatic background sync'],
    label: 'Offline-First'
  },
  {
    title: 'Categories & Organization',
    description: 'Sort every transaction into clear, custom categories.',
    points: ['Custom categories', 'Category filtering', 'Spending breakdowns', 'Icon & color tagging'],
    label: 'Categories Screen'
  },
  {
    title: 'Import & Export',
    description: 'Keep control of your data with standard portability.',
    points: ['CSV import', 'CSV export', 'Data portability', 'Local backups'],
    label: 'Import / Export Screen'
  }
];

export const screenshotItems = [
  {
    title: 'Dashboard',
    description: 'A clean overview of your accounts, balance, and quick actions.',
    tag: 'Home',
    type: 'dashboard'
  },
  {
    title: 'Transactions',
    description: 'Fast transaction entry with smart category suggestions.',
    tag: 'Entry',
    type: 'transaction'
  },
  {
    title: 'Transfers',
    description: 'Seamless transfers between cash, bank, and mobile money accounts.',
    tag: 'Transfer',
    type: 'transfer'
  },
  {
    title: 'Analytics',
    description: 'Interactive visual breakdown of spending and income trends.',
    tag: 'Insights',
    type: 'analytics'
  },
  {
    title: 'Accounts',
    description: 'Full control over multiple balances and financial institutions.',
    tag: 'Accounts',
    type: 'accounts'
  }
];

export const whyItems = [
  {
    title: 'Offline-First',
    body: 'Designed for real-world connectivity. Log expenses immediately without loading spinners or internet dependency.'
  },
  {
    title: 'Privacy & Control',
    body: 'Your financial data is protected by strong row-level security and local storage. No unwanted telemetry or data selling.'
  },
  {
    title: 'Conversational WhatsApp Logging',
    body: 'Too busy to open an app? Just send a quick WhatsApp message like "-2000 taxi" and it syncs straight into your ledger.'
  },
  {
    title: 'Built for Multi-Account Realities',
    body: 'Cash, MTN MoMo, Orange Money, and Bank accounts work together with transfer fee tracking out of the box.'
  }
];

export const roadmapItems = [
  {
    title: 'WhatsApp Conversational AI',
    description: 'Natural language parsing for effortless financial logging and smart balance checks via WhatsApp.',
    points: ['Message-based logging', 'Quick reminders', 'Less manual entry']
  },
  {
    title: 'App Lock / Biometrics',
    description: 'Add biometric fingerprint and PIN protection so your ledger stays private on shared devices.',
    points: ['Passcode or PIN', 'Biometric readiness', 'Secure app access']
  },
  {
    title: 'Native iOS Version',
    description: 'Bring the full Moniilog experience to iPhone with native iOS release.',
    points: ['Native iOS app', 'Feature parity with Android', 'App Store release']
  },
  {
    title: 'Advanced Budgeting & Goals',
    description: 'Set category spending limits and track savings goals with visual milestones.',
    points: ['Category budgets', 'Savings goals', 'Overspending alerts']
  }
];

export const faqs = [
  {
    q: 'What is Moniilog?',
    a: 'Moniilog is a modern personal finance tracking system designed for fast, offline-first money management, multi-account transfers, and conversational WhatsApp expense logging.'
  },
  {
    q: 'Is Moniilog free?',
    a: 'Yes! Moniilog is free to download and use for personal finance tracking.'
  },
  {
    q: 'Can I use Moniilog offline?',
    a: 'Absolutely. Moniilog is built offline-first. Your transactions and balances are stored locally on your device and sync seamlessly to the cloud whenever you are connected.'
  },
  {
    q: 'How does the WhatsApp bot work?',
    a: 'Once your WhatsApp number is connected, simply send messages like "-5000 food", "+50000 salary", or "balance" to log transactions and check your totals directly in chat.'
  },
  {
    q: 'What platforms are supported?',
    a: 'Moniilog is available as an Android APK, a Progressive Web App (PWA) on any browser, and via our WhatsApp bot. Native iOS is coming soon.'
  }
];
