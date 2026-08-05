# Open Technical Decisions — [contentment.org](http://contentment.org)

> **Status:** All engineering decisions (001–007) resolved  
> **Last updated:** 14 July 2026  
> **Owner:** Somesh Bhardwaj · Sr. System Admin, Full Stack AI Engineer  
> **Location:** `docs/planning/DECISIONS.md` (also linked from [Technical Architecture](./TECHNICAL-ARCHITECTURE.md) §15)

Each decision below is a blocker for at least one TICKET. **Recommended options for 001–004 are recorded below** — check the box and add a date when the team formally signs off.

---

## DECISION-001 — Primary analytics tool

**Blocks:** TICKET-080, TICKET-071 (cookie consent wording in /privacy)  
**Status:** ✅ Resolved — July 2026

**Confirmed stack (Plausible dropped — paid; using tools we already own):**


| Tool                     | Role                                                                | Cost                        | Cookie banner?                                          |
| ------------------------ | ------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------- |
| **GA4**                  | Primary — traffic, funnels, campaign attribution, conversion events | Free (existing account)     | Yes — see DECISION-002                                  |
| **Microsoft Clarity**    | Heatmaps + session recordings — CRO, drop-off analysis              | Free (existing account)     | No — first-party session cookies only, no personal data |
| **Bing Webmaster Tools** | Bing + Copilot AI indexing, keyword data                            | Free (existing account)     | No                                                      |
| **PostHog**              | Product analytics, funnel cohorts, feature flags, A/B testing       | Free tier (1M events/month) · PostHog Cloud | Cookieless mode — see DECISION-002 |
| + Anik's suggestions     | TBD after engineering review                                        | —                           | —                                                       |


**Plausible — dropped.** Was recommended as the privacy-first primary but carries a monthly subscription cost. GA4 already exists and covers the same traffic + event tracking needs; Clarity covers CRO; PostHog covers product analytics and funnels. No reason to pay for a fourth tool.

**Decision:**

- [x] Signed off — option chosen: **GA4 + Microsoft Clarity + Bing Webmaster Tools + PostHog**
- [x] Signed off by: **Anik Ghosh** (engineering review)
- [x] Date: 3 July 2026

---



## DECISION-002 — Cookie consent mechanism

**Blocks:** TICKET-071, TICKET-080  
**Depends on:** DECISION-001  
**Status:** ✅ Resolved — 14 July 2026  
**Signed off by:** Somesh Bhardwaj


| Tool in stack            | Cookie behaviour                                                            | Banner required?                         |
| ------------------------ | --------------------------------------------------------------------------- | ---------------------------------------- |
| **GA4**                  | Sets `_ga`, `_gid` cookies — tracks users across sessions                   | **Yes** — GDPR, PECR (UK), ePrivacy (EU) |
| **Microsoft Clarity**    | First-party session cookies — no cross-site tracking, no personal data sold | No — disclose in privacy policy          |
| **PostHog**              | Cookieless mode (`persistence: 'memory'`) — **required at init**             | No — cookieless mode confirmed           |
| **Bing Webmaster Tools** | Server-side only — no browser cookies                                       | No                                       |


**Decision:** GA4 is in the confirmed stack, so a **cookie consent banner is required** for EU/UK visitors.

| Component | Choice |
|-----------|--------|
| **Consent management platform (CMP)** | **Cookiebot** — `uc.js` with `data-cbid`, `data-blockingmode="manual"`. Superseded Osano Free 4 Aug 2026 (see amendment below) |
| **GA4** | [Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent?hl=en) — analytics fire in cookieless/modelled state before consent; full cookies only after opt-in |
| **PostHog** | Cookieless init: `persistence: 'memory'` (no PostHog cookies) |

**Regulatory alignment (document in `/privacy`):**

