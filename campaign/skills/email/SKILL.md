# Email Campaign Skill

## Name
campaign-email

## Description
Handles all campaign email operations: sending thank-you emails to petition signers, campaign updates, personal replies, and triaging incoming email responses. Uses Zoho Mail via Composio or Netlify Functions. Maintains send logs, unsubscribe handling, and template management. Designed for a campaign supporting seniors, disabled persons, and military veterans.

## Triggers
- "send thank-you email" — send a petition-signature acknowledgment
- "send campaign update" — email all petition signers about a campaign development
- "reply to email" — respond to an individual who replied to a campaign email
- "handle unsubscribe" — remove an address from future sends
- "triage incoming email" — route a received email to the correct campaign role
- "log email send" — record a send in the campaign send log
- "email template" — retrieve or create an email template

## When to invoke
Use this skill for any campaign email task: sending, replying, logging, unsubscribing, or routing email.

## Role ownership
- **Communications Officer** — owns this skill and all outgoing campaign emails
- **David's Assistant** — sends personal replies on David's behalf
- **Triage Officer** — routes incoming email to the correct role holder
- **Campaign Chief** — approves all public-facing email content

## Files
- `campaign/roles/communications-officer.md` — role definition
- `campaign/roles/triage-officer.md` — routing definition
- `emails/sent-log.md` — de-identified send log (committed)
- `emails/private/sent-log.csv` — full send log with PII (gitignored, local only)
- `netlify/functions/submission-created.js` — automatic thank-you on petition submission
