# Open Technical Decisions — contentment.org

> **Status:** Draft — recommendations recorded for 001–004; awaiting team sign-off  
> **Last updated:** June 2026  
> **Owner:** Somesh Bhardwaj · Sr. System Admin, Full Stack AI Engineer  
> **Location:** `docs/planning/DECISIONS.md` (also linked from [Technical Architecture](./TECHNICAL-ARCHITECTURE.md) §15)

Each decision below is a blocker for at least one TICKET. **Recommended options for 001–004 are recorded below** — check the box and add a date when the team formally signs off.

---

## DECISION-001 — Primary analytics tool

**Blocks:** TICKET-080, TICKET-071 (cookie consent wording in /privacy)  
**Status:** ✅ Resolved — July 2026

**Confirmed stack (Plausible dropped — paid; using tools we already own):**

| Tool | Role | Cost | Cookie banner? |
|------|------|------|----------------|
| **GA4** | Primary — traffic, funnels, campaign attribution, conversion events | Free (existing account) | Yes — see DECISION-002 |
| **Microsoft Clarity** | Heatmaps + session recordings — CRO, drop-off analysis | Free (existing account) | No — first-party session cookies only, no personal data |
| **Bing Webmaster Tools** | Bing + Copilot AI indexing, keyword data | Free (existing account) | No |
| **PostHog** | Product analytics, funnel cohorts, feature flags, A/B testing | Free tier (1M events/month) | Depends on config — cookieless mode available |
| + Anik's suggestions | TBD after engineering review | — | — |

**Plausible — dropped.** Was recommended as the privacy-first primary but carries a monthly subscription cost. GA4 already exists and covers the same traffic + event tracking needs; Clarity covers CRO; PostHog covers product analytics and funnels. No reason to pay for a fourth tool.

**Decision:**
- [x] Signed off — option chosen: **GA4 + Microsoft Clarity + Bing Webmaster Tools + PostHog**
- [x] Date: 3 July 2026

---

## DECISION-002 — Cookie consent mechanism

**Blocks:** TICKET-071, TICKET-080  
**Depends on:** DECISION-001  
**Status:** ✅ Resolved — July 2026

| Tool in stack | Cookie behaviour | Banner required? |
|---------------|-----------------|-----------------|
| **GA4** | Sets `_ga`, `_gid` cookies — tracks users across sessions | **Yes** — GDPR, PECR (UK), ePrivacy (EU) |
| **Microsoft Clarity** | First-party session cookies — no cross-site tracking, no personal data sold | No — disclose in privacy policy |
| **PostHog** | Cookieless mode available (`persistence: 'memory'`) — opt for this at init | No if cookieless mode used |
| **Bing Webmaster Tools** | Server-side only — no browser cookies | No |

**Decision:** GA4 is now in the confirmed stack, so a **cookie consent banner is required** for EU/UK visitors. Use **Osano** (free tier) or a lightweight custom `<dialog>` consent UI. Implement GA4 with [Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent?hl=en) so analytics fire in a cookieless/modelled state before consent is given — this preserves funnel data without violating GDPR.

**Action for `/privacy`:** Disclose GA4 (cookies, purpose, retention), Clarity (session heatmaps, no personal data sold), PostHog (cookieless, event analytics). Link to Google's and Microsoft's privacy policies.

- [x] Signed off — option chosen: **Cookie banner for GA4 (Consent Mode v2) + privacy policy disclosure for Clarity + PostHog**
- [x] Date: 3 July 2026

---

## DECISION-003 — Transactional email provider

**Blocks:** TICKET-041 (school form notification to partnerships team), AUTOMATION-BRIEF steps 4 and 6

Flodesk is a marketing automation tool — it handles sequences and campaigns. It is not designed for real-time transactional emails triggered by server events (e.g. "you have a new school inquiry" to an internal email address). A separate transactional provider is needed for:

- Internal notification: partnerships team email on school form submit
- Zoom join link delivery when RSVP does not go through Flodesk
- Magic-link auth emails (Phase 2)

| Option | Free tier | DX | Vercel-native |
|--------|-----------|----|-|
| **Resend** (recommended) | 3,000 emails/month | Excellent; single API call, typed SDK | Yes — created for Vercel/Next.js ecosystem |
| AWS SES | 62,000/month (if from EC2) | Low-level; requires domain verification | No; but works via SDK |
| Nodemailer via Gmail API | Free | Medium; OAuth required | No |
| SendGrid | 100/day free | Good | Partial |

