// Content of the MoniLog Beta Tester Agreement, kept as data so the modal stays
// a pure renderer. Bump AGREEMENT_VERSION whenever the terms change materially —
// acceptance is stored per version, so a bump re-prompts everyone who accepted
// an older one.
export const AGREEMENT_VERSION = '1.0';

export const agreementMeta = [
  { label: 'Program', value: 'MoniLog Closed Beta' },
  { label: 'Platform', value: 'Android, Web & WhatsApp' },
  { label: 'Duration', value: '8 weeks from your first install' },
  { label: 'Access', value: 'Free — premium features unlocked for all testers' },
  { label: 'Feedback', value: 'WhatsApp group + Google Form' },
  { label: 'Confidentiality', value: 'Required — details in Section 6' }
];

// Each section renders in order. `items` entries may be a plain string or a
// { lead, text } pair when the source document bolds a lead-in phrase.
export const agreementSections = [
  {
    title: '1. Welcome to the MoniLog Beta',
    paragraphs: [
      'Thank you for joining the MoniLog beta program. You are among the first people to use MoniLog, a personal and small-business finance tracker designed to work offline, across mobile, web, and WhatsApp.',
      'Your feedback during this beta phase is critical. You are not just a tester; you are helping shape the product. We appreciate your time, your honesty, and your willingness to help us build something better.'
    ]
  },
  {
    title: '2. What Is MoniLog?',
    paragraphs: [
      'MoniLog is an offline-first personal finance tracking app that helps you record income, expenses, and account transfers without needing an internet connection. It works with your local currency and supports cash, bank, mobile money, savings, and investment accounts.',
      'During this beta you will be testing the MVP (Minimum Viable Product), which includes:'
    ],
    items: [
      'Onboarding with name, language, and currency setup',
      'Account creation and opening balance entry',
      'Transaction recording (income & expenses)',
      'Money transfers between accounts',
      'Dashboard with balance summaries and analytics',
      'Category management',
      'CSV import and local JSON backup/restore',
      'Settings including reminders, themes, and tutorials'
    ]
  },
  {
    title: '3. What to Expect as a Beta Tester',
    subsections: [
      {
        title: '3.1 This is a beta, not a final release',
        body: 'The app is functional but may have bugs, incomplete screens, or missing features. Expect rough edges. That is exactly why we need you.'
      },
      {
        title: '3.2 You will receive updates',
        body: 'New builds will be pushed to your Firebase App Distribution link during the beta period. You will receive a notification to update. Please install updates promptly so your feedback stays relevant to the latest version.'
      },
      {
        title: '3.3 Some features may change or be removed',
        body: 'Based on tester feedback, we may add, change, or remove features before the public launch. Your input directly influences these decisions.'
      },
      {
        title: '3.4 Data is stored locally on your device',
        body: 'All your data in this beta is saved only on your device. It is not sent to any server. If you uninstall the app, your data will be lost. You can use the local backup feature to export and restore your data.'
      }
    ]
  },
  {
    title: '4. Tester Responsibilities',
    paragraphs: ['By joining this beta program, you agree to:'],
    ordered: true,
    items: [
      { lead: 'Install:', text: 'Install the app and complete the onboarding flow.' },
      { lead: 'Explore:', text: 'Test all core features at least once, including transactions, transfers, categories, and export.' },
      { lead: 'Report:', text: 'Report bugs, crashes, or confusing behaviour with enough detail for us to reproduce the issue.' },
      { lead: 'Give feedback:', text: 'Complete the feedback form at the end of the beta period, and optionally after major updates.' },
      { lead: 'Stay active:', text: 'Keep the app installed for the full 8-week beta period if possible.' },
      { lead: 'Communicate:', text: 'Let us know in the tester WhatsApp group if you are unable to continue.' }
    ],
    callout: {
      title: 'What makes a good bug report?',
      items: [
        'What were you trying to do?',
        'What did you expect to happen?',
        'What actually happened?',
        'Steps to reproduce, if you can',
        'Screenshot or screen recording, if possible'
      ]
    }
  },
  {
    title: '5. What You Get',
    paragraphs: ['As a thank-you for your time and feedback, all beta testers receive:'],
    items: [
      { lead: 'Free premium:', text: 'Full access to all premium features at no cost once premium features launch.' },
      { lead: 'First access:', text: 'Early access to the app before it is available to the public.' },
      { lead: 'Recognition:', text: 'Recognition as a founding tester on the MoniLog acknowledgements list, with your consent.' },
      { lead: 'Direct access:', text: 'A direct line to the founder to share ideas, not just bug reports.' },
      { lead: 'Priority:', text: 'Priority consideration for extended beta access and future early-access programs.' }
    ]
  },
  {
    title: '6. Confidentiality',
    paragraphs: ['The MoniLog beta is a closed, private program. By joining, you agree to keep the following confidential:'],
    items: [
      'The app itself, its screens, features, and any functionality you encounter',
      'Any information shared in the tester WhatsApp group',
      'Conversations with the MoniLog team about product direction',
      'Any unreleased features or roadmap information discussed'
    ],
    trailingParagraphs: [
      'Please do not share the Firebase distribution link with anyone outside the beta group, post screenshots of the app on public social media, or discuss unreleased features publicly without written permission from MoniLog.'
    ],
    callout: {
      title: 'Why confidentiality matters',
      items: [
        'We share our roadmap and unfinished work openly with testers.',
        'To keep doing that, we need to trust that what stays in the group, stays in the group.',
        'Thank you for respecting this.'
      ]
    }
  },
  {
    title: '7. Privacy & Your Data',
    paragraphs: [
      'The MoniLog MVP is fully offline. Your financial data is stored only on your device and is never transmitted to any server during this beta phase.',
      'The only data we collect from testers is:'
    ],
    items: [
      'Crash reports and performance data via Firebase Crashlytics and Firebase Performance Monitoring',
      'App usage events via Firebase Analytics — no personal or financial data, only events like "transaction created" or "screen viewed"',
      'Feedback you voluntarily submit via the Google Form or WhatsApp group'
    ],
    trailingParagraphs: [
      'We do not collect your financial records. Your participation in this beta does not require you to share any personal financial information with us.'
    ]
  },
  {
    title: '8. How to Report Bugs & Give Feedback',
    subsections: [
      {
        title: '8.1 WhatsApp group',
        body: 'For quick bug reports, questions, and general conversation, use the tester WhatsApp group. Post a short description of what happened, with a screenshot if possible. We monitor the group actively.'
      },
      {
        title: '8.2 Google Form',
        body: 'For structured feedback, especially at the end of the beta, use the feedback Google Form shared in the WhatsApp group or on this website. This helps us gather consistent, actionable data from all testers.'
      }
    ],
    severities: [
      { level: 'Critical', color: 'bg-rose-500', description: 'App crashes, data is lost, feature is completely broken' },
      { level: 'High', color: 'bg-orange-500', description: 'Feature works but produces wrong results' },
      { level: 'Medium', color: 'bg-amber-400', description: 'Feature works but is confusing or hard to use' },
      { level: 'Low', color: 'bg-emerald-500', description: 'Minor visual issue, typo, or small improvement suggestion' }
    ]
  },
  {
    title: '9. Beta Duration & Exit',
    paragraphs: [
      "The beta runs for 8 weeks from your first app install. After the beta period ends, your access may be extended at the team's discretion, or you will be notified about the public launch.",
      'If you need to exit the beta early for any reason, please let us know in the WhatsApp group. There is no obligation to continue — we just appreciate the heads-up so we can adjust our tester count.'
    ]
  },
  {
    title: '10. Disclaimer',
    paragraphs: [
      'The MoniLog beta is provided "as is" for testing purposes. We make no guarantees about data persistence, uptime, or feature completeness during the beta phase. Please do not use the beta app as your sole financial record-keeping tool. Export your data regularly using the local backup feature.',
      'MoniLog Finance Tracker is not responsible for any data loss that occurs during the beta testing period.'
    ]
  },
  {
    title: '11. Your Agreement',
    paragraphs: [
      'By installing and using the MoniLog beta app, you confirm that you have read, understood, and agreed to the terms outlined in this document.',
      'If you have any questions, reach out in the WhatsApp group or contact the MoniLog team directly.'
    ]
  }
];
