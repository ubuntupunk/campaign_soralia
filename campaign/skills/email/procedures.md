# Email Handling Procedures

Soralia Village Campaign — email operations for the campaign supporting seniors, disabled persons, and military veterans.

## Sending principles

1. **No PII in the repository.** Recipient names and email addresses are never committed. The committed `emails/sent-log.md` refers to people by opaque `member_id` (`m-001`, `m-002`, …). The mapping and the full send record live in `emails/private/` (gitignored). Never commit an address, a name, or a hash of an address — an unsalted hash of a known address confirms it rather than hiding it.
2. **Every email includes an unsubscribe line.** Reply with "Unsubscribe" or email `info@soraliavillagecampaign.org.za` with "Unsubscribe" in the subject line.
3. **Every email includes the "not legal advice" disclaimer.** Each account stands on its own facts.
4. **Every email states the campaign position.** Automatic handovers are ultra vires clauses 7.6.8 and 8.6 of the Constitution.
5. **Individual sends preferred over BCC.** Protects recipient privacy and improves deliverability.
6. **Signed appropriately.** Campaign emails are from Soralia Village Community Action; personal replies are signed **"Max, assistant to David Lewis"**. Use the full form, not "David's assistant" and not "Max" alone — recipients are dealing with a stranger and should be able to see both who is writing and on whose behalf.

## Send types

### 1. Petition thank-you (automatic)
Triggered by Netlify `submission-created` event → `netlify/functions/submission-created.js`. Sends immediately after someone submits the petition form.

### 2. Campaign update (manual)
Sent to all petition signers when there is campaign news (e.g. CSOS decision available). Uses the HTML template in `emails/2026-11-02-csos-decision.html`.

### 3. Personal reply (manual)
One-on-one reply to an individual who responded to a campaign email. Example: reply to John Wilke about his garage penalties.

### 4. Unsubscribe confirmation
Confirm removal from the mailing list. Remove the address from `emails/private/sent-log.csv`.

## Before sending

1. Identify the correct role holder (see `campaign/roles/`).
2. Use or adapt an approved template — do not improvise campaign positions.
3. Confirm the recipient has not unsubscribed (check `emails/private/sent-log.csv`).
4. Draft the email, then have the Campaign Chief review if it contains any public position statement.
5. Send individually via Zoho Mail (`ZOHO_MAIL_MESSAGES_SEND_EMAIL`).
6. Log the send in `emails/private/sent-log.csv` and add a de-identified row to `emails/sent-log.md`.

## Incoming email triage

All replies to campaign emails arrive at `info@soraliavillagecampaign.org.za`. The Triage Officer:

1. Logs each reply (date, sender, subject, summary)
2. Categorises:
   - **Legal/CSOS** → Legal Officer
   - **Welfare/help (seniors, disabled, veterans)** → Welfare Liaison
   - **Personal to David** → David's Assistant
   - **General campaign question** → General Organiser
   - **Unsubscribe** → Communications Officer (remove from list)
3. Sends an acknowledgment using a template
4. Tracks until resolution

## Email templates

### Thank-you (petition signup)
File: rendered by `netlify/functions/submission-created.js`
Covers: thanks, what happens next, how to help, if you need help, stay in touch, unsubscribe.

### Campaign update
File: `emails/2026-11-02-csos-decision.html`
Covers: decision summary, what it does/doesn't decide, ultra vires position, links to order/PDF/why page, unsubscribe.

### Personal reply
Adapted per situation. Must sign as **"Max, assistant to David Lewis"** when sent on David's behalf.

## Zoho Mail setup

Required Netlify environment variables (set via `netlify env:set`):
- `ZOHO_CLIENT_ID` — secret
- `ZOHO_CLIENT_SECRET` — secret
- `ZOHO_REFRESH_TOKEN` — secret
- `ZOHO_ACCOUNT_ID` — `7009601000000008002`
- `ZOHO_FROM_ADDRESS` — `info@soraliavillagecampaign.org.za`
- `ZOHO_DC` — `com`

Send via:
```
composio execute ZOHO_MAIL_MESSAGES_SEND_EMAIL -d '{ "accountId": "...", "fromAddress": "...", "toAddress": "...", "subject": "...", "content": "...", "mailFormat": "html" }'
```

## Privacy and compliance

- POPIA-compliant: member data is collected for campaign purposes only
- No selling or sharing of petition signer data
- Unsubscribe requests honored immediately
- Case registers and send logs kept locally, never committed with PII
