# The Contentment Foundation — contentment.org

> *Project overview, orientation, and developer reference. Start here.*

> **Project:** Multi-page Astro site → production on Vercel at contentment.org  
> **Organisation:** The Contentment Foundation · 501(c)(3) nonprofit  
> **Technical lead:** Somesh Bhardwaj · somesh@contentment.org · Sr. System Admin, Full Stack AI Engineer  
> **General contact:** hello@contentment.org

---

## For AI tools and new contributors — read this first

This section gives any AI tool or first-time contributor an accurate picture of the project before reading anything else. **Do not skip it.**

### What this project is

A marketing and conversion website for The Contentment Foundation at `contentment.org`. The site tells a single story — TCF delivers teacher wellbeing at scale — and drives one primary action: **Join Homeroom** (monthly giving; messaging floor currently **$25/month**).

**Current state:** Phase 1 multi-page **Astro 4.x** static site lives in `src/`. Dev preview on Netlify publishes `dist/` from `npm run build`. Production target remains **Vercel → contentment.org** (FEAT-101). The old Phase 1 HTML prototype in `site/` is superseded — do not edit it for production work.

### Who built what

| Area | Built by | Status |
|------|----------|--------|
| Astro site (`src/`) — pages, layout, components | Ported from Dave Kebo handoffs; owned by Somesh Bhardwaj | Live on Netlify preview; polish / wiring ongoing |
| `src/config/seams.ts` — CTA / Keela / external destinations | Somesh Bhardwaj | Living — edit here for pending URLs |
| Keela General Donation Form embeds | Somesh Bhardwaj | Live on `/`, `/why`, `/getinvolved#donate` |
| Newsletter → Flodesk (`/api/newsletter`) | Somesh Bhardwaj | Shipped (host-native functions); e2e + rate limit pending |
| `public/` prototypes — Story Board, Foundation Reach Map | Somesh Bhardwaj | Preview routes; not embedded on homepage yet |
| All `docs/` planning, briefs, research, launch Sheet | Somesh Bhardwaj | Living documents |

### What exists today vs still open

| Layer | Status |
|-------|--------|
| Multi-page Astro site on Netlify preview | ✅ Built — `src/pages/` → `dist/` |
| Routes: `/`, `/why`, `/our-impact`, `/schools`, `/getinvolved`, `/events`, `/about`, `/updates`, `/privacy`, branded `/404` | ✅ Built |
| `/give` → `/getinvolved` | ✅ 301 (Netlify + Vercel) |
| Keela General Donation Form | ✅ Live (per-tier Homeroom products still pending) |
| Newsletter (Flodesk) | ✅ Code shipped — live submit test + Upstash rate limit pending |
| Analytics scaffold (GA4 + PostHog + Clarity + Cookiebot + Sentry) | ✅ Scaffolded — blocked on credentials (HC-076) |
| Security headers + CSP | ✅ `netlify.toml` + `vercel.json` (kept in sync by hand) |
| Production cutover to contentment.org | ❌ FEAT-101 open (includes HC-077: unpublish public `/docs*`) |
| `/terms`, story CMS (`/stories/[slug]`), school discovery embed | ❌ Blocked / Phase 2 |
| Story Board + Foundation Reach Map | ✅ Prototypes at `/story-board`, `/foundation-reach-map` |

---

## Which files to edit

| Task | Edit |
|------|------|
| Page copy, layout, components | `src/pages/`, `src/components/`, `src/layouts/` |
| Design tokens / global CSS | `src/styles/tokens.css`, `src/styles/global.css` |
| CTA / Keela / donate / social / RSVP destinations | `src/config/seams.ts` **only** |
| Images & static assets | `public/assets/` |
| Prototypes (map, Story Board) | `public/*.html` (+ `public/program-data.js`) |
| Planning status / tickets / Sheet | `docs/planning/launch-plan-data.json` + `TRACKER.md` (see planning sync below) |
| Stakeholder briefs | `docs/briefs/*.md` + matching `*.html` |
| Superseded Phase 1 prototype | `site/` — **do not use for production** |

---

## Document flow — how the docs relate

```
1. PRD.md
   └── What we're building, for whom, and why.

2. TECHNICAL-ARCHITECTURE.md
   └── How we're building it (stack, hosting, env vars, CI/CD, DNS).
       If TECH-BRIEF.md disagrees with this file, this file wins.

3. DECISIONS.md
   └── Open / resolved technical choices — resolve before tickets that depend on them.

4. FEATURE-TICKETS.md
   └── Specs + acceptance criteria (not the live status board).

5. TRACKER.md  ← operational dashboard
   └── Live status. Sheet source of truth: launch-plan-data.json.
```

