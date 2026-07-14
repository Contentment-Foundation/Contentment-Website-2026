# Security & Access Document — contentment.org

> **Status:** Draft  
> **Last updated:** 14 July 2026  
> **Contact:** somesh@contentment.org  
> **Audience:** Founders, PMs, and engineers — plain English

Related: [Technical Architecture](./TECHNICAL-ARCHITECTURE.md) · [PRD](./PRD.md)

---

## 1. Security posture (plain English)

contentment.org is the **public website of The Contentment Foundation**, a 501(c)(3) nonprofit. It does not store payment card data, does not run a custom login system in Phase 1, and does not hold sensitive educator data on our servers.

**Donations and payment processing** go through Keela hosted checkout (TCF never sees card numbers). **Newsletter and email lists** live in **Flodesk**. **Forms** may use Flodesk, Keela, Raisely, or a custom Vercel API (optionally backed by GCP). **Our job** is to not leak secrets, not collect data we do not need, and to gate member-only pages simply when we add them.

---

## 2. Authentication approach

### Phase 1 MVP — no user accounts

| What | How |
|------|-----|
| Public visitors | No login required |
| Homeroom signup | Redirect to Keela hosted checkout (Keela handles payment auth) |
| Newsletter | Email only — no password |
| School form | Name + email + message — no account |

**Why:** A nonprofit organization website does not need a GCP database for launch if Flodesk, Keela, and Raisely hold the data.

### Phase 2 — Homeroom member area (`/homeroom`)

**Recommended v1 gate:** Shared password via **Vercel edge middleware**.

| Approach | Pros | Cons | When to use |
|----------|------|------|-------------|
| **Shared password** | Simple; one password in welcome email | Password can leak; no per-user audit | Launch Homeroom hub fast |
| **Magic link email** | Per-member; better audit | Needs Vercel API + GCP member table + Keela email match | When member count grows |
| **Keela-only link** | No custom auth | Hard to revoke individually | Temporary only |

**Recommendation:** Start with **rotating shared password** in member welcome email. Move to magic link when >500 active members or if password is shared publicly.

### Admin / content editors

| Role | Auth |
|------|------|
| GitHub repo | 2FA required on org accounts |
| CMS (Sanity) | SSO or email + 2FA |
| Keela / Flodesk / Raisely | Separate admin logins; least privilege |
| GCP Cloud SQL | IAM + private IP; credentials only in Vercel env |

---

## 3. User roles & permissions

### Public website roles

| Role | Who | Can do | Cannot do |
|------|-----|--------|-----------|
| **Anonymous visitor** | Anyone on the internet | Read all public pages; submit newsletter; submit school form; click through to Keela | Access `/homeroom`; see draft preview URLs without token |
| **Homeroom member** | Monthly giver | Access `/homeroom/*` after gate | Edit site content; see other members' data |
| **Content editor** | TCF staff / agency | Edit CMS or repo; trigger preview deploys | Access Keela financials unless granted |
| **Site admin** | Somesh Bhardwaj · somesh@contentment.org | Deploy production; manage env vars; rotate Homeroom password | None beyond job function |

### Keela (external)

Keela admins manage donations, receipts, and donor records. The website only **links** to Keela — it never sees card numbers.

---

## 4. Database access rules (GCP Cloud SQL — Phase 2 only)

If we add GCP Cloud SQL for custom forms or member auth, these rules apply. **Phase 1 with Flodesk/Keela/Raisely only: skip this section.**

| Table | Access rule | Plain English |
|-------|-------------|---------------|
| `school_inquiries` | Insert via Vercel API only. No public SELECT. | Visitors submit through API; staff read via admin tool or SQL client. |
| `homeroom_members` | Match email to session token server-side. | Members never query the DB directly from the browser. |
| `stories` | Public read `published = true` only if served via API. | Prefer static JSON at build time instead. |

**Never** expose `GCP_SERVICE_ACCOUNT_JSON` or DB connection strings in browser JavaScript. All DB access goes through Vercel Serverless Functions.