| Region | Regulation | How we comply |
|--------|------------|---------------|
| **EU** | GDPR + ePrivacy Directive | Cookiebot CMP; no non-essential cookies before consent; GA4 Consent Mode v2 |
| **UK** | UK GDPR + PECR | Same as EU — Cookiebot geo-targets EU/UK visitors |
| **US (California)** | CCPA/CPRA | Privacy policy disclosure of analytics tools; link to cookie preferences |
| **Rest of world** | Best practice | Privacy policy + Cookiebot cookie preferences link in footer |

**UI requirements:**
- Cookiebot `uc.js` first script in `<head>` (loads before GA4 gtag) — rendered by `Analytics.astro` via `BaseLayout`
- Footer: **Privacy Policy** · **Cookie Preferences** (Cookiebot Privacy Trigger re-open) on `/privacy`
- `/privacy`: compliance table above + per-tool disclosures (GA4 cookies, Clarity session data, PostHog cookieless events)

- [x] Signed off — option chosen: **Osano Free + GA4 Consent Mode v2 + cookieless PostHog**
- [x] Signed off by: **Somesh Bhardwaj**
- [x] Date: 14 July 2026

**Amendment — 4 Aug 2026: CMP vendor changed Osano → Cookiebot.** Somesh's call; the rest of
the decision (GA4 Consent Mode v2, cookieless PostHog) is unchanged, so this supersedes the
vendor only, not the mechanism. Consequences recorded rather than left implicit:

- `PUBLIC_OSANO_CUSTOMER_ID` → **`PUBLIC_COOKIEBOT_ID`**, renamed in the same pass across
  `Analytics.astro`, `.env`, `.env.example`, TECHNICAL-ARCHITECTURE §6.1 and this file.
- **`data-blockingmode="manual"`, not `"auto"`.** Auto mode rewrites recognised tracker
  `<script>` tags to `type="text/plain"` until consent, which would risk blocking our own
  inline `gtag('consent','default')` call — the thing this decision depends on — and would
  block PostHog, which is cookieless under DECISION-007 and needs no consent.
- **Cookiebot's built-in "Google Consent Mode" feature must stay disabled** in the dashboard.
  It emits its own `gtag('consent', …)` calls, which would race ours.
- Consent signal shape differs: Cookiebot exposes booleans on `window.Cookiebot.consent`
  (`statistics` → `analytics_storage`, `marketing` → the `ad_*` signals) and fires
  `CookiebotOnConsentReady` / `OnAccept` / `OnDecline`, versus Osano's single
  `osano-cm-consent-saved` event with a string enum.
- CSP updated in **both** `netlify.toml` and `vercel.json` (kept byte-identical):
  `cmp.osano.com` replaced by `consent.cookiebot.com` (script + style) and
  `consentcdn.cookiebot.com` (script, connect, **frame** — Cookiebot renders the banner in an
  iframe, which Osano did not require). Without this the banner would have been CSP-blocked.

---



## DECISION-003 — Transactional email provider

**Blocks:** TICKET-041 (school form notification to partnerships team), AUTOMATION-BRIEF steps 4 and 6  
**Status:** ✅ Resolved — 14 July 2026  
**Signed off by:** Somesh Bhardwaj

Flodesk is a marketing automation tool — it handles sequences and campaigns. It is not designed for real-time transactional emails triggered by server events (e.g. "you have a new school inquiry" to an internal email address). A separate transactional provider is needed for:

- Internal notification: partnerships team email on school form submit
- Zoom join link delivery when RSVP does not go through Flodesk
- Magic-link auth emails (Phase 2)


| Option | Notes | When to use |
|--------|-------|-------------|
| **SendGrid** ✅ **chosen** | **Existing paid plan** — already used for transactional email on three other TCF platforms; domain `contentment.org` can reuse verified sender setup | **Primary for contentment.org** |
| Resend | 3,000 emails/month free; excellent Vercel DX | Fallback if SendGrid limits or deliverability issues |
| AWS SES | Low cost at scale; more setup | If consolidating on AWS/GCP later |
| Nodemailer via Gmail API | Free; OAuth required | Dev/testing only — not recommended for production |


