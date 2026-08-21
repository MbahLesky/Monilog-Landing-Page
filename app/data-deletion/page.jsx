import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Delete your data | MoniLog',
  description:
    'How to delete your MoniLog data — on your device, in the cloud, and for the WhatsApp bot — and how to request full account deletion.'
};

export default function DataDeletionPage() {
  return (
    <LegalPage
      title="Delete your data"
      updated="21 August 2026"
      summary="You can clear MoniLog from your device yourself, and you can ask us to erase your account and everything synced to the cloud. Here is exactly how, and what happens after."
    >
      <h2 id="on-device">1. Delete the data on your device</h2>
      <p>You control this yourself, and it takes effect immediately:</p>
      <ul>
        <li>
          <strong>Android app:</strong> open <em>Settings &rarr; Reset app data</em>. This clears
          transactions, accounts, categories, reminders, and sync history from the phone. Uninstalling
          the app also removes them.
        </li>
        <li>
          <strong>Web app:</strong> open <em>Settings &rarr; Reset app data</em> to clear the ledger
          stored in that browser.
        </li>
      </ul>
      <div className="callout">
        <p>
          Resetting local data does not delete anything already synced to the cloud, and it does not
          close your account. If you are signed in, signing back in will pull your ledger down again.
          To erase the cloud copy, use the request below.
        </p>
      </div>

      <h2 id="whatsapp">2. Stop using the WhatsApp bot</h2>
      <ul>
        <li>Simply stop messaging it — the bot never messages you first.</li>
        <li>
          Send <em>undo</em> to remove the entry you just logged, or delete any entry from the app.
        </li>
        <li>
          To unlink your number so the bot no longer recognises it, email us with the subject
          <strong> &ldquo;Unlink my WhatsApp number&rdquo;</strong> from your account&rsquo;s email
          address, or remove the phone number from your profile in the app.
        </li>
      </ul>

      <h2 id="full-deletion">3. Request full deletion of your account and cloud data</h2>
      <p>
        Email <a href="mailto:mbahlesky4@gmail.com?subject=Delete%20my%20MoniLog%20data">
          mbahlesky4@gmail.com
        </a>{' '}
        with the subject <strong>&ldquo;Delete my MoniLog data&rdquo;</strong>, sent from the email
        address on your MoniLog account. Include your WhatsApp number if you used the bot, so we can
        find the link record.
      </p>
      <p>We verify that the request comes from the account holder, then delete:</p>
      <ul>
        <li>your Firebase Authentication account (email, name, profile photo, phone number);</li>
        <li>every record stored under your user id — transactions, accounts, categories, transfers, settings, and notification preferences;</li>
        <li>the link between your WhatsApp number and your account;</li>
        <li>your beta tester record, and your email address on the beta waitlist.</li>
      </ul>
      <p>
        We confirm by email once it is done, normally within <strong>30 days</strong>. Deletion is
        permanent — we cannot restore the data afterwards, so export a CSV or a local backup first if
        you want to keep a copy.
      </p>

      <h2 id="what-remains">4. What may remain afterwards</h2>
      <ul>
        <li>
          <strong>Backups.</strong> Residual copies can persist in our providers&rsquo; routine
          backups for a short period before they expire.
        </li>
        <li>
          <strong>Anonymous analytics.</strong> Aggregated, non-identifying usage counts (for example
          &ldquo;transactions created this week&rdquo;) are not tied to you and are not deleted.
        </li>
        <li>
          <strong>Technical logs.</strong> Server logs rotate out on their own schedule.
        </li>
        <li>
          <strong>Anything on your own device.</strong> Local data and any exports you saved stay with
          you until you delete them.
        </li>
        <li>
          <strong>WhatsApp&rsquo;s own copy.</strong> The chat history in your WhatsApp app belongs to
          your device and Meta&rsquo;s service; delete the conversation in WhatsApp to remove it.
        </li>
      </ul>

      <h2 id="more">5. More detail</h2>
      <p>
        See the <a href="/privacy">Privacy Policy</a> for what we collect and how long we keep it, or
        email <a href="mailto:mbahlesky4@gmail.com">mbahlesky4@gmail.com</a> with any question about
        deletion.
      </p>
    </LegalPage>
  );
}
