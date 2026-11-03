# Email send log

De-identified record of campaign emails sent to petition signers. No email
addresses are stored in the repository.

The local, unredacted tracker lives at `emails/private/sent-log.csv` and is
excluded by `.gitignore`. It holds the name, email address, Netlify unit, and
message ID for each recipient, and is the source of truth for this table.

To check whether a given address appears here:

```bash
printf '%s' 'someone@example.com' | sha256sum | cut -c1-12
```

Compare the output against the `Recipient` column.

## 2026-11-02 — CSOS decision in Complaint One

**Subject:** CSOS decision in Complaint One is now available
**From:** `info@soraliavillagecampaign.org.za`
**Sent via:** Composio → Zoho Mail (`accountId` 7009601000000008002)
**Audience:** Netlify Forms `petition` signers

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `a12cd76e8335` | 2026-11-02 | `1793626209220138400` | sent |
| 2 | `a0153d3825d3` | 2026-11-02 | `1793626213461138300` | sent |
| 3 | `5800ee156ef1` | 2026-11-02 | `1793626218205155300` | sent |
| 4 | `a46b47ffc940` | 2026-11-02 | `1793626222198155100` | sent |

Total: 4 recipients, 4 sent, 0 failed.

## 2026-11-02 — Thank-you backfill

**Subject:** Thank you for signing the Soralia Village petition
**From:** `info@soraliavillagecampaign.org.za`
**Sent via:** Composio → Zoho Mail (`accountId` 7009601000000008002)
**Audience:** Existing signers who predated the automatic thank-you

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `a12cd76e8335` | 2026-11-02 | `1793628954505155300` | sent |
| 2 | `a0153d3825d3` | 2026-11-02 | `1793628955412155300` | sent |
| 3 | `a46b47ffc940` | 2026-11-02 | `1793629292887138300` | sent |

Total: 3 recipients, 3 sent, 0 failed.

These were sent manually. New signers receive the same email automatically via
`netlify/functions/submission-created.js`.

## 2026-11-02 — Personal reply to John Wilke

**Subject:** Re: Thank you for signing the Soralia Village petition
**From:** `info@soraliavillagecampaign.org.za`
**Sent via:** Composio → Zoho Mail (`accountId` 7009601000000008002)
**Audience:** John Wilke (reply to his CSOS-related question)

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `a12cd76e8335` | 2026-11-02 | `1793649489026138300` | sent |

Total: 1 recipient, 1 sent, 0 failed.

This was a one-on-one reply, not a campaign blast. David's assistant asked about his garage situation and penalties.

## 2026-11-03 — John Wilke: strategy reply and draft formal dispute

**Subject:** Re: Thank you for signing the Soralia Village petition — a stronger route than "reasonable accommodation"
**From:** `info@soraliavillagecampaign.org.za`
**Sent via:** Composio → Zoho Mail (`accountId` 7009601000000008002)
**To:** John Wilke (cc: David)
**Attachment:** `john-wilke-formal-dispute-DRAFT.docx` (draft letter for his attorney to review)
**Approval:** Tier 3, sent on the principal's explicit individual authorisation.
**Review chain:** Legal Officer and Campaign Chief review **not obtained** — both roles unstaffed on the day. The charter's "a human sends" rule was overridden by the principal for this item. Recorded here so the audit trail is accurate.

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `a12cd76e8335` | 2026-11-03 | `1793706352404138400` | sent |
| 2 | `a12cd76e8335` | 2026-11-03 | `1793715990844155100` | sent |

Total: 2 recipients, 2 sent, 0 failed.

One-on-one replies. The first advised a formal waiver application, disputed the fines against the clause 10.2 cap, and asked him to obtain his own attorney's review. Included the BackaBuddy link with an explicit statement that no donation was expected.

**Correction and attachments — message `1793715990844155100`.**
**Subject:** Correction to the letter I sent you — read this before you give the letter to your attorney
**Attachments:** `john-wilke-formal-dispute-v2-DRAFT.docx`, `john-wilke-clause-13-2-6-notice-DRAFT.docx`
**Approval:** Tier 3, sent on the principal's explicit individual authorisation ("send to john").
**Review chain:** Legal Officer and Campaign Chief review not obtained — both roles unstaffed. Principal override recorded, as above.

Withdrew three claims the evidence did not support (the R500 cap, "the constitution does not ban it", other-units precedent), and disclosed two adverse clauses (13.2.3(b) on window dimensions, 13.2.4 on colour) rather than leaving them for the trustees to raise. Introduced the clause 13.2.6 dispute process and clause 7.2, and asked for the Conduct Rules and the source of "Conduct Rule 5.1".

**Signature convention.** Both messages above were signed "David's assistant". From 2026-11-03 the role signs **"Max, assistant to David Lewis"** (see `campaign/roles/06-davids-assistant.md`). Later correspondence in this thread should use the new form, and any reply from John addressed to "David's assistant" is still him.

## Adding future sends

1. Send the email through Composio/Zoho Mail and capture each `messageId`.
2. Append the rows to `emails/private/sent-log.csv` with the recipient's real
   address and the message ID.
3. Add a de-identified row to this file using the first 12 characters of the
   SHA-256 hash of the lowercased address.
4. Commit only this file, never `emails/private/`.