**Decision:** Use **SendGrid** (existing TCF paid account) for all Vercel `/api/*` transactional sends. Keep Resend, AWS SES, and Nodemailer documented as alternatives if requirements change.

```typescript
// Example — school inquiry notification (SendGrid)
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
await sgMail.send({
  from: 'site@contentment.org',
  to: 'partnerships@contentment.org',
  subject: `New school inquiry — ${body.school_name}`,
  html: `<p>${body.contact_name} · ${body.contact_email} · ${body.country}</p>`
});
```

**Env var:** `SENDGRID_API_KEY` (server-only, Vercel env — reuse existing TCF SendGrid API key)

**Decision:**

- [x] Signed off — option chosen: **SendGrid** (existing paid plan; Resend/AWS/Nodemailer kept as alternatives)
- [x] Signed off by: **Somesh Bhardwaj**
- [x] Date: 14 July 2026

---



## DECISION-004 — Rate limiting implementation

**Blocks:** TICKET-070 (`/api/newsletter`), TICKET-041 (`/api/school-inquiry`), AUTOMATION-BRIEF `/api/event-rsvp` and `/api/keela-webhook`

All docs specify "5 requests / 15 min / IP" but no implementation is named.


| Option                                               | Persistence                                   | Cold start safe? | Recommended        |
| ---------------------------------------------------- | --------------------------------------------- | ---------------- | ------------------ |
| **@upstash/ratelimit + Upstash Redis** (recommended) | Redis — survives cold starts and multi-region | Yes              | ✓                  |
| In-memory Map in Vercel fn                           | Memory only — resets every cold start         | No               | ✗                  |
| Vercel built-in (WAF)                                | Infrastructure level — no per-route config    | Limited          | Supplementary only |


**Recommendation:** `@upstash/ratelimit` with Upstash Redis free tier (10,000 requests/day). Standard pattern for Vercel serverless functions.

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
});

// In handler:
const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
const { success } = await ratelimit.limit(ip);
if (!success) return new Response('Too many requests', { status: 429 });
```

**Env vars to add:**

```bash
UPSTASH_REDIS_REST_URL=     # from Upstash dashboard
UPSTASH_REDIS_REST_TOKEN=   # from Upstash dashboard (server-only)
```

**Suggested choice:** `@upstash/ratelimit` + Upstash Redis (free tier).

**Decision:**

- [x] Signed off — option chosen: **@upstash/ratelimit + Upstash Redis**
- [x] Signed off by: **Somesh Bhardwaj**
- [x] Date: 14 July 2026

---



## DECISION-005 — Image optimization approach

**Blocks:** TICKET-010 (homepage migration), TICKET-020 (/why), TICKET-031 (/stories)  
**Affects:** LCP < 2.5s target


| Option                                            | Effort                                | Output                                          |
| ------------------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| **Astro** `<Image />` **component** (recommended) | Low — drop-in replacement for `<img>` | Auto WebP + srcset + lazy + width/height        |
| Manual pre-conversion to WebP                     | Medium — tooling required             | Static WebP, no responsive srcset               |
| Vercel image optimization (`/_vercel/image`)      | Zero code change                      | On-demand transform, adds latency on first load |


**Recommendation:** Use Astro's built-in `<Image />` component from `astro:assets`. Requires `@astrojs/vercel` adapter and Sharp integration in `astro.config.mjs`. All hero images, educator photos, and OG images go through this at build time.

**Note:** Anik's review referenced image optimisation in passing (ANIK-REVIEW-RESPONSE issue #9) but did not propose an alternative to Astro `<Image />`.

**Decision:**

- [x] Signed off — option chosen: **Astro `<Image />` component (`astro:assets`)**
- [x] Signed off by: **Somesh Bhardwaj**
- [x] Date: 14 July 2026

---



## DECISION-006 — Error monitoring & observability

**Blocks:** Observability (TECHNICAL-ARCHITECTURE.md §14)  
**Priority:** Phase 1 — hybrid stack from launch

**Decision:** Use a **hybrid observability stack** — no single tool covers server errors, product funnels, and infra logs. Layer all four:


| Layer | Tool | Role | Phase |
|-------|------|------|-------|
| **Real-time alerts** | Slack `#errors` (`SLACK_WEBHOOK_ERRORS`) | Every Vercel `/api/*` catch block POSTs here; P1 form/API failures | 1 |
| **Error tracking** | **Sentry** (`SENTRY_DSN`, `@sentry/astro`) | Stack traces, release context, error grouping, alert rules | 1 |
| **Infrastructure logs** | **Vercel function logs** | Raw request/response logs in Vercel dashboard; first stop for debugging | 1 |
| **Product / event diagnostics** | **PostHog Cloud** (DECISION-007) | Funnel drop-offs, custom event timelines, feature-flag context — supplements error investigation | 1 |


