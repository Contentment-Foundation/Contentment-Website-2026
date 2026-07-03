# contentment.org — Technical Development Brief
> Q2 2026 · Backend & Engineering Team · **Canonical spec:** [`docs/planning/TECHNICAL-ARCHITECTURE.md`](./planning/TECHNICAL-ARCHITECTURE.md)  
> This file is a summary. If anything here disagrees with `planning/`, the planning doc wins.
> Prepared by **Somesh Bhardwaj** · somesh@contentment.org · Sr. System Admin, Full Stack AI Engineer · The Contentment Foundation

---

## Architecture Principle

**Static-first. No custom server in Phase 1.** contentment.org is a static marketing site. **Production:** Vercel (`contentment.org`). **Development (interim):** Netlify publishes the `site/` prototype until Astro migration (`TICKET-002`). Third-party managed services (Keela, Flodesk, Raisely) own the data. A custom backend (Vercel Serverless Functions + GCP Cloud SQL) is introduced only when a provider cannot meet the workflow need.

## Deployment

| Environment | Host | URL |
|-------------|------|-----|
| Prototype preview (now) | Netlify (interim) | `contentmentweb2.netlify.app` |
| Production | Vercel | `contentment.org` |
| PR previews | Vercel | `*.vercel.app` |
| Local (Astro) | `astro dev` | `localhost:4321` |

```
Browser
  └── Vercel CDN (static HTML/CSS/JS — Astro build output)
        ├── Keela          — donations (redirect link, no API)
        ├── Flodesk        — newsletter (embed or Vercel fn → Flodesk API)
        ├── Raisely        — fundraise (embed/link)
        ├── Analytics      — Plausible or GA4 (script tag)
        └── Vercel Fn      — custom forms (optional) → GCP Cloud SQL (Phase 2+)
```

---

## Confirmed Stack

| Layer | Tool | Version / Notes |
|-------|------|-----------------|
| **Framework** | Astro | 4.x — static output (`output: 'static'`); SSR only for API routes |
| **Hosting** | Vercel (production) | Git-connected; auto preview on every PR branch |
| **Dev preview** | Netlify (interim) | `site/` prototype + docs briefs until Astro on Vercel |
| **Serverless** | Vercel Functions | `/api/*` routes for custom form POSTs (Phase 1+) |
| **Donations** | Keela | Redirect to hosted checkout URLs — no API from browser |
| **Newsletter** | Flodesk | Embed iframe **or** POST to `/api/newsletter` → Flodesk REST API |
| **Fundraise** | Raisely | Embed or `PUBLIC_RAISELY_CAMPAIGN_URL` link |
| **Database** | GCP Cloud SQL (PostgreSQL) | Phase 2+ — only if custom forms or member auth need it |
| **CMS** | Markdown + JSON in repo | Phase 1 · migrate to Sanity at Phase 1.5 when editors need self-service |
| **Analytics** | GA4 + Microsoft Clarity + PostHog | See DECISION-001; Plausible dropped (paid); GA4 = primary (existing account) |
| **Rate limiting** | @upstash/ratelimit + Upstash Redis | 5 req / 15 min / IP on all `/api/*` — DECISION-004 |
| **Transactional email** | Resend | School inquiry notifications, magic links — DECISION-003 |
| **Homeroom gate** | Vercel Edge Middleware | Phase 2 — shared password → rotating cookie; magic link if >500 members |
| **Version control** | Git + GitHub | Vercel auto-deploys `main` to production; PR branches → preview URLs |

---

## Project Structure (Astro — target)

```
Contentment-Website-2026/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro        # <head>, nav, footer, fonts, global CSS
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── StatBand.astro
│   │   ├── OrbitSection.astro      # How Change Happens scroll animation
│   │   ├── Pillars.astro
│   │   ├── HomeroomBlock.astro
│   │   ├── DoorCards.astro
│   │   └── NewsletterForm.astro
│   ├── pages/
│   │   ├── index.astro             # /
│   │   ├── why.astro               # /why
│   │   ├── stories/
│   │   │   ├── index.astro         # /stories
│   │   │   └── [slug].astro        # /stories/[educator-name]
│   │   ├── schools.astro           # /schools
│   │   ├── give/
│   │   │   ├── index.astro         # /give
│   │   │   └── monthly.astro       # /give/monthly (Homeroom conversion)
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   └── api/                    # Vercel Serverless Functions
│   │       ├── newsletter.ts       # POST → Flodesk API
│   │       └── school-inquiry.ts   # POST → Flodesk/Keela or GCP
├── public/
│   └── assets/                     # Images, fonts (moved from site/assets/)
├── src/data/
│   ├── stories.json                # Phase 1: static story data
│   └── stats.json                  # Canonical proof points (325, 86%, etc.)
├── src/styles/
│   ├── tokens.css                  # :root CSS custom properties from prototype
│   └── global.css                  # All prototype CSS verbatim
├── src/scripts/
│   ├── nav.js                      # Scroll state, mobile drawer
│   ├── animations.js               # IntersectionObserver reveal, count-up
│   └── orbit.js                    # Pinned scroll animation
├── .env.example                    # All vars listed, no values
├── astro.config.mjs
└── package.json
```