**For any new piece of work:** define it in FEATURE-TICKETS → open DECISIONS if needed → update `launch-plan-data.json` + TRACKER.

**Briefs** (`docs/briefs/`) are readable summaries for stakeholders — not specs. If a brief disagrees with `docs/planning/`, planning wins.

**Correspondence** (`docs/correspondence/`) holds external review responses and stakeholder communications — not planning docs.

### Planning sync (status-worthy changes)

Code-only UI/CSS/copy polish → ship code only. When **status, scope, schedule, routes/slugs, CTA wiring, or team-facing truth** changes, update planning first:

1. Edit `docs/planning/launch-plan-data.json` + `docs/planning/TRACKER.md` (append changelog row)
2. Update `src/config/seams.ts` if real CTA/URL/form values changed
3. Run:

```bash
python3 scripts/google-sheets/build-sheet-script.py   # → LaunchPlanSheet.gs
python3 scripts/refresh-launch-canvas.py              # local canvas (not in git)
python3 scripts/refresh-timelines.py --notes          # both timeline HTMLs
```

Full checklist: [`.cursor/rules/planning-docs-sync.mdc`](./.cursor/rules/planning-docs-sync.mdc) (mirrored in `.claude/rules/`). Do **not** hand-edit timeline status spans / notes / `As of` stamps — use `refresh-timelines.py`. `refresh-timelines.py --check` exits 1 when timelines are stale.

---

## Authority order — when documents conflict

```
docs/planning/TECHNICAL-ARCHITECTURE.md   ← wins on all engineering/stack decisions
docs/planning/PRD.md                      ← wins on product scope and features
docs/research/MESSAGING-AND-COPY.md       ← wins on all copy and messaging
docs/research/VOICE-AND-TONE.md           ← wins on tone and style
docs/research/WEBSITE-ARCHITECTURE.md     ← wins on URLs and site structure
docs/briefs/*.md / *.html                 ← readable summaries only; must match above
```

---

## Live routes (Astro)

| Path | Page |
|------|------|
| `/` | Homepage |
| `/why` | Why Teacher Wellbeing |
| `/our-impact` | Our Impact (stories index) |
| `/schools` | For Schools |
| `/getinvolved` | Get Involved (was `/give`) |
| `/events` | Events |
| `/about` | About Us |
| `/updates` | Updates / newsletter |
| `/privacy` | Privacy (legal copy still owed for `/terms`) |
| `/404` | Branded not-found |

Homepage anchors (among others): `#top` · `#why` · `#impact` · `#how` · `#homeroom`.

---

## Complete document index

### Planning & execution — `docs/planning/`

| Document | Purpose |
|----------|---------|
| [`PRD.md`](./docs/planning/PRD.md) | Product requirements, audiences, success metrics, phase gates |
| [`TECHNICAL-ARCHITECTURE.md`](./docs/planning/TECHNICAL-ARCHITECTURE.md) | Stack, integrations, env vars, CI/CD, DNS, `vercel.json` |
| [`DECISIONS.md`](./docs/planning/DECISIONS.md) | Open and resolved technical decisions |
| [`SECURITY-AND-ACCESS.md`](./docs/planning/SECURITY-AND-ACCESS.md) | Security posture, privacy, pre-launch checklist |
| [`FRONTEND-SPECIFICATION.md`](./docs/planning/FRONTEND-SPECIFICATION.md) | Design system, components, analytics events |
| [`ACCESSIBILITY.md`](./docs/planning/ACCESSIBILITY.md) | WCAG 2.1 AA target, ARIA patterns, known gaps |
| [`FEATURE-TICKETS.md`](./docs/planning/FEATURE-TICKETS.md) | Ticket specs + acceptance criteria |
| [`TRACKER.md`](./docs/planning/TRACKER.md) | Live ticket status, owners, blockers, changelog |
| [`launch-plan-data.json`](./docs/planning/launch-plan-data.json) | Sheet / canvas / timeline source of truth |
| Page audits + [`PRE-LAUNCH-QA-AUDIT.md`](./docs/planning/PRE-LAUNCH-QA-AUDIT.md) | Responsive + pre-launch QA findings |