**Why hybrid:** Slack gives the team immediate visibility. Sentry captures structured errors with stack traces Sentry excels at. Vercel logs are free and always available. PostHog adds product-context (which funnel step failed, which page the user was on) — not a replacement for Sentry but valuable for triage.

**Env vars:** `SENTRY_DSN`, `SLACK_WEBHOOK_ERRORS` (already in TECHNICAL-ARCHITECTURE §6)

**Decision:**

- [x] Signed off — option chosen: **Hybrid: Slack `#errors` + Sentry + Vercel logs + PostHog Cloud diagnostics**
- [x] Signed off by: **Somesh Bhardwaj**
- [x] Date: 14 July 2026

---



## DECISION-007 — PostHog hosting

**Blocks:** TICKET-080  
**Depends on:** DECISION-001, DECISION-002  
**Status:** ✅ Resolved — 14 July 2026  
**Signed off by:** Somesh Bhardwaj


| Option | Notes |
|--------|-------|
| **PostHog Cloud** ✅ **chosen** | `https://app.posthog.com` — fastest to ship; free tier (1M events/month); no GCP ops overhead |
| Self-hosted on GCP | Full data control; higher ops cost — defer unless compliance requires it later |


**Env vars:**

```bash
PUBLIC_POSTHOG_KEY=       # PostHog project API key
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com   # was app.posthog.com; see amendment
```

**Cookieless mode:** Required per DECISION-002 — `persistence: 'memory'` at init.

**Decision:**

- [x] Signed off — option chosen: **PostHog Cloud** (`app.posthog.com`)

**Amendment — 5 Aug 2026: host is `https://us.i.posthog.com`.** The decision (PostHog Cloud, cookieless) is unchanged; only the hostname moved on. PostHog split ingestion onto regional hosts after this was signed off. Verified 3 Aug: the project's key returns a live config from `us.i.posthog.com` and **404s on `eu.i.posthog.com`**, so the project is US-region. `app.posthog.com` still resolves as an alias and returns byte-identical config, which is why `Analytics.astro` keeps it as the fallback default — but `PUBLIC_POSTHOG_HOST` should be set to the regional host, and the SDK loads assets from `us-assets.i.posthog.com`, which the CSP's `https://*.posthog.com` already covers.
- [x] Signed off by: **Somesh Bhardwaj**
- [x] Date: 14 July 2026

---



## DECISION-008 — Where sign-ups land: Keela or Flodesk

**Blocks:** TICKET-060, TICKET-070, TICKET-090, HC-078, HC-079, D-24
**Depends on:** business decision (Kristina / Lorna / WoeiJing) — engineering can implement any of the three
**Status:** 🟠 **Open** — raised 5 August 2026
**Raised by:** Somesh Bhardwaj, after reviewing Lorna's Website → Keela → Finance map

**The disconnect.** Two plans are being built against each other and neither party had seen the other's:

- **Lorna's map** (Streams 4 and 5) states that every sign-up — event registrations, the November waitlist, other forms — must land in **Keela**, tagged, with a confirmation email and an internal notification, and must reconcile to QuickBooks.
- **What we built** routes *all* email capture to **Flodesk** via `/api/newsletter` (D-19, live since 4 Aug): 11 capture points across 5 pages, segments `www.contentment.org` and `Contentment Festival`. Keela handles **payments only**.
- **Nothing currently moves a Flodesk subscriber into Keela.** Both systems cannot be the record of truth for the same person without a sync, and no one has decided which is.

