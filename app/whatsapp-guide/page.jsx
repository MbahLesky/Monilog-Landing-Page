import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'WhatsApp Guide | MoniLog',
  description:
    'Every message you can send the MoniLog WhatsApp bot: logging money, asking about your balance and summaries, and fixing mistakes.'
};

export default function WhatsAppGuidePage() {
  return (
    <LegalPage
      title="Every message you can send"
      updated="7 September 2026"
      bodyClassName="guide-prose"
      summary="Text your ledger the way you would text a person. Send an amount to log it, ask a question to read it back, fix mistakes in one line. Everything lands in the MoniLog apps on the next sync."
    >
      <div className="callout">
        <p>
          <strong>Before your first message:</strong> the bot only answers numbers linked to a
          MoniLog account. Add your WhatsApp number in the app under{' '}
          <em>Settings &rarr; Profile</em>. An unlinked number gets a welcome message explaining
          this instead of a reply.
        </p>
      </div>

      <h2 id="log-money">1. Log money</h2>
      <p>
        One message, one transaction. The only required part is the amount &mdash; everything else
        is optional and can come in any order.
      </p>

      <div className="thread">
        <div className="msg out">-5000 food</div>
        <div className="msg in">{`✅ Expense logged
-5,000 FCFA · Food
🗓 today
💰 Balance: 128,400 FCFA`}</div>
        <div className="msg out">+50000 salary</div>
        <div className="msg in">{`✅ Income logged
+50,000 FCFA · Salary
🗓 today
💰 Balance: 178,400 FCFA`}</div>
        <div className="msg out">2000 taxi yesterday cash</div>
        <div className="msg in">{`✅ Expense logged
-2,000 FCFA · Transport
🗓 yesterday
💰 Balance: 176,400 FCFA`}</div>
        <div className="msg out">spent 3k on lunch with the team</div>
        <div className="msg in">{`✅ Expense logged
-3,000 FCFA · Food
📝 lunch with team
🗓 today
💰 Balance: 173,400 FCFA`}</div>
      </div>

      <div className="cards">
        <div className="card">
          <h3>The amount</h3>
          <ul>
            <li><code>5000</code> &mdash; a plain number</li>
            <li><code>5k</code> = 5 000, <code>2.5k</code> = 2 500</li>
            <li><code>1m</code> = 1 000 000</li>
            <li><code>2,5k</code> &mdash; comma decimals work too</li>
            <li><code>5000f</code>, <code>5000fcfa</code>, <code>5000xaf</code> &mdash; the currency word is ignored</li>
          </ul>
        </div>
        <div className="card">
          <h3>Expense or income?</h3>
          <p>Decided in this order:</p>
          <ul>
            <li>A leading sign &mdash; <code>-5000</code> or <code>+5000</code></li>
            <li>
              A verb &mdash; <code>spent</code>, <code>paid</code>, <code>bought</code>,{' '}
              <code>cost</code>, or <code>received</code>, <code>got</code>, <code>earned</code>{' '}
              (and <code>d&eacute;pens&eacute;</code>, <code>pay&eacute;</code>,{' '}
              <code>re&ccedil;u</code>, <code>gagn&eacute;</code>)
            </li>
            <li>The category&rsquo;s own type &mdash; <code>salary</code> is income</li>
            <li>Nothing matched: expense</li>
          </ul>
        </div>
        <div className="card">
          <h3>The note</h3>
          <p>
            Whatever is left after the amount, date, account and category becomes the note. Filler
            words (<code>on</code>, <code>for</code>, <code>the</code>, <code>de</code>,{' '}
            <code>pour</code>&hellip;) are dropped. With nothing left over, the note is just the
            category name.
          </p>
        </div>
      </div>

      <h3>Dates you can type</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Write</th>
              <th>Means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>today</code> <code>now</code> <code>aujourdhui</code></td>
              <td>Today</td>
            </tr>
            <tr>
              <td><code>yesterday</code> <code>hier</code></td>
              <td>Yesterday</td>
            </tr>
            <tr>
              <td><code>monday</code> &hellip; <code>sunday</code>, <code>lundi</code> &hellip; <code>dimanche</code></td>
              <td>The most recent past one &mdash; <code>monday</code> sent on a Monday means <em>last</em> Monday</td>
            </tr>
            <tr>
              <td><code>12/07</code> <code>12-07</code> <code>12.07</code></td>
              <td>Day and month, this year</td>
            </tr>
            <tr>
              <td><code>12/07/2026</code> <code>12/07/26</code></td>
              <td>Day, month, year</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>No date word means right now. Dates are day-first, never month-first.</p>

      <h3>Accounts you can name</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Write</th>
              <th>Goes to</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cash</code> <code>espece</code> <code>liquide</code></td>
              <td>Your cash account</td>
            </tr>
            <tr>
              <td><code>bank</code> <code>banque</code> <code>account</code></td>
              <td>Your bank account, if you have created one</td>
            </tr>
            <tr>
              <td><code>momo</code> <code>mtn</code> <code>orange</code> <code>om</code> <code>wave</code></td>
              <td>Your mobile money account</td>
            </tr>
            <tr>
              <td>any word from an account name</td>
              <td>That account &mdash; <code>ecobank</code> finds one called &ldquo;Ecobank Savings&rdquo;</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>No account word means your default account.</p>

      <h3>Categories the bot knows</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Words that match it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Salary</strong></td>
              <td><span className="tag income">Income</span></td>
              <td>salary &middot; wage &middot; wages &middot; pay &middot; paycheck &middot; salaire &middot; paie</td>
            </tr>
            <tr>
              <td><strong>Freelance</strong></td>
              <td><span className="tag income">Income</span></td>
              <td>freelance &middot; gig &middot; contract &middot; client</td>
            </tr>
            <tr>
              <td><strong>Business</strong></td>
              <td><span className="tag income">Income</span></td>
              <td>business &middot; sales &middot; sale &middot; profit &middot; revenue &middot; affaires &middot; vente</td>
            </tr>
            <tr>
              <td><strong>Gift</strong></td>
              <td><span className="tag income">Income</span></td>
              <td>gift &middot; present &middot; donation &middot; cadeau &middot; don</td>
            </tr>
            <tr>
              <td><strong>Food</strong></td>
              <td><span className="tag expense">Expense</span></td>
              <td>food &middot; lunch &middot; dinner &middot; breakfast &middot; meal &middot; groceries &middot; restaurant &middot; eat &middot; chop &middot; nourriture &middot; repas &middot; manger</td>
            </tr>
            <tr>
              <td><strong>Transport</strong></td>
              <td><span className="tag expense">Expense</span></td>
              <td>transport &middot; taxi &middot; bus &middot; fare &middot; fuel &middot; gas &middot; petrol &middot; uber &middot; moto &middot; bike &middot; essence &middot; carburant</td>
            </tr>
            <tr>
              <td><strong>Bills</strong></td>
              <td><span className="tag expense">Expense</span></td>
              <td>bill &middot; bills &middot; rent &middot; electricity &middot; power &middot; water &middot; internet &middot; wifi &middot; subscription &middot; facture &middot; loyer &middot; eau</td>
            </tr>
            <tr>
              <td><strong>Shopping</strong></td>
              <td><span className="tag expense">Expense</span></td>
              <td>shopping &middot; clothes &middot; clothing &middot; shoes &middot; achats &middot; vetements &middot; habits</td>
            </tr>
            <tr>
              <td><strong>Health</strong></td>
              <td><span className="tag expense">Expense</span></td>
              <td>health &middot; medicine &middot; hospital &middot; doctor &middot; pharmacy &middot; clinic &middot; sante &middot; medecin &middot; hopital</td>
            </tr>
            <tr>
              <td><strong>Airtime</strong></td>
              <td><span className="tag expense">Expense</span></td>
              <td>airtime &middot; credit &middot; data &middot; recharge &middot; topup &middot; forfait &middot; unites</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Your own categories work too: a word matching one of their names wins over the defaults, as
        long as the type lines up. A message with no recognisable category is still logged &mdash;
        it just lands uncategorised.
      </p>

      <h2 id="ask">2. Ask about your money</h2>

      <div className="thread">
        <div className="msg out">balance</div>
        <div className="msg in">💰 Your balance is 173,400 FCFA.</div>
        <div className="msg out">spent food this month</div>
        <div className="msg in">📉 You spent 34,500 FCFA on Food this month.</div>
        <div className="msg out">summary</div>
        <div className="msg in">{`📊 Summary
💰 Balance: 173,400 FCFA

All time
📈 Income: 1,250,000 FCFA
📉 Expenses: 1,076,600 FCFA
➖ Net: 173,400 FCFA

This month
📈 Income: 250,000 FCFA
📉 Expenses: 76,600 FCFA
➖ Net: 173,400 FCFA

This week
📈 Income: 0 FCFA
📉 Expenses: 10,000 FCFA
➖ Net: -10,000 FCFA`}</div>
        <div className="msg out">last 5</div>
        <div className="msg in">{`🧾 Last 5:
-3,000 FCFA · Food · today
-5,000 FCFA · Food · today
-2,000 FCFA · Transport · yesterday
+50,000 FCFA · Salary · today
-12,000 FCFA · Bills · 18 Aug 2026`}</div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Ask</th>
              <th>Also accepts</th>
              <th>You get</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>balance</code></td>
              <td><code>bal</code> <code>solde</code></td>
              <td>Money across all your accounts right now</td>
            </tr>
            <tr>
              <td><code>spent food this month</code></td>
              <td><code>spend</code> <code>depense</code> <code>how much&hellip;</code> <code>combien&hellip;</code></td>
              <td>
                Total spent, narrowed to one category if you name one. Leave it out (
                <code>spent this week</code>) for everything.
              </td>
            </tr>
            <tr>
              <td><code>summary</code></td>
              <td><code>report</code> <code>resume</code> <code>rapport</code> <code>overview</code></td>
              <td>Income, expenses and net for all time, this month and this week at once</td>
            </tr>
            <tr>
              <td><code>summary this week</code></td>
              <td><code>summary total</code> <code>summary today</code> <code>summary this year</code></td>
              <td>The same figures for one window only</td>
            </tr>
            <tr>
              <td><code>last 5</code></td>
              <td><code>recent</code> <code>history</code> <code>historique</code> <code>liste</code></td>
              <td>Your latest entries &mdash; 5 by default, up to 20 with <code>last 20</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Periods</h3>
        <p>
          Add any of these to <code>spent</code> or <code>summary</code>: <code>today</code>,{' '}
          <code>this week</code> / <code>semaine</code>, <code>this month</code> / <code>mois</code>,{' '}
          <code>this year</code> / <code>annee</code>, <code>all</code> / <code>total</code> /{' '}
          <code>tout</code>. A bare <code>summary</code> reports all time, this month and this week
          together; <code>spent</code> on its own means this month. Weeks start on Monday.
        </p>
      </div>

      <h2 id="fix">3. Fix a mistake</h2>
      <p>
        All four act on your <strong>most recent entry</strong>, so send them right after the
        message you want to fix.
      </p>

      <div className="thread">
        <div className="msg out">edit amount 6000</div>
        <div className="msg in">{`✏️ Updated amount to -6,000 FCFA.
💰 Balance: 170,400 FCFA`}</div>
        <div className="msg out">edit category transport</div>
        <div className="msg in">✏️ Moved last entry to Transport.</div>
        <div className="msg out">edit note dinner with Ada</div>
        <div className="msg in">✏️ Updated note to &ldquo;dinner with Ada&rdquo;.</div>
        <div className="msg out">undo</div>
        <div className="msg in">{`↩️ Removed -6,000 FCFA · Transport.
💰 Balance: 176,400 FCFA`}</div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Send</th>
              <th>Also accepts</th>
              <th>Does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>undo</code></td>
              <td><code>annuler</code> <code>delete last</code> <code>supprimer</code> <code>cancel</code></td>
              <td>Deletes the last entry &mdash; it disappears from the apps on the next sync</td>
            </tr>
            <tr>
              <td><code>edit amount 6000</code></td>
              <td><code>edit last amount 6k</code> <code>modifier montant&hellip;</code></td>
              <td>Changes the amount and keeps the type</td>
            </tr>
            <tr>
              <td><code>edit category transport</code></td>
              <td><code>edit cat&hellip;</code> <code>modifier categorie&hellip;</code></td>
              <td>Moves it to another category</td>
            </tr>
            <tr>
              <td><code>edit note team lunch</code></td>
              <td><code>edit description&hellip;</code> <code>edit libelle&hellip;</code></td>
              <td>Replaces the note with everything after <code>note</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="unstuck">4. Get unstuck</h2>
      <div className="thread">
        <div className="msg out">help</div>
        <div className="msg in">{`📒 MoniLog — log money by chat.

Add:
• -5000 food (expense)
• +50000 salary (income)
• 2000 taxi yesterday cash

Ask: balance · spent food this month · summary · last 5
Fix: undo · edit amount 6000 · edit category transport`}</div>
        <div className="thread-note">a greeting opens the same menu</div>
        <div className="msg out">hello</div>
        <div className="msg in">📒 MoniLog — log money by chat. &hellip;</div>
      </div>
      <p>
        Any of these opens the menu: <code>help</code>, <code>menu</code>, <code>aide</code>,{' '}
        <code>start</code>, <code>commands</code>, <code>hi</code>, <code>hello</code>,{' '}
        <code>bonjour</code>, <code>salut</code>, <code>?</code>. A message the bot cannot read comes
        back as <em>&ldquo;I didn&rsquo;t catch that&rdquo;</em> &mdash; and nothing is logged.
      </p>

      <h2 id="good-to-know">5. Good to know</h2>
      <div className="cards">
        <div className="card">
          <h3>One message, one entry</h3>
          <p>
            Only the first amount counts. <code>5000 food 2000 taxi</code> logs a single 5 000
            expense &mdash; send two messages instead.
          </p>
        </div>
        <div className="card">
          <h3>Accounts win over categories</h3>
          <p>
            <code>mtn</code> and <code>orange</code> are read as your mobile money account, not as
            Airtime. Write <code>2000 airtime mtn</code> to get both.
          </p>
        </div>
        <div className="card">
          <h3>Categories match one word</h3>
          <p>
            Matching happens word by word, so a two-word category needs the word that identifies it
            &mdash; <code>gym</code> for &ldquo;Gym &amp; Fitness&rdquo;.
          </p>
        </div>
        <div className="card">
          <h3>&ldquo;spent&rdquo; does two jobs</h3>
          <p>
            With an amount it logs (<code>spent 3k lunch</code>). Without one it asks (
            <code>spent lunch this week</code>).
          </p>
        </div>
        <div className="card">
          <h3>Accents and capitals free</h3>
          <p>
            <code>D&eacute;pens&eacute;</code> and <code>depense</code> are the same word to the bot.
          </p>
        </div>
        <div className="card">
          <h3>It shows up everywhere</h3>
          <p>
            Anything logged here appears in the web and mobile apps on the next sync, in your
            account currency.
          </p>
        </div>
      </div>
    </LegalPage>
  );
}