---

## 5. Data we collect & privacy

| Data | Where it goes | Retention |
|------|---------------|-----------|
| Newsletter email + first name | **Flodesk** | Per Flodesk policy |
| School inquiry | Flodesk / Keela / Raisely / **GCP** (if custom API) | Per workflow |
| Donation details | Keela only | Keela retention policy |
| Analytics | GA4 + Microsoft Clarity + PostHog (cookieless) | Per provider policy; see §5.1 |
| Homeroom gate password attempts | Host logs | 30 days |

Publish `/privacy` before launch covering these flows.

### 5.1 Cookie consent & regulatory compliance

**Decision:** [DECISION-002](./DECISIONS.md) — signed off by **Somesh Bhardwaj**, 14 July 2026.

| Region | Regulation | How contentment.org complies |
|--------|------------|------------------------------|
| **European Union** | GDPR + ePrivacy Directive | **Osano** consent management platform (CMP); no non-essential cookies before opt-in; **GA4 Consent Mode v2** (cookieless/modelled analytics pre-consent) |
| **United Kingdom** | UK GDPR + PECR | Same as EU — Osano geo-targets UK visitors with consent banner |
| **United States (California)** | CCPA / CPRA | Privacy policy discloses analytics vendors and data categories; **Cookie Preferences** link in footer (Osano) |
| **Rest of world** | Best practice | Privacy policy + cookie preferences; minimal data collection |

**Tools & cookie behaviour:**