| Option | Notes |
|--------|-------|
| **1. Flodesk for email capture, Keela for money only** | Cheapest — matches what is already live and tested. Lorna's tagging, confirmation and internal-notification requirements would have to be met *in Flodesk* rather than Keela, and donor records would not show non-donor sign-ups. |
| **2. Keela for everything** | Matches Lorna's map exactly and gives one donor record. Means replacing live Flodesk capture on 5 pages and re-testing all 11 points; Flodesk's double opt-in trail (`optin_ip` + `optin_timestamp`) needs a documented Keela equivalent for EU/UK compliance. |
| **3. Both, with a sync** | Most moving parts. Someone must own dedupe and conflict rules, and a sync failure is silent by nature. |

**Cost of not deciding:** every day this stays open, more addresses accumulate in Flodesk that may later have to be exported, deduped and re-tagged into Keela by hand — which is exactly the cleanup Lorna's map warns is *exponentially* more work after the fact than connecting it correctly the first time.

**Relationship to D-24.** D-24 asked the same question for the Events page alone. This supersedes it in scope: the answer has to be sitewide, or `/events`, `/updates` and the homepage will each behave differently.

**Decision:**

- [ ] Signed off — option chosen: _______
- [ ] Signed off by: Kristina / Lorna / WoeiJing
- [ ] Date: _______

---

## Decision log


| #   | Decision                     | Status          | Date        | Chosen                                                                 | Signed off by        |
| --- | ---------------------------- | --------------- | ----------- | ---------------------------------------------------------------------- | -------------------- |
| 001 | Primary analytics tool       | **Resolved**    | 3 Jul 2026  | GA4 + Clarity + Bing Webmaster + PostHog (Plausible dropped)           | Anik Ghosh (review)  |
| 002 | Cookie consent mechanism   | **Resolved**    | 14 Jul 2026 | Cookiebot + GA4 Consent Mode v2 + cookieless PostHog (CMP was Osano until 4 Aug 2026) | Somesh Bhardwaj      |
| 003 | Transactional email provider | **Resolved**  | 14 Jul 2026 | SendGrid (existing paid plan); Resend/AWS/Nodemailer as alternatives   | Somesh Bhardwaj      |
| 004 | Rate limiting implementation | **Resolved**    | 14 Jul 2026 | @upstash/ratelimit + Upstash Redis                                     | Somesh Bhardwaj      |
| 005 | Image optimization approach  | **Resolved**    | 14 Jul 2026 | Astro `<Image />` (`astro:assets`)                                     | Somesh Bhardwaj      |
| 006 | Error monitoring             | **Resolved**    | 14 Jul 2026 | Hybrid: Slack + Sentry + Vercel logs + PostHog diagnostics             | Somesh Bhardwaj      |
| 007 | PostHog hosting              | **Resolved**    | 14 Jul 2026 | PostHog Cloud (`us.i.posthog.com`; was `app.posthog.com`)                                      | Somesh Bhardwaj      |
| 008 | Where sign-ups land          | 🟠 **Open**     | raised 5 Aug 2026 | Keela vs Flodesk vs both-with-sync — supersedes D-24's Events-only framing | Kristina / Lorna / WJ |
| —   | Homeroom tier **amounts**    | **Resolved**    | 27 Jul 2026 | **$25 / $50 / $100** (D-01, Kristina) — the earlier $5/$25/$100 option was dropped and the $5 entry copy removed 3 Aug | Finance / Leadership |
| —   | Homeroom tier **benefits**   | 🟠 **Open**     | raised 5 Aug 2026 | What membership *includes* — sets the tax-deductible portion of the receipt, the Keela designation and the widget config (D-25 / Lorna's Decision 1) | Kristina / WJ / Lorna |


