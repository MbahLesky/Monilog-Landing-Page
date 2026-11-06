# Moniilog — Landing Page

**Official Product Website & Direct App Distribution**

Moniilog Landing Page is the public marketing website showcasing Moniilog's offline-first privacy, multi-platform synchronization, and WhatsApp bot assistant. It provides direct APK downloads and feature walkthroughs.

---

## Key Features

- **Product Showcase:** Highlights offline-first SQLite/IndexedDB architecture, Supabase cloud sync, and WhatsApp financial bot.
- **Direct APK Distribution:** Hosted Android APK download buttons.
- **Interactive FAQ & Feature Previews:** Responsive FAQ accordion and detailed capability sections.
- **Modern Responsive Design:** Built with Next.js 15, Tailwind CSS, and Framer Motion.

---

## Landing Page Task Registry & Roadmap

> [!IMPORTANT]
> **Workflow Protocol:** Tasks specific to the landing page and marketing distribution are tracked here. When completed, tasks are struck through (`~~[x] ...~~`). Proposed tasks must be approved before implementation.

### Completed Landing Page Milestones
- ~~[x] **LND-001:** Update branding, product copy, and metadata to **Moniilog**~~
- ~~[x] **LND-002:** Remove legacy beta/tester terminology across marketing pages~~
- ~~[x] **LND-003:** Create feature showcase highlighting offline-first privacy, multi-platform sync, and WhatsApp bot~~
- ~~[x] **LND-004:** Implement responsive navigation, hero section, interactive FAQs, and dark mode styling~~
- ~~[x] **LND-005:** Provide direct Android APK download hosting for distribution~~

### Current / In-Progress Tasks
- [ ] **LND-006: Update Production APK Distribution**: Host the latest release build of `app-debug.apk` / signed APK in `public/downloads/`.
- [ ] **LND-007: Live Web App Link**: Connect "Launch Web App" CTA to point to the live hosted web application URL.

### Proposed Upcoming Tasks (Pending Approval)
- [ ] **LND-008: Production Hosting Deployment**: Deploy landing page to Vercel or Netlify with custom domain (`moniilog.com`).
- [ ] **LND-009: Product Demo Video / Interactive Mockup**: Embed interactive preview or video walkthrough of mobile & WhatsApp experience.

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