**Migration rule:** Copy CSS and JS verbatim from `site/index.html`. No design changes during migration.

**Phase 1 interim** (before Astro): build additional pages as flat HTML files under `site/` (`why/index.html`, `stories/index.html`, etc.) with a `_partials/` directory and a simple build script to inject nav/footer.

---

## Integration Specs

### Keela — Donations

| Field | Detail |
|-------|--------|
| Pattern | Redirect to Keela hosted checkout URL |
| Called from | Nav CTA, hero CTA, Homeroom section, `/give/monthly` tier buttons |
| Data sent | None from our frontend (UTM params preserved in URL) |
| Env vars | `PUBLIC_KEELA_TIER_5_URL` · `PUBLIC_KEELA_TIER_25_URL` · `PUBLIC_KEELA_TIER_100_URL` |
| Analytics event | `cta_homeroom_click` on every Homeroom CTA click |

Implementation: `<a href={import.meta.env.PUBLIC_KEELA_TIER_5_URL} data-analytics="cta_homeroom_click">`

---

### Flodesk — Newsletter

**Option A — Embed (zero backend):**
Flodesk provides embed code. Wrap in `.news` section styling. Flodesk handles validation, double opt-in, and list management.

**Option B — Custom form + Vercel function (full UI control):**

```
POST /api/newsletter
Body: { "email": string, "first_name": string, "source": "footer" | "updates" | "festival" }

Server (Vercel fn):
  → POST https://api.flodesk.com/v1/subscribers
  → Headers: Authorization: Basic <base64(FLODESK_API_KEY:)>
  → Body: { "email", "first_name", "segments": ["newsletter"] }
  → 200 → inline success message
  → 4xx duplicate → "You're already subscribed"
  → 5xx → friendly error + mailto:somesh@contentment.org

Env var: FLODESK_API_KEY (server-side only — never expose to browser)
```

---

### School Discovery Form

```
POST /api/school-inquiry
Body: {
  "school_name":    string  (required),
  "contact_name":   string  (required),
  "contact_email":  email   (required),
  "role":           string  (optional),
  "country":        string  (optional),
  "message":        string  (optional),
  "_honey":         string  (honeypot — must be empty),
  "source_page":    "/schools"
}

Server options (pick one at deployment):
  A. Forward to Flodesk segment / Keela form  → no GCP needed
  B. INSERT INTO school_inquiries (GCP)       → Phase 2 if workflow requires it
     + send notification email to partnerships team

Rate limit: 5 requests / 15 min / IP at Vercel edge
Success: 200 + inline thank-you (voice & tone)
Error:   500 + friendly message + mailto fallback
```

---

### Analytics — Events to Instrument

| Event name | Trigger | Method |
|------------|---------|--------|
| `cta_homeroom_click` | Any Homeroom CTA | `data-analytics` attribute |
| `cta_school_click` | "Start the conversation" | `data-analytics` attribute |
| `newsletter_submit` | Successful form POST | JS after 200 |
| `story_view` | Story page load | Page-level script |
| `share_why` | Share button click on `/why` | JS click handler |

UTM convention: `utm_source` / `utm_medium` / `utm_campaign` on all campaign links. Document per campaign brief.

---

### Homeroom Gate — Phase 2

```
Vercel Edge Middleware (middleware.ts):
  1. Request hits /homeroom/*
  2. Check cookie: homeroom_session
  3. Missing or invalid → redirect to /homeroom/login (simple HTML form)
  4. POST /api/homeroom-auth
       body: { "password": string }
       server: compare to HOMEROOM_GATE_PASSWORD (env)
       rate limit: 5 attempts / 15 min / IP
       success: set HTTP-only cookie, 7-day expiry → redirect to /homeroom
  5. Phase 2.1: replace shared password with magic link
       (Vercel fn sends link → user clicks → set signed JWT cookie)
       triggers when: >500 active members OR password leaked

Env var: HOMEROOM_GATE_PASSWORD (Vercel env only — never in repo)
```

---

## Data Model

### Phase 1 — File-based (no database)

