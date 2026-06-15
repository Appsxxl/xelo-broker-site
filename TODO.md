# Xelo Broker Site — Open Items

Items that cannot be completed yet and must be done before or shortly after public launch.

---

## Legal / Company

- [ ] **Registered address** — Add to Terms of Service (Section 14) and Privacy Policy (Section 1 & 14) once Xelo Media World LTD is registered in the UK.
- [ ] **Company registration number** — Add to footer and both legal pages once issued by Companies House.
- [ ] **VAT number** — Add to footer and Terms (Section 4) once VAT registered.

---

## Email & Notifications

- [ ] **MailChannels SPF record** — To enable email notifications on beta signups, add this DNS TXT record to `xelo.media` in Cloudflare:
  - Record type: `TXT`
  - Name: `@`
  - Value: add `include:relay.mailchannels.net` to your existing SPF record
  - Without this, notification emails will not deliver.

- [ ] **Confirmation email to beta applicants** — Currently applicants receive no auto-reply. Once an email service is set up (Resend, Postmark, or similar), add a "We received your request" confirmation email on signup.

---

## Cloudflare Setup (required for live beta counter)

- [ ] **Create KV namespace** — Go to Cloudflare dashboard → Workers & Pages → KV → Create namespace named `XELO_BETA`.
- [ ] **Bind KV to Pages project** — Go to Pages → `xelo-broker-site` → Settings → Functions → KV namespace bindings → add variable `XELO_BETA` pointing to the namespace above.

---

## Social Media

- [ ] **Update LinkedIn URL** — Currently `linkedin.com/company/xelo-media`. Update in footer once the page is live.
- [ ] **Update Instagram URL** — Currently `instagram.com/xelo.media`. Update in footer once the account is active.
- [ ] **Update Facebook URL** — Currently `facebook.com/xelomedia`. Update in footer once the page is live.

---

## Product / Content

- [ ] **Demo video** — Embed a real Xelo-generated property video in the hero or a dedicated "Example" section. This is the single biggest conversion gap — visitors can't see what they'd get.
- [ ] **"Sign in" destination** — Nav currently links to `#beta`. Once the app is built, update to the real app URL.
- [ ] **market.xelo.media** — Referenced throughout the site as a live portal. Must be live before agents expect to find their listings there.

---

## Admin Panel

- [ ] **Set ADMIN_PASSWORD secret** — Go to Cloudflare Pages → `xelo-broker-site` → Settings → Environment variables → add `ADMIN_PASSWORD` (production only) with a strong password of your choice.
  - Without this, the admin panel uses default `xelo2026admin` — set a real password before going live.
  - Access admin at: `https://brokers.xelo.media/admin` (username = anything, password = your secret)
  - Admin panel shows: all signups, free vs paid counts, display count, and lets you adjust the KV counter directly.

---

## Nice to have (post-launch)

- [ ] Annual pricing billing — Toggle exists on site; wire up to Stripe when payment is live.
- [ ] Update beta counter seed — If you want to start the counter at a number above 0 on launch day, set the `count` key in Cloudflare KV manually via the dashboard.
