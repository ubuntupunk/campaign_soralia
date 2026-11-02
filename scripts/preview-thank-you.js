#!/usr/bin/env node
// Render the petition thank-you email to a file so you can check it in a
// browser before deploying. Sends nothing.
//
// Usage:
//   node scripts/preview-thank-you.js                 # "Dear neighbour"
//   node scripts/preview-thank-you.js "Thandi Mokoena" # first name greeting

const fs = require("node:fs");
const path = require("node:path");
const { thankYouHtml } = require("../netlify/functions/submission-created.js");

const name = process.argv[2] || "";
const html = thankYouHtml(name);

const out = path.join(require("node:os").tmpdir(), "soralia-thank-you-preview.html");
fs.writeFileSync(out, html, "utf8");

console.log(`Greeting uses: ${name ? `Dear ${name.trim().split(/\s+/)[0]}` : "Dear neighbour"}`);
console.log(`Wrote ${out}`);
