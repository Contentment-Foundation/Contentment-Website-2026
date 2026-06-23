# Open Technical Decisions — contentment.org

> **Status:** Draft — must be resolved before development starts  
> **Last updated:** June 2026  
> **Owner:** Somesh Bhardwaj · Sr. System Admin, Full Stack AI Engineer

Each decision below is a blocker for at least one TICKET. The recommendation and its rationale are given. Record the decision date and chosen option when resolved.

---

## DECISION-001 — Primary analytics tool

**Blocks:** TICKET-080, TICKET-071 (cookie consent wording in /privacy)

| Option | Description | Cookie banner needed? |
|--------|-------------|----------------------|
| **Plausible only** (recommended) | Privacy-first, GDPR compliant out of the box, < 1 KB script, no cookie storage | No |
| Plausible + GA4 | Plausible as primary, GA4 only if paid Google Ads are running | Yes — GA4 sets cookies |
| GA4 only | Full Google stack; needed for advanced audiences and Google Ads | Yes |

**Recommendation:** Plausible as primary. Add GA4 only if paid ad campaigns are confirmed for Festival 2026 or Homeroom launch. Avoids cookie banner complexity for Phase 1.

**Decision:**
- [ ] Resolved — option chosen: _________________
- [ ] Date: _________________

---

## DECISION-002 — Cookie consent mechanism

**Blocks:** TICKET-071, TICKET-080  
**Depends on:** DECISION-001

| Scenario | Required? | Tool |
|----------|-----------|------|
| Plausible only | No — cookieless by default | No banner needed |
| GA4 added | Yes — GDPR, PECR (UK), ePrivacy (EU) | Cookiebot, Osano, or custom `<dialog>` |
| Microsoft Clarity | No — Clarity uses session cookies but no personal data tracking by default | Check jurisdiction |

**Recommendation:** Resolve DECISION-001 first. If GA4 is added, use **Osano** (free tier, GDPR/CCPA, no external scripts needed). If Plausible only: no banner, update `/privacy` to state cookieless analytics are in use.

**Decision:**
- [ ] Resolved — option chosen: _________________
- [ ] Date: _________________

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

**Decision:**
- [ ] Resolved — option chosen: _________________
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

**Decision:**
- [ ] Resolved — option chosen: _________________
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
| 001 | Primary analytics tool | Open | — | — |
| 002 | Cookie consent mechanism | Open | — | — |
| 003 | Transactional email provider | Open | — | — |
| 004 | Rate limiting implementation | Open | — | — |
| 005 | Image optimization approach | Open | — | — |
| 006 | Error monitoring | Open | — | — |