| Entity | Storage | Key fields |
|--------|---------|------------|
| Page | Astro `.astro` files | slug, title, meta, sections |
| Educator story | `src/data/stories.json` | slug, name, country, school, quote, body, photo, themes[], published, lat?, lng? |
| Proof stat | `src/data/stats.json` | label, value, suffix, source_note |
| Four Pillar | Hardcoded in component | name, definition (verbatim — never paraphrase) |
| Homeroom tier | `.env` + Keela | amount, keela_product_url |

### Phase 2 — GCP Cloud SQL (PostgreSQL)

**Trigger:** Add GCP only when one of these is true: (1) custom school form needs a queryable lead workflow, (2) Homeroom magic-link auth requires a member table, (3) you need a single system of record across Keela + form data.

```sql
-- School leads
CREATE TABLE school_inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ DEFAULT now(),
  school_name  TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  role         TEXT,
  country      TEXT,
  message      TEXT,
  source_page  TEXT,
  status       TEXT DEFAULT 'new'  -- new | contacted | qualified | closed
);

-- Homeroom members (magic-link auth only)
CREATE TABLE homeroom_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT UNIQUE NOT NULL,   -- matches Keela donor email
  keela_contact_id  TEXT,
  tier              TEXT,                   -- '5' | '25' | '100'
  active            BOOLEAN DEFAULT true,
  last_verified_at  TIMESTAMPTZ
);

-- Stories (only if not using Sanity CMS)
CREATE TABLE stories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  educator_name TEXT NOT NULL,
  country_code  CHAR(2),
  school_name   TEXT,
  quote         TEXT,
  body          TEXT,          -- Markdown
  hero_image_url TEXT,
  themes        TEXT[],
  published     BOOLEAN DEFAULT false,
  sort_order    INT DEFAULT 0
);
```

Access rule: All DB access through Vercel Serverless Functions only. `GCP_SERVICE_ACCOUNT_JSON` never in browser.

---

## Environment Variables

**Canonical full table:** `docs/planning/TECHNICAL-ARCHITECTURE.md` §6. Summary below.

```bash
# Public (safe in browser — prefix PUBLIC_)
PUBLIC_SITE_URL=https://contentment.org
PUBLIC_KEELA_TIER_5_URL=           # Keela $5/mo checkout — from finance
PUBLIC_KEELA_TIER_25_URL=          # Keela $25/mo checkout
PUBLIC_KEELA_TIER_100_URL=         # Keela $100/mo checkout
PUBLIC_GA_ID=                      # GA4 measurement ID — existing account (DECISION-001)
PUBLIC_POSTHOG_KEY=                # PostHog project API key (DECISION-001)
PUBLIC_POSTHOG_HOST=               # PostHog host URL
PUBLIC_RAISELY_CAMPAIGN_URL=       # Fundraise page link

# Server-only (Vercel env — never in repo or browser)
FLODESK_API_KEY=
UPSTASH_REDIS_REST_URL=            # rate limit + webhook dedup (DECISION-004)
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=                    # transactional email (DECISION-003)
SLACK_WEBHOOK_PARTNERSHIPS=         # see AUTOMATION-BRIEF.md
SLACK_WEBHOOK_HOMEROOM=
SLACK_WEBHOOK_GROWTH=
SLACK_WEBHOOK_EVENTS=
SLACK_WEBHOOK_CONTENT=
SLACK_WEBHOOK_ERRORS=
SLACK_WEBHOOK_METRICS=
KEELA_WEBHOOK_SECRET=
ZOOM_ACCOUNT_ID=                   # Phase 1.5 — event RSVP
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_FESTIVAL_WEBINAR_ID=
GCP_SERVICE_ACCOUNT_JSON=          # Google Sheets / Calendar
GOOGLE_SCHOOL_SHEET_ID=
HOMEROOM_GATE_PASSWORD=            # Phase 2 shared password
GCP_CLOUD_SQL_CONNECTION=          # Phase 2 Cloud SQL
SENTRY_DSN=                        # Phase 1.5 optional (DECISION-006)
```

Store in **Vercel project → Settings → Environment Variables**. Commit `.env.example` with all keys, no values.

---

## Routing & Redirects

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | https://contentment.org | `main` |
| Dev preview (interim) | https://contentmentweb2.netlify.app | Netlify connected branch |
| Preview | `*.vercel.app` | Every PR branch (automatic) |
| Local | `localhost:4321` (Astro) or `vercel dev` | — |

**Redirects to configure in `vercel.json`:**

```json
{
  "redirects": [
    { "source": "/donate", "destination": "/give/monthly", "permanent": true },
    { "source": "/old-wordpress-path", "destination": "/new-slug", "permanent": true }
  ]
}
```

Run a full backlink audit before DNS cutover to capture all old WordPress URLs.

---

## Security Rules (Pre-launch Checklist)