### Content & IA — `docs/research/`

| Document | Purpose |
|----------|---------|
| [`MESSAGING-AND-COPY.md`](./docs/research/MESSAGING-AND-COPY.md) | Taglines, belief journey, page copy, stats, CTAs |
| [`VOICE-AND-TONE.md`](./docs/research/VOICE-AND-TONE.md) | Persona and tone |
| [`EVIDENCE-AND-RESEARCH.md`](./docs/research/EVIDENCE-AND-RESEARCH.md) | Citable sources and ready-to-use lines |
| [`WEBSITE-ARCHITECTURE.md`](./docs/research/WEBSITE-ARCHITECTURE.md) | Sitemap, URLs, deployment model |

### Team briefs — `docs/briefs/`

| Brief | Published (preview) |
|-------|---------------------|
| [Team](./docs/briefs/TEAM-BRIEF.md) · [Tech](./docs/briefs/TECH-BRIEF.md) · [Growth](./docs/briefs/GROWTH-BRIEF.md) · [Automation](./docs/briefs/AUTOMATION-BRIEF.md) | `/docs/*` on Netlify |
| Dev timelines (`DEV-TIMELINE.html`, `dev-timelinev2.html`) | Generated by `refresh-timelines.py` — do not hand-edit status |

### Correspondence — `docs/correspondence/`

| Document | Purpose |
|----------|---------|
| [`ANIK-REVIEW-RESPONSE.md`](./docs/correspondence/ANIK-REVIEW-RESPONSE.md) | Response to Anik Ghosh's engineering review (Jul 2026) |
| [`LORNA-KEELA-MAP-RESPONSE.md`](./docs/correspondence/LORNA-KEELA-MAP-RESPONSE.md) | Keela product / donate map with Lorna |
| [`HANDOFF-MEETING-2026-07-28.md`](./docs/correspondence/HANDOFF-MEETING-2026-07-28.md) | Jul 28 handoff meeting notes |

---

## Deployment

