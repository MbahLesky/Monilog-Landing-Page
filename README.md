# MoniLog Landing Page

**MoniLog** is the landing page for an offline-first personal finance tracker beta. This repository hosts the marketing site and provides a direct APK download for the Android beta release.

## APK Download

The Android app is available as a direct download from the project:

- `public/downloads/monilog-v1_1-release.apk`

The app landing page includes download buttons that point directly to this APK.

## App Overview

MoniLog is built to help users manage money without forcing an account login. It focuses on fast local storage, offline capability, and easy finance workflows.

### Key features

- Dashboard overview for a quick financial snapshot
- Income and expense tracking
- Multiple account management
- Account-to-account money transfers
- Analytics and insights for spending trends
- CSV import and export for portability
- Personalized onboarding with currency and preference setup
- Settings and customization for categories, notifications, and data management

## Project structure

- `app/` - Next.js app routes and page layout
- `components/` - Reusable React components
- `public/downloads/` - Hosted APK download file
- `public/icons/` - Static app icon assets
- `lib/` - app utilities and Firebase configuration

## Running locally

```bash
npm install
npm run dev
```

Then open the site at `http://localhost:3000`.

## Notes

If you deploy the site, the APK remains available via the app's download buttons and via `/downloads/monilog-v1_1-release.apk`.