- [ ] HTTPS enforced — Vercel handles automatically
- [ ] Zero API keys in client-side JavaScript or public assets
- [ ] Keela links use official hosted checkout URLs only
- [ ] All form POSTs go to HTTPS endpoints
- [ ] Honeypot field on every custom form (hidden from users, checked server-side)
- [ ] Rate limiting on `/api/*` routes via `@upstash/ratelimit` + Upstash Redis (DECISION-004)
- [ ] `.env` in `.gitignore`; run `git secret` or GitHub secret scan on CI
- [ ] `GCP_SERVICE_ACCOUNT_JSON` and DB connection string in Vercel env only
- [ ] Security headers via `vercel.json`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- [ ] `npm audit` clean before deploy (Astro build pipeline)
- [ ] 404 and error pages branded; no stack traces exposed to users
- [ ] Homeroom password stored only in Vercel env — never in code or Slack

---

## Phase Gates

| Phase | Trigger to move | What unlocks |
|-------|-----------------|--------------|
| **Phase 1 → 1.5** | Phase 1 live; Keela URLs wired; analytics recording | Sanity CMS, individual story pages, Events page, SEO meta, school form backend |
| **Phase 1.5 → 2** | Member count growing; editorial team needs self-service | Homeroom gated hub, magic-link auth, GCP Cloud SQL, About section, interactive stories map |
| **Phase 2 → 2+** | Content team can't manage without CMS | Full Sanity migration, campaign page builder, i18n |

---

## Sprint Order — Engineering View

```
TICKET-001  Extract shared layout (CSS tokens, nav, footer)
TICKET-002  Astro scaffold — all Phase 1 route stubs
TICKET-003  Mobile nav drawer (focus trap, aria-expanded)
TICKET-010  Port homepage from site/index.html → /
TICKET-004  Wire all nav + footer links (no href="#" remaining)
TICKET-020  Build /why (longform, share CTA, Web Share API)
TICKET-030  stories.json schema + seed data  ← wait on comms content
TICKET-031  /stories index (door-card grid)
TICKET-040  /schools (split layout, discovery form UI)
TICKET-050  /give gateway (five-seat door cards)
TICKET-060  Keela env vars + wire all CTAs  ← wait on finance URLs
TICKET-051  /give/monthly full copy (depends on 060 + tier decision)
TICKET-070  Newsletter integration (Flodesk embed or /api/newsletter)
TICKET-071  /privacy + /terms (text pages)
TICKET-080  Analytics (script + conversion events)
TICKET-100  Pre-launch QA (a11y, Lighthouse ≥85, Keela live test)
TICKET-101  DNS cutover + production deploy
```

**External blockers that gate engineering work:**
- `TICKET-060` and `TICKET-051` blocked until **finance provides Keela URLs**
- `TICKET-030` blocked until **comms provides story content** (min 3 stories with photos)
- `TICKET-051` copy blocked until **tier amount decision** ($5/$25/$100 vs $25/$50/$100)

---

## Performance Targets

| Metric | Target | How verified |
|--------|--------|--------------|
| Lighthouse Performance (mobile) | ≥ 85 | Lighthouse CI on PR |
| LCP on 4G | < 2.5 s | Lighthouse / RUM |
| Images | WebP; `loading="lazy"` below fold | Build-time check |
| JS | Defer non-critical; no framework bundle | Astro default |
| Fonts | `preconnect` to fonts.googleapis.com | Already in prototype |
| Reduced motion | `@media (prefers-reduced-motion)` disables orbit, parallax | Already in prototype — preserve |

---

## Related Documents

| Need | Document |
|------|----------|
| Open technical decisions (analytics, email, rate limit) | `docs/planning/DECISIONS.md` |
| Full tech stack + data model + CMS rationale | `docs/planning/TECHNICAL-ARCHITECTURE.md` |
| Site architecture, `/events`, deployment model | `docs/research/WEBSITE-ARCHITECTURE.md` |
| Automation, Slack, Zoom, Keela webhooks | `docs/briefs/AUTOMATION-BRIEF.md` |
| Design tokens, component classes, integration specs | `docs/planning/FRONTEND-SPECIFICATION.md` |
| Accessibility checklist, ARIA patterns, known gaps | `docs/planning/ACCESSIBILITY.md` |
| Auth, RLS, error handling, edge cases (15 items) | `docs/planning/SECURITY-AND-ACCESS.md` |
| All feature tickets with acceptance criteria | `docs/planning/FEATURE-TICKETS.md` |
| Full PRD — features, flows, success metrics | `docs/planning/PRD.md` |
| Copy rules (no em dashes, banned words) | `docs/research/MESSAGING-AND-COPY.md` |