| Environment | Host | URL | When |
|-------------|------|-----|------|
| **Dev preview** | Netlify | [contentmentweb2.netlify.app](https://contentmentweb2.netlify.app) | Now — Astro `dist/` + prototypes + internal `/docs` |
| **Production** | Vercel | [contentment.org](https://contentment.org) | FEAT-101 cutover |
| **PR previews** | Vercel | `*.vercel.app` | Per pull request (target host) |

**Build:** [`netlify.toml`](./netlify.toml) runs `scripts/copy-docs.sh public/docs && npm run build`, publishes `dist/`. Prototypes and the docs hub live under `public/` so they ship inside `dist/` unchanged.

**Prototype / passthrough routes:**

| Path | Source |
|------|--------|
| `/foundation-reach-map` | `public/foundation-reach-map.html` |
| `/story-board` | `public/story-board.html` |
| `/story-board-feed-guide` | `public/story-board-feed-guide.html` |
| `/docs/*` | Generated from `docs/*.html` at build (preview only) |

**Production cutover (FEAT-101 / HC-077):** remove Footer “Project docs”, stop shipping `public/docs` / skip `copy-docs.sh` on the production build, and 404 `/docs*`. Keep `docs/` in the private repo.

Stack detail: [`docs/planning/TECHNICAL-ARCHITECTURE.md`](./docs/planning/TECHNICAL-ARCHITECTURE.md).

---

## Repository layout

```
Contentment-Website-2026/
│
├── src/                           ← PRIMARY — Astro site (edit here)
│   ├── pages/                     ← Routes (index, why, our-impact, schools, …)
│   ├── components/                ← Nav, Footer, Homeroom, Keela, Newsletter, …
│   ├── layouts/BaseLayout.astro
│   ├── styles/                    ← tokens.css + global.css
│   ├── config/seams.ts            ← CTA / Keela / external destinations
│   ├── scripts/                   ← Client JS (nav, orbit, newsletter, …)
│   └── lib/flodesk.js             ← Shared Flodesk API helpers
│
├── public/                        ← Static assets + prototypes (copied into dist/)
│   ├── assets/                    ← Images
│   ├── foundation-reach-map.html
│   ├── story-board.html
│   ├── program-data.js
│   ├── sitemap.xml · robots.txt · llms.txt · favicon.svg
│   └── docs/                      ← GENERATED at build — do not hand-edit
│
├── netlify/functions/             ← Preview host: newsletter.mjs → /api/newsletter
├── api/newsletter.js              ← Vercel twin of the same newsletter handler
│
├── site/                          ← Superseded Phase 1 HTML prototype — not the publish root
├── prototypes/                    ← Dev notes for map + Story Board
│
├── docs/
│   ├── planning/                  ← CANONICAL engineering source of truth
│   ├── research/                  ← Copy, messaging, evidence, IA
│   ├── briefs/                    ← Stakeholder summaries (+ generated timelines)
│   ├── correspondence/            ← External reviews / stakeholder comms
│   └── index.html                 ← Docs hub source
│
├── scripts/
│   ├── copy-docs.sh               ← docs/*.html → public/docs (build + local)
│   ├── refresh-timelines.py       ← regenerates both timeline HTMLs from JSON
│   ├── refresh-launch-canvas.py
│   └── google-sheets/             ← LaunchPlanSheet.gs builder
│
├── astro.config.mjs               ← output: 'static' (no adapter)
├── netlify.toml · vercel.json
├── contentment-home.html          ← Legacy single-file build (email/offline)
└── README.md                      ← This file
```

---

## Local development

```bash
npm install
cp .env.example .env   # fill what you have; missing analytics/Flodesk vars no-op safely
npm run dev            # http://localhost:4321
```

```bash
npm run build && npm run preview
```

Refresh the internal docs hub locally after editing `docs/*.html`:

```bash
./scripts/copy-docs.sh
# then open http://localhost:4321/docs (with `npm run dev` running)
```

`public/docs/` is generated — edit sources in `docs/` only.

Locked responsive QA widths: **320, 390, 759, 768, 940, 1280** px — see [`HOMEPAGE-RESPONSIVE-AUDIT.md`](./docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md).

---

## Design tokens

Defined in `src/styles/tokens.css` (ported from the approved homepage).

| Token | Value | | Fonts | |
|-------|-------|-|-------|-|
| `--teal` | `#1FAFC0` | | Display | Newsreader |
| `--ocean` | `#0080B0` | | Body | Inter |
| `--deep` | `#024E70` | | Brand | Varela Round |
| `--green` | `#4FA98C` | | | |
| `--paper` | `#FBFAF7` | | | |

Match existing tokens, fonts, and the `.anim` reveal pattern — don't introduce a new design language unless a ticket says otherwise.

---

## Known open items (high level)

| Item | Detail |
|------|--------|
| Per-tier Homeroom Keela products | General Donation Form is live; `joinTiers` in `seams.ts` still empty (HC-075) |
| Analytics credentials | Scaffold in `Analytics.astro` + Sentry — waiting on IDs (HC-076) |
| Newsletter e2e | Flodesk path shipped; live submit test + Upstash rate limit + Vercel verify at cutover |
| `/terms` + legal privacy copy | FEAT-071 |
| Pre-launch QA fixes | Audit done — fixes in progress ([PRE-LAUNCH-QA-AUDIT.md](./docs/planning/PRE-LAUNCH-QA-AUDIT.md)) |
| Production DNS cutover | FEAT-101 (+ HC-077 unpublish `/docs*`) |
| Story Board / Reach Map on homepage | Prototypes only until approved |

Live status: [`docs/planning/TRACKER.md`](./docs/planning/TRACKER.md).

---

## Analytics stack (confirmed July 2026)

| Tool | Role |
|------|------|
| **GA4** | Primary — traffic, sessions, funnels, campaign attribution |
| **Microsoft Clarity** | Heatmaps + session recordings |
| **PostHog** | Product analytics, funnel cohorts, A/B testing |
| **Bing Webmaster Tools** | Bing + Copilot indexing |
| **Google Search Console** | Google indexing, CWV, manual actions |

> Plausible dropped. See [DECISIONS.md](./docs/planning/DECISIONS.md) DECISION-001.  
> Cookie consent: Cookiebot / Consent Mode v2 + cookieless PostHog path — see DECISION-002 + live `Analytics.astro`.  
> Transactional email: **SendGrid** — DECISION-003.  
> Observability: hybrid (Slack + Sentry + host logs + PostHog) — DECISION-006. PostHog **Cloud** — DECISION-007.

Env var template: [`.env.example`](./.env.example).

---

## Contact

| Role | Contact |
|------|---------|
| Project / technical | somesh@contentment.org |
| General | hello@contentment.org |
