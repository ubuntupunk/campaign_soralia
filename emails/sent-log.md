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

## Adding future sends

1. Send the email through Composio/Zoho Mail and capture each `messageId`.
2. Append the rows to `emails/private/sent-log.csv` with the recipient's real
   address and the message ID.
3. Add a de-identified row to this file using the first 12 characters of the
   SHA-256 hash of the lowercased address.
4. Commit only this file, never `emails/private/`.
