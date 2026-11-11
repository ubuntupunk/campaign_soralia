# Email send log

De-identified record of campaign emails sent to petition signers. No email
addresses are stored in the repository.

The local, unredacted trackers live in `emails/private/` and are excluded by
`.gitignore`:

- `sent-log.csv` — the per-send record (recipient, message ID, timestamp). The
  source of truth for the tables below.
- `members.csv` — the mapping from `member_id` to name and address.

## How recipients are referenced

Recipients appear as opaque references (`m-001`, `m-002`, …), not as hashes.
The reference is assigned once per person and follows them across every send,
so a reader can see that the same person received three messages without being
able to tell who that person is.

References were previously the first 12 characters of the SHA-256 of the
lowercased address. That was withdrawn on 2026-11-10: an unsalted hash of a
known address is trivially checkable, so it confirmed rather than concealed
identity. The old values survive in git history and cannot be withdrawn from
it; they are no longer published.

Resolve a reference with:

```bash
scripts/member-ref.py m-001        # ref -> details (reads emails/private/)
scripts/member-ref.py --find EMAIL # address -> ref
```

## 2026-11-02 — CSOS decision in Complaint One

**Subject:** CSOS decision in Complaint One is now available
**From:** `info@soraliavillagecampaign.org.za`
**Sent via:** Composio → Zoho Mail (`accountId` 7009601000000008002)
**Audience:** Netlify Forms `petition` signers

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `m-001` | 2026-11-02 | `1793626209220138400` | sent |
| 2 | `m-002` | 2026-11-02 | `1793626213461138300` | sent |
| 3 | `m-003` | 2026-11-02 | `1793626218205155300` | sent |
| 4 | `m-004` | 2026-11-02 | `1793626222198155100` | sent |

Total: 4 recipients, 4 sent, 0 failed.

## 2026-11-02 — Thank-you backfill

**Subject:** Thank you for signing the Soralia Village petition
**From:** `info@soraliavillagecampaign.org.za`
**Sent via:** Composio → Zoho Mail (`accountId` 7009601000000008002)
**Audience:** Existing signers who predated the automatic thank-you

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `m-001` | 2026-11-02 | `1793628954505155300` | sent |
| 2 | `m-002` | 2026-11-02 | `1793628955412155300` | sent |
| 3 | `m-004` | 2026-11-02 | `1793629292887138300` | sent |

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
| 1 | `m-001` | 2026-11-02 | `1793649489026138300` | sent |

Total: 1 recipient, 1 sent, 0 failed.

This was a one-on-one reply, not a campaign blast. It asked about his garage situation and penalties.

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
| 1 | `m-001` | 2026-11-03 | `1793706352404138400` | sent |
| 2 | `m-001` | 2026-11-03 | `1793715990844155100` | sent |
| 3 | `m-001` | 2026-11-04 | `1793778642921138300` | sent |

Total: 3 recipients, 3 sent, 0 failed.

One-on-one replies. The first advised a formal waiver application, disputed the fines against the clause 10.2 cap, and asked him to obtain his own attorney's review. Included the BackaBuddy link with an explicit statement that no donation was expected.

**Correction and attachments — message `1793715990844155100`.**
**Subject:** Correction to the letter I sent you — read this before you give the letter to your attorney
**Attachments:** `john-wilke-formal-dispute-v2-DRAFT.docx`, `john-wilke-clause-13-2-6-notice-DRAFT.docx`
**Approval:** Tier 3, sent on the principal's explicit individual authorisation ("send to john").
**Review chain:** Legal Officer and Campaign Chief review not obtained — both roles unstaffed. Principal override recorded, as above.

Withdrew three claims the evidence did not support (the R500 cap, "the constitution does not ban it", other-units precedent), and disclosed two adverse clauses (13.2.3(b) on window dimensions, 13.2.4 on colour) rather than leaving them for the trustees to raise. Introduced the clause 13.2.6 dispute process and clause 7.2, and asked for the Conduct Rules and the source of "Conduct Rule 5.1".

**Signature convention.** Both messages above were signed "David's assistant". From 2026-11-03 the role signs **"Max, assistant to David Lewis"** (see `campaign/roles/06-davids-assistant.md`). Later correspondence in this thread should use the new form, and any reply from John addressed to "David's assistant" is still him.

**Reply to his 4 November answer — message `1793778642921138300`.**
**Subject:** You were right about the WhatsApp file — and your two answers close the weakest part of the letter
**Attachment:** `john-wilke-formal-dispute-v2b-2026-11-04-DRAFT.docx`
**Approval:** Tier 3, sent on the principal's instruction ("let him know...").
**Signature:** first message signed "Max, assistant to David Lewis".

Accepted his explanation of the WhatsApp export and withdrew the tampering inference. Recorded his two factual answers (opening not enlarged; frame white aluminium matching all units), which remove clauses 13.2.3(b) and 13.2.4 from the dispute. On his mental state: acknowledged the health impact, offered contact with other owners, promised nothing on his behalf.

Also set out, as instructed, the campaign position that **rusted garage doors are not heritage worth preserving** — the trustees' power is over "harmonious appearance" and a colour scheme, not heritage, and no heritage assessment has ever been produced — and the case for a **Guiding Charter** of community values and freedoms as the reason a **Constitution Refresh** is urgent.

## 2026-11-10 — outreach check-in

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `m-002` | 2026-11-10 | `1794305831058155000` | sent |