| Tool | Cookies? | Consent required? | Disclose in `/privacy` |
|------|----------|-------------------|------------------------|
| **Osano CMP** | Sets consent-state cookie | N/A — manages consent | Yes — CMP provider, purpose, [Osano privacy policy](https://www.osano.com/legal/privacy-policy) |
| **GA4** | Yes (`_ga`, `_gid`) after consent | Yes (EU/UK) | Yes — Google Analytics, retention, [Google privacy policy](https://policies.google.com/privacy) |
| **Microsoft Clarity** | First-party session only | No banner — disclose only | Yes — heatmaps/session replay, no personal data sold |
| **PostHog** | No — `persistence: 'memory'` | No | Yes — cookieless event analytics |

**Site UI requirements (FEAT-071, FEAT-080):**

1. **Osano Free Plan** script in `BaseLayout` — loads **before** GA4 gtag; 1 domain, up to 5,000 monthly visitors (sufficient for launch).
2. **Footer** on every page: link to `/privacy`, **Cookie Preferences** (Osano re-open), Terms.
3. **`/privacy` page** must include:
   - Regulatory compliance table (above)
   - Per-tool disclosures with links to vendor privacy policies
   - Optional **Osano partner badge** / CMP attribution (Osano provides embeddable badge for privacy page)
   - Last updated date
4. **GA4 Consent Mode v2** default: analytics storage denied until Osano fires consent grant.
5. **PostHog** init: `posthog.init(key, { persistence: 'memory', ... })` — no PostHog cookies.

**Pre-launch check:** Verify banner appears for EU/UK test IP (or Osano preview mode); verify GA4 DebugView shows consent states; verify PostHog does not set cookies in browser devtools.

### 5.2 How compliance content reaches production

Planning docs (`SECURITY-AND-ACCESS.md` §5.1, `DECISIONS.md`) define **what** must appear on the live site. They are **not** served to visitors — they are the engineering and legal spec.

| Step | What happens | Owner | Ticket / timing |
|------|--------------|-------|-----------------|
| 1 | Engineering drafts `/privacy` page structure from §5.1 (regulatory table, per-tool disclosures, cookie section) | Sam (Somesh) | FEAT-071 — Aug 18–19 review sprint |
| 2 | Legal provides and approves final prose (organization-specific language, contact details) | Legal / Ops | D-08 — before go-live |
| 3 | Astro page built at `src/pages/privacy.astro` — shared layout, `.band` + `.wrap` + `.body` typography per FRONTEND-SPEC | Sam | FEAT-071 |
| 4 | Legal copy stored in repo: inline in `.astro` **or** `src/content/legal/privacy.md` imported at build time (Markdown → static HTML) | Sam | FEAT-071 |
| 5 | Same pattern for `/terms` at `src/pages/terms.astro` | Sam | FEAT-071 |
| 6 | Footer on every page: **Privacy Policy** · **Terms** · **Cookie Preferences** (Osano re-open) | Sam | FEAT-004 |
| 7 | Osano CMP script + GA4 Consent Mode v2 wired in `BaseLayout` before analytics scripts | Sam | FEAT-080 |
| 8 | Optional Osano partner badge / CMP attribution embedded on `/privacy` | Sam | FEAT-071 |
| 9 | `vercel build` → static HTML → deploy on merge to `main` → live at `https://contentment.org/privacy` | CI/CD | FEAT-101 |

**Visitor-facing URL:** `https://contentment.org/privacy` (and `/terms`) — standard Astro static routes on Vercel, same as every other page. No separate CMS or PDF for launch; legal updates go through a repo PR + redeploy until Sanity migration (Phase 1.5) if editors need self-service.

---

## 6. Error handling guide

What visitors and staff should see when things break.

### Donation (Keela)

| Failure | User sees | System action |
|---------|-----------|---------------|
| Keela URL missing / wrong | Button goes nowhere or 404 | **Pre-launch check:** validate all Keela URLs in staging |
| Keela checkout down | Keela's error page | Show `somesh@contentment.org` on `/give/monthly` as fallback |
| User abandons cart | No error | Keela handles; optional retargeting via email (out of scope) |

### Newsletter signup

| Failure | User sees | System action |
|---------|-----------|---------------|
| Invalid email | Inline: "Please enter a valid email" | Client-side validation |
| Provider API error | "Something went wrong. Try again or email somesh@contentment.org" | Log error server-side; alert if >5% failure rate |
| Duplicate email | "You're already subscribed" (friendly) | Provider returns duplicate; map to friendly copy |

### School discovery form

| Failure | User sees | System action |
|---------|-----------|---------------|
| Required field empty | Inline field errors | HTML5 + JS validation |
| Spam submission | Silent success (honeypot) or CAPTCHA challenge | Honeypot field hidden from users |
| Backend down | Apology + mailto link | Queue in GCP if using custom API; else provider dashboard |

### Homeroom gate (Phase 2)

| Failure | User sees | System action |
|---------|-----------|---------------|
| Wrong password | "That password didn't work. Check your welcome email." | Rate limit: 5 attempts / 15 min / IP |
| Password rotated | Old password fails | Email members with new password |
| Member bookmarks gate page | Must re-enter on new session | Cookie session 7 days optional |

### General site

| Failure | User sees | System action |
|---------|-----------|---------------|
| 404 | Branded 404 with links to Home, Why, Give | Custom `404.html` |
| 500 / deploy broken | Host default or status page | Rollback deploy; Uptime alert |
| Image missing | Broken image alt text | CI check for asset references |
| JS disabled | All content still readable; orbit becomes static beats | Progressive enhancement (already in prototype) |

---

## 7. Edge cases before launch

| # | Edge case | Mitigation |
|---|-----------|------------|
| 1 | User donates on Keela but never receives Homeroom password | Welcome email automation in Keela; support playbook |
| 2 | Shared Homeroom password posted publicly | Rotate password; plan magic-link migration |
| 3 | School form spam | Honeypot + optional Turnstile CAPTCHA |
| 4 | PII in URL query strings | Never put email in URLs; use POST bodies |
| 5 | Old site backlinks 404 | Redirect audit before DNS cutover |
| 6 | `href="#"` on primary CTAs | QA checklist — all Homeroom links live |
| 7 | Mixed content (HTTP assets on HTTPS) | All assets HTTPS |
| 8 | Accidental commit of API keys | `.env` in `.gitignore`; secret scan in CI |
| 9 | GDPR / CAN-SPAM newsletter | Double opt-in if required; unsubscribe link in emails |
| 10 | Accessibility bypass of animations | `prefers-reduced-motion` (already implemented) |
| 11 | Member-only event RSVP without membership | Show gate modal; link to `/give/monthly` |
| 12 | Tier price change in Keela but stale copy on site | Single `stats.json` / config for tier amounts |
| 13 | Content editor publishes draft story | `published` flag + preview URL with secret token |
| 14 | DDoS on form endpoint | Rate limiting on Vercel API routes; provider limits on embeds |
| 15 | Phishing site impersonating contentment.org | Domain monitoring; consistent SSL |

---

## 7b. Webhook idempotency

Keela retries webhook delivery on non-200 responses. If a Vercel fn completes its work (Slack + Sheets written) but the 200 response is slow, Keela re-delivers and you get duplicate Slack messages and duplicate Sheets rows.

**Pattern:** Store a processed flag in Upstash Redis using NX (only-if-not-exists). Uses the same Redis instance as rate limiting — no additional infra required.

```typescript
// In /api/keela-webhook handler — before any downstream calls
const redis = Redis.fromEnv();
const webhookId = request.headers.get('x-keela-delivery-id') ?? body.id;

const isNew = await redis.set(
  `webhook:${webhookId}`,
  '1',
  { nx: true, ex: 86400 }   // ex = expire after 24h; nx = only set if key doesn't exist
);
if (!isNew) return new Response('Already processed', { status: 200 });
// proceed: Slack → Sheets → Flodesk
```

---

## 8. Security checklist (pre-launch)

- [ ] HTTPS enforced on production domain
- [ ] No API keys in client-side JavaScript
- [ ] Keela uses official hosted checkout URLs only
- [ ] Forms use HTTPS POST
- [ ] Privacy policy and terms published
- [ ] Cookie/analytics consent resolved — see DECISIONS.md #002
- [ ] **Content Security Policy** deployed via `vercel.json` headers (see TECHNICAL-ARCHITECTURE.md §9); tested in report-only mode before enforcing
- [ ] GitHub org 2FA enabled for all contributors
- [ ] Homeroom password stored in Vercel env only — never in code, Slack, or email (Phase 2)
- [ ] Dependency audit: `npm audit --audit-level=high` passing in CI
- [ ] Full security headers set in `vercel.json`: CSP · `X-Frame-Options` · `X-Content-Type-Options` · `Referrer-Policy` · `Permissions-Policy`
- [ ] `font-display: swap` on Google Fonts URL (prevents render-blocking flash)
- [ ] Transactional email provider configured for team notifications — see DECISIONS.md #003
- [ ] Webhook idempotency check implemented in `/api/keela-webhook` (§7b above)
- [ ] Rate limiting on all `/api/*` routes via @upstash/ratelimit (see TECHNICAL-ARCHITECTURE.md §10)
- [ ] All external links (Google Drive docs, social profiles, third-party sites) include `rel="noopener noreferrer"` — prevents opened pages accessing our window context
- [ ] Google Drive brief links confirmed as view-only / Anyone with the link (no edit access)

---

## 9. Related documents

| Document | Location |
|----------|----------|
| Technical architecture | [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) |
| Frontend integrations | [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) |
| Accessibility checklist & ARIA patterns | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| PRD | [PRD.md](./PRD.md) |
| Open decisions | [DECISIONS.md](./DECISIONS.md) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06 | Initial security & access document. |
| 2026-06 | Updated to confirmed stack: Flodesk replaces Mailchimp throughout; GCP Cloud SQL replaces Supabase (§4 renamed, access rules updated); Vercel edge middleware replaces Netlify for Homeroom gate (§2); Raisely added to admin roles and data table; form error handling updated to reference GCP/provider fallback instead of Formspree. |
| 2026-06 | Added: webhook idempotency pattern (§7b), CSP to pre-launch checklist, transactional email and rate-limiting checklist items, link to DECISIONS.md. |
