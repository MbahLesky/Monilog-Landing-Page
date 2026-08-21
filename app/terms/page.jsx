import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Terms of Use | MoniLog',
  description:
    'The terms that apply when you use the MoniLog Android app, web app, WhatsApp bot, and website during the closed beta.'
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="21 August 2026"
      summary="These terms apply when you use MoniLog — the Android app, the web app, the WhatsApp bot, and this website. By using any of them, you agree to what follows."
    >
      <h2 id="service">1. The service</h2>
      <p>
        MoniLog is an offline-first personal and small-business finance tracker. You record your own
        income, expenses, accounts, and transfers, and MoniLog organises them into balances,
        categories, and reports. MoniLog does not connect to your bank or mobile money provider and
        never moves money — every figure in the app is one you entered.
      </p>
      <p>
        MoniLog is currently in <strong>closed beta</strong>. Beta testers are additionally covered by
        the MoniLog Beta Tester Agreement shown when you join.
      </p>

      <h2 id="account">2. Your account</h2>
      <ul>
        <li>You may use MoniLog without an account. Creating one enables sync, the web app, and the WhatsApp bot.</li>
        <li>Give accurate details when you sign up, and keep your sign-in credentials to yourself.</li>
        <li>You are responsible for activity under your account, including messages sent to the WhatsApp bot from a number linked to it.</li>
        <li>You must be at least 16 years old to use MoniLog.</li>
      </ul>

      <h2 id="whatsapp">3. The WhatsApp bot</h2>
      <ul>
        <li>Using the bot is optional, and it only works with a phone number linked to your MoniLog account.</li>
        <li>Only link a number you control. Do not link someone else&rsquo;s number.</li>
        <li>Messages you send create real entries in your ledger. Check what was logged — the bot confirms every entry, and <em>undo</em> reverses the last one.</li>
        <li>The bot replies to your messages only. It never sends marketing.</li>
        <li>Message delivery depends on WhatsApp and Meta, and is subject to their terms and availability.</li>
      </ul>

      <h2 id="acceptable-use">4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use MoniLog for anything illegal, including recording or facilitating fraudulent activity;</li>
        <li>attempt to access another person&rsquo;s account or data;</li>
        <li>probe, overload, or disrupt our services, or send automated traffic to the bot;</li>
        <li>copy, resell, or reverse-engineer the app except where the law allows it.</li>
      </ul>

      <h2 id="your-data">5. Your data</h2>
      <p>
        Your financial records belong to you. We handle them as described in the{' '}
        <a href="/privacy">Privacy Policy</a>, and you can export or delete them at any time — see{' '}
        <a href="/data-deletion">Delete your data</a>. You grant us only the permission we need to
        store, sync, and display your data back to you.
      </p>

      <h2 id="no-advice">6. Not financial advice</h2>
      <p>
        MoniLog is a record-keeping tool. Its summaries, analytics, and insights are informational
        only and are not financial, tax, accounting, or legal advice. Decisions you make based on
        them are your own.
      </p>

      <h2 id="beta">7. Beta software, availability, and changes</h2>
      <ul>
        <li>Beta features can change, break, or be removed without notice.</li>
        <li>We do not guarantee uptime, uninterrupted sync, or that data will never be lost. Export regularly.</li>
        <li>We may modify or discontinue any part of MoniLog, including the WhatsApp bot.</li>
        <li>We may suspend or close accounts that breach these terms.</li>
      </ul>

      <h2 id="ip">8. Ownership</h2>
      <p>
        MoniLog, its name, logo, design, and software are ours. These terms give you a personal,
        non-exclusive, revocable licence to use the service — nothing more is transferred.
      </p>

      <h2 id="liability">9. Disclaimer and liability</h2>
      <p>
        MoniLog is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of
        any kind to the extent the law permits. We are not liable for lost profits, lost data, or
        indirect or consequential losses arising from your use of MoniLog. Nothing here limits
        liability that cannot lawfully be limited.
      </p>

      <h2 id="termination">10. Ending your use</h2>
      <p>
        You may stop using MoniLog at any time by uninstalling the app and requesting deletion of your
        data. Sections on ownership, disclaimers, and liability survive.
      </p>

      <h2 id="changes">11. Changes to these terms</h2>
      <p>
        We will update this page when the terms change and revise the &ldquo;last updated&rdquo; date.
        Significant changes will be announced to beta testers. Continued use means you accept the
        revised terms.
      </p>

      <h2 id="law">12. Governing law</h2>
      <p>
        These terms are governed by the laws of the Republic of Cameroon, and disputes are subject to
        the courts of Cameroon, without affecting any mandatory rights you have where you live.
      </p>

      <h2 id="contact">13. Contact</h2>
      <p>
        Email <a href="mailto:mbahlesky4@gmail.com">mbahlesky4@gmail.com</a> with any question about
        these terms.
      </p>
    </LegalPage>
  );
}