Total: 1 recipient, 1 sent, 0 failed.

**Subject:** Checking in — is there anything the HOA is giving you trouble over?
**Approval:** Tier 3, sent on the principal's instruction.
**Signature:** "Max, assistant to David Lewis".

Short personal check-in to a petition signer who had not been heard from since signing. Asked whether the HOA or managing agent was giving her trouble, listed the four complaint types we see most often, and offered basic help while stating plainly that we are residents and not lawyers. No attachment, no case file, no promise of representation. Ends with an explicit invitation to say that everything is fine.

## 2026-11-10 — reply to question about rates and levies

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `m-001` | 2026-11-10 | `1794316994690138400` | sent |

Total: 1 recipient, 1 sent, 0 failed.

**Subject:** carried over from the member's own thread ("Re: Re: You were right about the WhatsApp file …")
**Approval:** Tier 3, sent on the principal's instruction ("send it as a response to his latest email thread").
**Signature:** "Max, assistant to David Lewis".
**Threading:** sent with `ZOHO_MAIL_MESSAGES_REPLY_TO_EMAIL` in reply to the member's message; `In-Reply-To` and `References` set to his Gmail `Message-Id`, so it threads on his side.

The member asked whether every unit pays the same rates and taxes. Answered by separating the three charges that get conflated: municipal rates (City of Cape Town, assessed on each unit's valuation, billed to the owner — his HOA statement carries no rates line at all); HOA levies (apportioned on whatever basis the Constitution fixes, and visible as a uniform monthly figure, R1 201.84 rising to R1 351.84 on 1 August 2026); and metered water and effluent, which cannot match between households (his own ranged from 7 kl to 10 kl in three months).

Advised him to request the levy schedule and the apportionment clause in writing, and to check whether the City's pensioner and disability rates rebate is being applied to his account. Asked which figure a neighbour claims is lower, so a rumour becomes a comparable fact. No case material, no attachment, no promise of representation.

## 2026-11-11 — reply on how to keep the converted garage as a room

| # | Recipient | Sent | Message ID | Status |
|---|---|---|---|---|
| 1 | `m-001` | 2026-11-11 | `1794410522039138400` | sent |

Total: 1 recipient, 1 sent, 0 failed.

**Subject:** "Re: rates and taxes — how to keep the garage as a room" (set explicitly rather than inheriting the thread's subject).
**Approval:** Tier 3, approved by the principal ("2" — reply in-thread with an override subject).
**Signature:** "Max, assistant to David Lewis".
**Threading:** sent with `ZOHO_MAIL_MESSAGES_REPLY_TO_EMAIL` in reply to the member's message of 11 November, so it threads on his side. CC to the campaign principal.

The member wrote twice about the same thing — on 10 November (unprompted, after coming out of hospital, enclosing photographs of a neighbouring property) and again on 11 November ("do you have any assistance or explanation for me and guide lined to keep my garage as is"). Neither message engaged with the earlier rates-and-levies reply.

Answered that there is no automatic right to keep a converted garage, but that the strongest fact is procedural rather than photographic: the member's written application of 3 August 2026 was received and referred to the trustees (the managing agent said so in writing on 12 October) and no trustee has ever decided it. Silence is not a refusal.

Set out the route in the scheme's own Constitution — clause 4.6.2 is a consent regime rather than a prohibition, 11.1.5 vests authority in the trustees, 13.2 routes requests through the agent for trustee approval, 13.1(e) permits other use by resolution, and 7.2 lets the committee vary or cancel its own decisions. Stated the adverse clauses candidly (13.1(d) harmonious appearance, 13.2.3(b) window dimensions, 13.2.4 colour consent, 11.1.12(e) residing in a garage) rather than leaving them to be discovered.

Recommended sequence: demand a written trustee decision with reasons; ask for retrospective approval or a variation under 7.2; ask for fines and the reinstatement deadline to be suspended pending decision and recovery, on the strength of the treating doctor's letter; serve the clause 13.2.6 notice only when the member is fit, noting the clock starts on service and that an arbitrator may order security for costs; keep paying the undisputed levy, water and effluent so no second front opens over arrears. Also suggested asking the compliance trustee to confirm his favourable view of the frontage in writing, and asking the manager what the trustees actually resolved on 22 October.

Declined to use the photographs: three of the six attachments arrived truncated and two independent readings of the rest contradicted each other, so nothing was put forward as evidence. Warned that "a neighbour was allowed to" is a fairness argument that cuts both ways, and offered to raise any genuine structure projecting into the street as a separate complaint. Asked for the 3 August application and its delivery record, the three enforcement letters, the Conduct Rules (cited by the agent but not held by us), and whether earlier fines were removed and re-imposed.

No case file or third-party personal data was attached or described. The member was again told this is not legal advice, that the campaign has basic paralegal capacity only, and to have his own attorney review anything before signature.

## Adding future sends

1. Send the email through Composio/Zoho Mail and capture each `messageId`.
2. Append the rows to `emails/private/sent-log.csv` with the recipient's real
   address and the message ID.
3. Allocate a `member_id` for the recipient in `emails/private/members.csv`
   if they do not already have one, and add the send to
   `emails/private/sent-log.csv`.
4. Add a row to this file using the `member_id`. Never add an address, a name,
   or a hash of an address.
5. Commit only this file, never `emails/private/`.