**Recommendation:** **Resend** — `npm install resend`, one env var (`RESEND_API_KEY`), sends email in 5 lines of TypeScript. Free tier covers TCF's volume. Verified domain required (contentment.org).

```typescript
// Example — school inquiry notification
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'site@contentment.org',
  to: 'partnerships@contentment.org',
  subject: `New school inquiry — ${body.school_name}`,
  html: `<p>${body.contact_name} · ${body.contact_email} · ${body.country}</p>`
});
```

**Env var to add:** `RESEND_API_KEY` (server-only, Vercel env)

**Suggested choice:** Resend.

**Decision:**
- [ ] Signed off — option chosen: **Resend**
- [ ] Date: _________________

---

## DECISION-004 — Rate limiting implementation

**Blocks:** TICKET-070 (`/api/newsletter`), TICKET-041 (`/api/school-inquiry`), AUTOMATION-BRIEF `/api/event-rsvp` and `/api/keela-webhook`

All docs specify "5 requests / 15 min / IP" but no implementation is named.

| Option | Persistence | Cold start safe? | Recommended |
|--------|-------------|-----------------|-------------|
| **@upstash/ratelimit + Upstash Redis** (recommended) | Redis — survives cold starts and multi-region | Yes | ✓ |
| In-memory Map in Vercel fn | Memory only — resets every cold start | No | ✗ |
| Vercel built-in (WAF) | Infrastructure level — no per-route config | Limited | Supplementary only |

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
- [ ] Signed off — option chosen: **@upstash/ratelimit + Upstash Redis**
- [ ] Date: _________________

---

## DECISION-005 — Image optimization approach

**Blocks:** TICKET-010 (homepage migration), TICKET-020 (/why), TICKET-031 (/stories)  
**Affects:** LCP < 2.5s target

| Option | Effort | Output |
|--------|--------|--------|
| **Astro `<Image />` component** (recommended) | Low — drop-in replacement for `<img>` | Auto WebP + srcset + lazy + width/height |
| Manual pre-conversion to WebP | Medium — tooling required | Static WebP, no responsive srcset |
| Vercel image optimization (`/_vercel/image`) | Zero code change | On-demand transform, adds latency on first load |

**Recommendation:** Use Astro's built-in `<Image />` component from `astro:assets`. Requires `@astrojs/vercel` adapter and Sharp integration in `astro.config.mjs`. All hero images, educator photos, and OG images go through this at build time.

**Decision:**
- [ ] Resolved — option chosen: _________________
- [ ] Date: _________________

---

## DECISION-006 — Error monitoring (Sentry or skip)

**Blocks:** Observability (TECHNICAL-ARCHITECTURE.md §9)  
**Priority:** Low for Phase 1; Medium for Phase 1.5 when custom APIs are live

| Option | Cost | When to add |
|--------|------|-------------|
| **Skip Phase 1** | Free | If Slack #errors alerts are sufficient coverage |
| **Sentry** | Free tier (5,000 errors/month) | Add at Phase 1.5 when `/api/*` routes are handling real traffic |
| Vercel function logs only | Free | Sufficient if team is watching logs actively |

**Recommendation:** Skip for Phase 1. Add Sentry at Phase 1.5. When added: `SENTRY_DSN` env var, `@sentry/astro` integration.

**Decision:**
- [ ] Resolved — option chosen: _________________
- [ ] Date: _________________

---

## Decision log

| # | Decision | Status | Date | Chosen |
|---|----------|--------|------|--------|
| 001 | Primary analytics tool | **Resolved** | 3 Jul 2026 | GA4 + Clarity + Bing Webmaster + PostHog (Plausible dropped) |
| 002 | Cookie consent mechanism | **Resolved** | 3 Jul 2026 | Cookie banner for GA4 (Consent Mode v2) + privacy disclosure for Clarity + PostHog |
| 003 | Transactional email provider | **Recommended** | — | Resend |
| 004 | Rate limiting implementation | **Recommended** | — | @upstash/ratelimit + Upstash Redis |
| 005 | Image optimization approach | Open | — | — |
| 006 | Error monitoring | Open | — | — |
