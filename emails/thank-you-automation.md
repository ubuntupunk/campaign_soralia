# Automatic thank-you email for petition signers

When someone signs the petition, Netlify fires a `submission-created` event.
The function at `netlify/functions/submission-created.js` picks it up and sends
a thank-you email through the Zoho Mail API.

The signer gets the email within a few seconds, and no third-party automation
service is involved.

## What the email says

- Thanks for signing
- **What happens next** — Complaint One decided, Complaint Two still running
- **How you can help** — share, talk to neighbours, attend meetings, put up a notice, help with costs
- **If you need help** — check your statement, query in writing, reply to us
- **Stay in touch** — site, email, background link
- The ultra vires position on clauses 7.6.8 and 8.6
- Unsubscribe line

Preview it locally without sending anything:

```bash
node scripts/preview-thank-you.js
node scripts/preview-thank-you.js "Thandi Mokoena"
```

The second form shows how a first-name greeting renders.

## One-time setup

### 1. Create a Zoho OAuth client

1. Open the Zoho API Console for your data centre — https://api-console.zoho.com/
2. **Add Client** → **Self Client**
3. Copy the **Client ID** and **Client Secret**
4. Open the **Generate Code** tab
5. Scope: `ZohoMail.messages.CREATE,ZohoMail.accounts.READ`
6. Time duration: 10 minutes
7. Create, and copy the grant code immediately — it is single-use

### 2. Exchange the grant code for a refresh token

```bash
curl -s -X POST "https://accounts.zoho.com/oauth/v2/token" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "client_id=$ZOHO_CLIENT_ID" \
  --data-urlencode "client_secret=$ZOHO_CLIENT_SECRET" \
  --data-urlencode "code=$GRANT_CODE"
```

The response contains `refresh_token`. **It is shown only once.** Store it
somewhere safe.

If your account is on a different data centre, replace `accounts.zoho.com` with
`accounts.zoho.eu`, `accounts.zoho.in`, `accounts.zoho.com.au`, `accounts.zoho.jp`
or `accounts.zoho.ca`.

### 3. Set the Netlify environment variables

```bash
netlify link --id b9062429-0885-4580-ad5f-a80a90fde1e5

netlify env:set ZOHO_CLIENT_ID      "..." --secret
netlify env:set ZOHO_CLIENT_SECRET  "..." --secret
netlify env:set ZOHO_REFRESH_TOKEN  "..." --secret
netlify env:set ZOHO_ACCOUNT_ID     "7009601000000008002"
netlify env:set ZOHO_FROM_ADDRESS   "info@soraliavillagecampaign.org.za"
netlify env:set ZOHO_DC             "com"
```

`ZOHO_DC` defaults to `com` and can be omitted if the account is on the US
data centre.

### 4. Deploy

```bash
git push
```

Netlify builds and registers the function automatically. No `package.json` is
needed — the function uses only Node built-ins and the global `fetch`.

## Testing

Submit the petition form on the deployed site with an address you control. Then:

- Check the Netlify function log: **Site → Logs → Functions → submission-created**
- A success looks like `thank-you: sent to <hash> messageId=<id>`
- Check the Zoho **Sent** folder

To test locally:

```bash
netlify link --id b9062429-0885-4580-ad5f-a80a90fde1e5
netlify env:get ZOHO_CLIENT_ID
netlify dev
```

Then submit the form at `http://localhost:8888`.

## Design notes

- **Always returns 200.** A non-2xx response makes Netlify retry the event,
  which would send duplicate emails. Failures are logged instead.
- **Filters by form name.** Only `form_name === "petition"` is handled, so
  adding more forms later will not trigger this email.
- **No recipient addresses in logs.** Logs record a truncated SHA-256 hash.
- **Netlify filters spam** before firing the event, so honeypot hits are not
  emailed.
- **Refresh tokens can go stale.** If Zoho revokes it after a long period of
  inactivity, the log will show `Zoho token exchange failed`. Repeat step 2.

## Follow-ups worth considering

- **Double opt-in.** Right now anyone can submit someone else's address. Adding
  a confirmation click would make the list defensible.
- **Store the consent record.** Netlify Forms already keeps the submission, but
  there is no record of when a thank-you was sent.
- **Bounce handling.** Hard bounces are not tracked. At this list size that is
  acceptable; at scale it is not.
