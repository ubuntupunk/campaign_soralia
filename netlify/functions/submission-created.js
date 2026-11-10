// Netlify event-triggered function.
//
// Netlify invokes this automatically for every form submission on the site
// (event name: `submission-created`). We only act on the `petition` form.
//
// It sends a thank-you email to the signer through the Zoho Mail API using an
// OAuth refresh token, so no credentials live in the repository.
//
// Required environment variables (set in Netlify, never committed):
//   ZOHO_CLIENT_ID
//   ZOHO_CLIENT_SECRET
//   ZOHO_REFRESH_TOKEN
//   ZOHO_ACCOUNT_ID       e.g. 7009601000000008002
//   ZOHO_FROM_ADDRESS     e.g. info@soraliavillagecampaign.org.za
//   ZOHO_DC               optional data centre: com (default), eu, in, com.au, jp, ca
//
// See emails/thank-you-automation.md for setup instructions.

const FORM_NAME = "petition";

function dc() {
  return process.env.ZOHO_DC || "com";
}

function tokenUrl() {
  return `https://accounts.zoho.${dc()}/oauth/v2/token`;
}

function mailUrl(accountId) {
  return `https://mail.zoho.${dc()}/api/accounts/${accountId}/messages`;
}

async function getAccessToken() {
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
    throw new Error("Zoho OAuth environment variables are not set");
  }

  const body = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const res = await fetch(tokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = await res.json();

  if (!res.ok || !json.access_token) {
    throw new Error(`Zoho token exchange failed: ${json.error || res.status}`);
  }

  return json.access_token;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function greeting(name) {
  const first = String(name || "").trim().split(/\s+/)[0];
  if (!first || first.length > 40) return "Dear neighbour";
  return `Dear ${escapeHtml(first)}`;
}

function thankYouHtml(name) {
  const site = "https://soraliacampaign.org.za";
  const mail = "info@soraliavillagecampaign.org.za";

  const h2 = "color:#1e2d4a;font-size:19px;line-height:1.3;margin:28px 0 10px;";
  const p = "margin:0 0 14px;font-size:16px;line-height:1.6;";
  const li = "margin:0 0 8px;font-size:16px;line-height:1.6;";
  const link = "color:#c75c2e;text-decoration:underline;";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thank you for signing the Soralia Village petition</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;line-height:1.6">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">Your signature is on the petition. Here is what happens next, and how you can help.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f0e8">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden">

<tr><td style="background:#1e2d4a;padding:24px 32px">
<a href="${site}" style="color:#ffffff;font-size:20px;font-weight:700;text-decoration:none">Soralia VC</a>
</td></tr>

<tr><td style="padding:32px">

<p style="${p}">${greeting(name)},</p>

<p style="${p}"><strong>Thank you for signing the petition.</strong> Your name has been added to the call for fair treatment of pensioners, disabled persons and military veterans in Soralia Village.</p>

<h2 style="${h2}">What happens next</h2>
<p style="${p}">Complaint One to the Community Schemes Ombud Service (CSOS) has been decided. The adjudicator ordered the HOA to reverse the &ldquo;receipting fees&rdquo; and &ldquo;arrears account review&rdquo; charges on the account concerned, and to recalculate the interest.</p>
<p style="${p}">Complaint Two is still running. We will write to you when there is news.</p>
<p style="${p}"><a href="${site}/csos-order.html" style="${link}">Read the order and the campaign statement &rarr;</a></p>

<h2 style="${h2}">How you can help</h2>
<ul style="margin:0 0 14px;padding-left:20px">
<li style="${li}">Share the campaign with neighbours on WhatsApp, Facebook or X.</li>
<li style="${li}">Talk to members who may not have seen it.</li>
<li style="${li}">Attend the next community meeting, and bring someone with you.</li>
<li style="${li}">Inform your immediate neighbours, and use the physical notice board at the gatehouse to post notices if you are able to.</li>
<li style="${li}">Help with the costs of the campaign if you can.</li>
</ul>

<div style="background:#f5f0e8;border-left:4px solid #c75c2e;border-radius:8px;padding:18px 20px;margin:24px 0">
<h2 style="color:#1e2d4a;font-size:19px;line-height:1.3;margin:0 0 10px">If you need help</h2>
<p style="${p}">If your account has been handed over, or you have been charged receipting fees, please do not ignore it.</p>
<ul style="margin:0 0 14px;padding-left:20px">
<li style="${li}">Check your statement for &ldquo;receipting fee&rdquo;, &ldquo;arrears account review&rdquo; or handover charges.</li>
<li style="${li}">Query anything unclear in writing, and keep a copy of what you send.</li>
<li style="${li}">Reply to this email if you would like to talk it through.</li>
</ul>
<p style="margin:0;font-size:16px;line-height:1.6"><strong>Our position:</strong> automatic handovers are ultra vires clauses 7.6.8 and 8.6 of our Constitution.</p>
</div>

<h2 style="${h2}">Stay in touch</h2>
<p style="${p}">
Website: <a href="${site}" style="${link}">soraliacampaign.org.za</a><br>
Email: <a href="mailto:${mail}" style="${link}">${mail}</a><br>
Background: <a href="${site}/why.html" style="${link}">why this complaint was made</a>
</p>

<p style="margin:24px 0 0;font-size:16px;line-height:1.6">
Thank you for standing with your neighbours.<br><br>
<strong>Soralia Village Community Action</strong><br>
<a href="mailto:${mail}" style="${link}">${mail}</a><br>
#SaveOurVillage
</p>

</td></tr>

<tr><td style="background:#1e2d4a;color:#ffffff;padding:24px 32px;font-size:12px;line-height:1.5">
<p style="margin:0 0 10px">You are receiving this because you signed the Soralia Village petition. To stop receiving updates, reply to this email with &ldquo;Unsubscribe&rdquo; or email <a href="mailto:${mail}?subject=Unsubscribe" style="color:#ffffff">${mail}</a> with &ldquo;Unsubscribe&rdquo; in the subject line.</p>
<p style="margin:0;color:#d8dde6">This email is not legal advice, and each account stands on its own facts.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

async function sendThankYou({ name, email, accessToken }) {
  const accountId = process.env.ZOHO_ACCOUNT_ID;
  const fromAddress = process.env.ZOHO_FROM_ADDRESS;

  if (!accountId || !fromAddress) {
    throw new Error("ZOHO_ACCOUNT_ID and ZOHO_FROM_ADDRESS must be set");
  }

  const res = await fetch(mailUrl(accountId), {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      fromAddress,
      toAddress: email,
      subject: "Thank you for signing the Soralia Village petition",
      content: thankYouHtml(name),
      mailFormat: "html",
      encoding: "UTF-8",
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(`Zoho send failed: ${res.status} ${JSON.stringify(json?.data ?? json)}`);
  }

  return json?.data?.messageId ?? null;
}

exports.handler = async (event) => {
  // Always answer 200. A non-2xx makes Netlify retry the event, which would
  // send duplicate emails, so failures are logged rather than surfaced.
  try {
    const payload = JSON.parse(event.body || "{}").payload || {};

    if (payload.form_name !== FORM_NAME) {
      return { statusCode: 200, body: "ignored" };
    }

    const data = payload.data || {};
    const email = String(data.email || "").trim();
    const name = String(data.name || "").trim();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      console.warn("thank-you: submission had no usable email address");
      return { statusCode: 200, body: "no email" };
    }

    const accessToken = await getAccessToken();
    const messageId = await sendThankYou({ name, email, accessToken });

    // No address and no hash of an address: messageId is enough to trace a send.
    console.log(`thank-you: sent messageId=${messageId ?? "unknown"}`);

    return { statusCode: 200, body: "sent" };
  } catch (error) {
    console.error(`thank-you: failed - ${error.message}`);
    return { statusCode: 200, body: "error" };
  }
};

// Exposed so scripts/preview-thank-you.js can render the email locally
// without sending anything.
exports.thankYouHtml = thankYouHtml;
