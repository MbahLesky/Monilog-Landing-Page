import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Privacy Policy | MoniLog',
  description:
    'How MoniLog collects, uses, stores, and deletes your information across the Android app, the web app, and the WhatsApp bot.'
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="21 August 2026"
      summary="MoniLog is a personal finance tracker. This policy explains what information we collect, why we collect it, where it is stored, and how you can get it back or delete it — across the Android app, the web app, and the MoniLog WhatsApp bot."
    >
      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        MoniLog (&ldquo;MoniLog&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is an
        offline-first personal and small-business finance tracker, currently in closed beta.
        This policy covers every MoniLog surface:
      </p>
      <ul>
        <li>the MoniLog <strong>Android app</strong>;</li>
        <li>the MoniLog <strong>web app</strong>;</li>
        <li>the MoniLog <strong>WhatsApp bot</strong>, which lets you log and query transactions by chat;</li>
        <li>this <strong>website</strong>, including the beta signup and waitlist.</li>
      </ul>
      <p>
        For anything in this policy, contact{' '}
        <a href="mailto:mbahlesky4@gmail.com">mbahlesky4@gmail.com</a>.
      </p>

      <h2 id="short-version">2. The short version</h2>
      <div className="callout">
        <ul>
          <li>Your financial records are yours. We do not sell them, rent them, or use them for advertising.</li>
          <li>MoniLog works offline: entries are written to your device first.</li>
          <li>If you create an account and sign in, your ledger is synced to Google Firebase so it appears on your other devices and in WhatsApp.</li>
          <li>The WhatsApp bot only reads messages you send to it, and only replies to numbers you have linked yourself.</li>
          <li>You can export your data at any time, and you can ask us to delete everything.</li>
        </ul>
      </div>

      <h2 id="what-we-collect">3. What we collect</h2>

      <h3>3.1 Information you give us</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Where it comes from</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Account details</strong> — email address, display name, profile photo, and phone number if you add one</td>
              <td>Signing up with email or Google, or adding your phone number in the app</td>
            </tr>
            <tr>
              <td><strong>Financial records</strong> — transaction amounts, dates, categories, notes, account names and balances, transfers</td>
              <td>Entries you create in the app, import from CSV, or send to the WhatsApp bot</td>
            </tr>
            <tr>
              <td><strong>Preferences</strong> — currency, language, theme, reminder settings, categories</td>
              <td>Onboarding and settings</td>
            </tr>
            <tr>
              <td><strong>WhatsApp messages</strong> — your WhatsApp phone number and the text of messages you send to the MoniLog bot</td>
              <td>Messaging the bot</td>
            </tr>
            <tr>
              <td><strong>Beta program details</strong> — your email address, an invite code if you used one, and your acceptance of the Beta Tester Agreement</td>
              <td>Beta signup, waitlist, and feedback forms on this website</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>3.2 Information collected automatically</h3>
      <ul>
        <li>
          <strong>Diagnostics.</strong> Crash reports and performance data (Firebase Crashlytics and
          Performance Monitoring), including device model, operating system version, and app version.
        </li>
        <li>
          <strong>Usage events.</strong> Anonymous product analytics such as &ldquo;transaction
          created&rdquo; or &ldquo;screen viewed&rdquo; (Firebase Analytics), and page views on this
          website (Vercel Analytics). These events do not include your financial figures.
        </li>
        <li>
          <strong>Server logs.</strong> Our services record technical logs — timestamps, error
          messages, and, for the WhatsApp bot, the sending phone number when a message fails to
          process. Logs are kept for troubleshooting and rotate out over time.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> collect your contacts, your location, your photos, your bank
        credentials, or your SMS messages. MoniLog never connects to your bank or mobile money
        account: every figure in MoniLog is one you entered yourself.
      </p>

      <h2 id="how-we-use-it">4. How we use your information</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Data used</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Run the product — store your ledger, compute balances and analytics, sync between your devices</td>
              <td>Account details, financial records, preferences</td>
            </tr>
            <tr>
              <td>Answer your WhatsApp messages and write the entries they describe</td>
              <td>WhatsApp phone number, message text</td>
            </tr>
            <tr>
              <td>Identify which MoniLog account a WhatsApp number belongs to</td>
              <td>Phone number, account id</td>
            </tr>
            <tr>
              <td>Fix crashes and improve the app</td>
              <td>Diagnostics, usage events, server logs</td>
            </tr>
            <tr>
              <td>Run the closed beta — invite codes, tester records, feedback, and beta updates</td>
              <td>Email address, invite code, agreement acceptance</td>
            </tr>
            <tr>
              <td>Keep the service secure and prevent abuse</td>
              <td>Account details, server logs</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We rely on your consent (which you can withdraw) and on the necessity of processing to
        provide a service you asked for. We do not use your data for advertising or automated
        decision-making, and we never sell it.
      </p>

      <h2 id="whatsapp">5. The WhatsApp bot</h2>
      <p>
        MoniLog offers an optional WhatsApp bot built on the WhatsApp Business Platform (Meta&rsquo;s
        Cloud API). Using it is entirely voluntary — the app works fully without it.
      </p>
      <ul>
        <li>
          <strong>You opt in by linking your number.</strong> The bot only responds to phone numbers
          that have been linked to a MoniLog account. An unlinked number gets a message explaining
          how to link, and nothing is stored.
        </li>
        <li>
          <strong>We only see messages you send to the bot.</strong> We have no access to any other
          WhatsApp conversation, to your contacts, or to your WhatsApp profile beyond the phone
          number that messages us.
        </li>
        <li>
          <strong>What happens to a message.</strong> The text is parsed to work out an amount, date,
          category, and account, and the resulting transaction is saved to your MoniLog ledger. The
          note you typed is stored as part of that transaction. We do not keep a separate transcript
          of your chat.
        </li>
        <li>
          <strong>Replies.</strong> Replies are delivered through Meta&rsquo;s WhatsApp Business
          Platform, so Meta processes them under its own terms and privacy policy. Messages in
          WhatsApp are end-to-end encrypted in transit between you and the WhatsApp Business
          Platform.
        </li>
        <li>
          <strong>We never message you first.</strong> The bot only ever replies to a message you
          send. We do not send marketing, promotions, or newsletters over WhatsApp.
        </li>
        <li>
          <strong>Stopping.</strong> Stop messaging the bot at any time, ask us to unlink your
          number, or block the number in WhatsApp. Unlinking does not delete your ledger — see{' '}
          <a href="/data-deletion">deleting your data</a>.
        </li>
      </ul>

      <h2 id="where-stored">6. Where your data is stored</h2>
      <p>
        MoniLog is offline-first. Entries are written to storage on your own device (the Android
        app&rsquo;s local database, or your browser&rsquo;s storage on the web) and work with no
        connection at all. If you are signed in, that data is also synced to the cloud so it reaches
        your other devices and the WhatsApp bot.
      </p>
      <p>
        Cloud data is held in Google Firebase (Firestore and Firebase Authentication), on servers
        operated by Google. Each account&rsquo;s records are stored under its own user id and
        protected by security rules so that one account cannot read another&rsquo;s data. Your data
        may be processed in countries other than your own, including the United States and the
        European Union.
      </p>

      <h2 id="sharing">7. Who else processes your data</h2>
      <p>
        We do not sell your personal information and we do not share it with advertisers. We use a
        small number of service providers to run MoniLog, and they may only process your data on our
        instructions:
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>What it does for MoniLog</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google (Firebase, Google Cloud)</td>
              <td>Sign-in, cloud database and sync, crash reporting, analytics</td>
            </tr>
            <tr>
              <td>Meta Platforms (WhatsApp Business Platform)</td>
              <td>Delivering messages between you and the MoniLog bot</td>
            </tr>
            <tr>
              <td>Railway</td>
              <td>Hosting the WhatsApp bot service</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Hosting this website and the web app, plus page analytics</td>
            </tr>
            <tr>
              <td>Supabase</td>
              <td>Storing beta invite codes and the beta waitlist</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We may also disclose information where the law requires it, or where it is necessary to
        investigate abuse or protect the safety of our users.
      </p>

      <h2 id="retention">8. How long we keep it</h2>
      <ul>
        <li><strong>Your ledger and account:</strong> kept until you delete the data or ask us to close your account.</li>
        <li><strong>Local device data:</strong> stays on your device until you clear it, reset the app data, or uninstall the app.</li>
        <li><strong>Server and diagnostic logs:</strong> kept for a short troubleshooting window and then rotated out.</li>
        <li><strong>Beta waitlist and tester records:</strong> kept for the duration of the beta program, then removed.</li>
      </ul>

      <h2 id="your-rights">9. Your choices and rights</h2>
      <ul>
        <li><strong>Access and export.</strong> Export your transactions to CSV, or take a full local backup, from the app&rsquo;s data settings.</li>
        <li><strong>Correct.</strong> Edit or delete any entry in the app, or send <em>edit</em> and <em>undo</em> to the WhatsApp bot.</li>
        <li><strong>Delete.</strong> Reset local app data from settings, or request full deletion of your account and cloud data — see <a href="/data-deletion">Delete your data</a>.</li>
        <li><strong>Withdraw consent.</strong> Sign out to stop syncing, unlink your phone number to stop using WhatsApp, or stop using MoniLog entirely.</li>
        <li><strong>Complain.</strong> If you are unhappy with how we handle your data, write to us first — we would rather fix it directly.</li>
      </ul>
      <p>
        Depending on where you live, you may also have rights to object to or restrict processing, and
        to receive your data in a portable format. Email us and we will honour those requests.
      </p>

      <h2 id="security">10. Security</h2>
      <ul>
        <li>All traffic between the apps, the bot, and our services runs over HTTPS.</li>
        <li>Cloud records are stored per account and protected by database security rules.</li>
        <li>Incoming WhatsApp webhooks are cryptographically verified, so only genuine messages from the WhatsApp Business Platform are processed.</li>
        <li>Access to production credentials is limited to the people who operate the service.</li>
      </ul>
      <p>
        No system is perfectly secure, and MoniLog is beta software. Please keep your own backups
        using the export feature, and do not rely on the beta as your only financial record.
      </p>

      <h2 id="children">11. Children</h2>
      <p>
        MoniLog is not directed at children under 16, and we do not knowingly collect their data. If
        you believe a child has given us personal information, contact us and we will delete it.
      </p>

      <h2 id="changes">12. Changes to this policy</h2>
      <p>
        We will update this page when our practices change, and we will change the &ldquo;last
        updated&rdquo; date at the top. If a change is significant, we will tell beta testers
        directly. Continuing to use MoniLog after an update means you accept the revised policy.
      </p>

      <h2 id="contact">13. Contact us</h2>
      <p>
        Questions, requests, or complaints about privacy:{' '}
        <a href="mailto:mbahlesky4@gmail.com">mbahlesky4@gmail.com</a>. We aim to reply within seven
        days.
      </p>
    </LegalPage>
  );
}
