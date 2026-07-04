# The Contentment Foundation — contentment.org

> *Project overview, orientation, and developer reference. Start here.*

> **Project:** Full website redesign and build — Phase 1 MVP → Production on Vercel  
> **Organisation:** The Contentment Foundation · 501(c)(3) nonprofit  
> **Technical lead:** Somesh Bhardwaj · somesh@contentment.org · Sr. System Admin, Full Stack AI Engineer  
> **General contact:** hello@contentment.org

---

## For AI tools and new contributors — read this first

This section is written to give any AI tool or first-time contributor a complete, accurate picture of the project before reading anything else. **Do not skip it.**

### What this project is

A marketing and conversion website for The Contentment Foundation at `contentment.org`. The site tells a single story — TCF delivers teacher wellbeing at scale — and drives one primary action: **Join Homeroom from $5/month**.

**Current state:** Phase 1 homepage prototype lives in `site/index.html` (static HTML/CSS/JS). The full multi-page site is planned and documented in `docs/` but not yet built. The prototype is deployed on Netlify (interim). Production target is Vercel.

### Who built what

| Area | Built by | Status |
|------|----------|--------|
| `site/index.html` — homepage prototype | Dave Kebo | Under finalization |
| `contentment-home.html` — single-file base64 version | Dave Kebo | Under finalization |
| `site/story-board.html` — Story Board prototype | Somesh Bhardwaj | In progress |
| `site/foundation-reach-map.html` — Foundation Reach Map prototype | Somesh Bhardwaj | In progress |
| `site/story-board-feed-guide.html` — Story Board feed guide | Somesh Bhardwaj | Built |
| All `docs/` planning, briefs, and research | Somesh Bhardwaj | Built — living documents |

### What is planned vs what exists today

| Layer | Planned (in docs) | Exists today |
|-------|------------------|--------------|
| Multi-page Astro site on Vercel | ✅ Fully specced | ❌ Not yet built |
| Homepage | ✅ Specced | ✅ Prototype (`site/index.html`) — Dave's WIP |
| `/why`, `/stories`, `/schools`, `/give`, `/give/monthly` | ✅ Specced | ❌ Not yet built |
| Serverless API routes (`/api/*`) | ✅ Specced | ❌ Not yet built |
| Analytics (GA4 + PostHog + Clarity) | ✅ Decided | ❌ Not wired |
| Security headers, CSP | ✅ Specced in `vercel.json` | ❌ Not committed yet |
| Story Board | ✅ Prototype built | ✅ `site/story-board.html` |
| Foundation Reach Map | ✅ Prototype built | ✅ `site/foundation-reach-map.html` |

---

## Document flow — how the docs relate and the order to use them

Every engineering decision, ticket, and status entry flows through these documents in order. **Do not skip steps.**

```
1. PRD.md
   └── What we're building, for whom, and why.
       Defines audiences, belief journey, success metrics, phase gates.

2. TECHNICAL-ARCHITECTURE.md
   └── How we're building it.
       Stack, hosting, integrations, env vars, CI/CD, DNS runbook.
       If TECH-BRIEF.md disagrees with this file, this file wins.

3. DECISIONS.md
   └── Any open technical choice that blocks work.
       Each decision has options, a recommendation, and a sign-off checkbox.
       Resolve here before writing tickets that depend on the choice.

4. FEATURE-TICKETS.md
   └── What to build, broken into actionable specs.
       Each ticket has: description, acceptance criteria, priority, phase, dependencies.
       This is the spec document — not a status tracker.

5. TRACKER.md  ← operational dashboard
   └── Live status of every ticket (Open / In Progress / Blocked / Done / etc).
       Raises by whom, owned by whom, opened/closed dates, blockers.
       Always the LAST file touched — reflects what is already defined in 1–4.
```

**For any new piece of work:**
1. Define it in **FEATURE-TICKETS.md** (what + acceptance criteria)
2. If it requires a technical choice → open an entry in **DECISIONS.md**
3. Once defined → add a row to **TRACKER.md** (status, owner, dates, depends on)

**Briefs** (`docs/briefs/`) are readable summaries for stakeholders — not specs. If a brief disagrees with `docs/planning/`, planning wins.

**Correspondence** (`docs/correspondence/`) holds external review responses and stakeholder communications — not planning docs.

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

## Complete document index

### Planning & execution — `docs/planning/`

| Document | Purpose | Read when you need to… |
|----------|---------|------------------------|
| [`PRD.md`](./docs/planning/PRD.md) | Product requirements — features, audiences, success metrics, phase gates | Understand what we're building and why |
| [`TECHNICAL-ARCHITECTURE.md`](./docs/planning/TECHNICAL-ARCHITECTURE.md) | Full tech stack, integrations, env vars, CI/CD pipeline, DNS runbook, `vercel.json` spec | Make any engineering or infrastructure decision |
| [`DECISIONS.md`](./docs/planning/DECISIONS.md) | Open and resolved technical decisions (analytics, cookie consent, rate limiting, image optimisation) | Check if a choice has already been made before reopening it |
| [`SECURITY-AND-ACCESS.md`](./docs/planning/SECURITY-AND-ACCESS.md) | Security posture, auth approach, data privacy, pre-launch checklist, error handling | Add security features, review form handling, plan for launch |
| [`FRONTEND-SPECIFICATION.md`](./docs/planning/FRONTEND-SPECIFICATION.md) | Design system — components, CSS tokens, integration specs, analytics events | Build any page or component |
| [`ACCESSIBILITY.md`](./docs/planning/ACCESSIBILITY.md) | WCAG 2.1 AA target, page checklist, component ARIA pattern map, known gaps | Build or audit any interactive element |
| [`FEATURE-TICKETS.md`](./docs/planning/FEATURE-TICKETS.md) | Full ticket specs — description, acceptance criteria, priority, phase, dependencies | Get the spec for any piece of work before starting |
| [`TRACKER.md`](./docs/planning/TRACKER.md) | Live status tracker — all tickets, owners, dates, blockers, critical path | Check what is open, blocked, done, or pending |

### Content & information architecture — `docs/research/`

| Document | Purpose | Read when you need to… |
|----------|---------|------------------------|
| [`MESSAGING-AND-COPY.md`](./docs/research/MESSAGING-AND-COPY.md) | Taglines, belief journey, page copy briefs, approved stats, CTAs, banned words | Write or review any copy on the site |
| [`VOICE-AND-TONE.md`](./docs/research/VOICE-AND-TONE.md) | Persona, tone principles, pre-publish voice check | Ensure writing sounds like TCF |
| [`EVIDENCE-AND-RESEARCH.md`](./docs/research/EVIDENCE-AND-RESEARCH.md) | Citable sources, DOIs, Harvard/Jennings/Durlak citations, ready-to-use copy lines | Cite research or verify a stat |
| [`WEBSITE-ARCHITECTURE.md`](./docs/research/WEBSITE-ARCHITECTURE.md) | Sitemap, all URLs, page phases, deployment model | Plan routing, redirects, or new pages |

### Team briefs — `docs/briefs/`

Readable one-pagers for stakeholders. Not specs — always defer to `docs/planning/` for engineering decisions.

| Brief | `.md` source | Published at |
|-------|-------------|--------------|
| [Team Brief](./docs/briefs/TEAM-BRIEF.md) | `docs/briefs/TEAM-BRIEF.md` | `/docs/team-brief` |
| [Tech Brief](./docs/briefs/TECH-BRIEF.md) | `docs/briefs/TECH-BRIEF.md` | `/docs/tech-brief` |
| [Growth Brief](./docs/briefs/GROWTH-BRIEF.md) | `docs/briefs/GROWTH-BRIEF.md` | `/docs/growth-brief` |
| [Automation Brief](./docs/briefs/AUTOMATION-BRIEF.md) | `docs/briefs/AUTOMATION-BRIEF.md` | `/docs/automation-brief` |

### Correspondence — `docs/correspondence/`

External review responses and stakeholder communications.

| Document | Purpose |
|----------|---------|
| [`ANIK-REVIEW-RESPONSE.md`](./docs/correspondence/ANIK-REVIEW-RESPONSE.md) | Response to Anik Ghosh's engineering review (Jul 2026) — maps every comment to existing docs or new tickets, with hyperlinks and issue tracker |

---

## Deployment

| Environment | Host | URL | When |
|-------------|------|-----|------|
| **Dev preview (interim)** | Netlify | [contentmentweb2.netlify.app](https://contentmentweb2.netlify.app) | Now — prototype + internal briefs |
| **Production** | Vercel | [contentment.org](https://contentment.org) | After Astro migration (FEAT-002) |
| **PR previews** | Vercel | `*.vercel.app` | Per pull request on `main` |

**Now:** [`netlify.toml`](./netlify.toml) publishes `site/` and generates `site/docs/` on each build by copying `docs/*.html`. That folder is **not in git** — edit sources in `docs/` only.

**Prototype routes (Netlify — `netlify.toml`):**

| Path | Page |
|------|------|
| `/foundation-reach-map` | Foundation Reach Map (`site/foundation-reach-map.html`) |
| `/story-board` | Story Board (`site/story-board.html`) |
| `/story-board-feed-guide` | Story feed guide (`site/story-board-feed-guide.html`) |

Same paths work as `/*.html` directly. Replicate these redirects in `vercel.json` at production cutover (FEAT-101).

**Target:** Astro 4.x static build on Vercel — see [`docs/planning/TECHNICAL-ARCHITECTURE.md`](./docs/planning/TECHNICAL-ARCHITECTURE.md).

---

## Repository layout

```
Contentment-Website-2026/
│
├── site/                          ← Current prototype (Netlify publish root)
│   ├── index.html                 ← Homepage prototype (Dave Kebo) ~48 KB
│   ├── story-board.html           ← Story Board prototype (Somesh Bhardwaj)
│   ├── foundation-reach-map.html  ← Foundation Reach Map prototype (Somesh Bhardwaj)
│   ├── story-board-feed-guide.html ← Feed guide (Somesh Bhardwaj)
│   ├── program-data.js            ← Shared story/country data (map + Story Board)
│   └── assets/
│       ├── …                        ← Homepage images (~2.8 MB)
│       └── countries-110m.js        ← Bundled world map TopoJSON (Foundation Reach Map)
│
├── prototypes/
│   ├── world-map/README.md          ← Map prototype notes (D3, deploy, integration)
│   └── story-board/                 ← Story Board dev guide (FEED-GUIDE.md)
│
├── docs/
│   ├── planning/                  ← CANONICAL — engineering source of truth
│   │   ├── PRD.md
│   │   ├── TECHNICAL-ARCHITECTURE.md
│   │   ├── DECISIONS.md
│   │   ├── SECURITY-AND-ACCESS.md
│   │   ├── FRONTEND-SPECIFICATION.md
│   │   ├── ACCESSIBILITY.md
│   │   ├── FEATURE-TICKETS.md
│   │   └── TRACKER.md             ← Live status tracker (new)
│   ├── research/                  ← Copy, messaging, evidence, site architecture
│   │   ├── MESSAGING-AND-COPY.md
│   │   ├── VOICE-AND-TONE.md
│   │   ├── EVIDENCE-AND-RESEARCH.md
│   │   └── WEBSITE-ARCHITECTURE.md
│   ├── briefs/                    ← Stakeholder summaries (HTML + MD)
│   │   ├── TEAM-BRIEF.md / .html
│   │   ├── TECH-BRIEF.md / .html
│   │   ├── GROWTH-BRIEF.md / .html
│   │   └── AUTOMATION-BRIEF.md / .html
│   ├── correspondence/            ← External reviews and stakeholder comms
│   │   └── ANIK-REVIEW-RESPONSE.md
│   ├── index.html                 ← Docs hub (published to /docs on Netlify)
│   ├── drive-links.js             ← Google Drive PDF links for briefs
│   └── README.md                  ← Docs index and authority order
│
├── scripts/
│   └── copy-docs.sh               ← Copies docs/*.html into site/docs/ for local preview
│
├── contentment-home.html          ← Single-file build (base64 images) — for email/offline
├── netlify.toml                   ← Netlify config (interim deploy)
└── README.md                      ← This file
```

---

## Local preview

**Homepage prototype:**

```bash
cd site && python3 -m http.server 8080
# open http://localhost:8080
```

**Somesh prototypes (Story Board + Foundation Reach Map):**

```bash
cd site && python3 -m http.server 8080
# http://localhost:8080/story-board
# http://localhost:8080/foundation-reach-map
# http://localhost:8080/story-board-feed-guide
```

Serve from `site/` (recommended). `file://` works for these pages if `program-data.js` and `assets/countries-110m.js` load via `<script>` tags; D3/topojson still load from CDN (internet required once). See [`prototypes/world-map/README.md`](./prototypes/world-map/README.md).

**Homepage + project docs:**

```bash
./scripts/copy-docs.sh
cd site && python3 -m http.server 8080
# open http://localhost:8080/docs
```

`site/docs/` is gitignored. Run `copy-docs.sh` after editing anything in `docs/*.html`.

> **Post-scaffold (after FEAT-002):** `npm run dev` (`astro dev`) replaces `python3 -m http.server`.

---

## Design tokens

| Token | Value |
|-------|-------|
| Display font | Newsreader |
| Body font | Inter |
| Brand font | Varela Round |
| `--teal` | `#1FAFC0` |
| `--ocean` | `#0080B0` |
| `--deep` | `#024E70` |
| `--green` | `#4FA98C` |
| `--paper` | `#FBFAF7` |

**Rule:** No design changes during migration. Copy CSS and JS verbatim from `site/index.html` into Astro components.

---

## Homepage sections (anchor links)

| Anchor | Section |
|--------|---------|
| `#top` | Hero |
| `#why` | Why Teacher Wellbeing |
| `#impact` | Stats + educator quote |
| `#how` | How Change Happens (orbit scroll animation) |
| `#homeroom` | Monthly giving tiers ($5 / $25 / $100) |

---

## Homepage assets (`site/assets/`)

| File | Use |
|------|-----|
| `img01_3b9ca36077.png` | Logo (nav + footer) |
| `img02_f3c7dabda3.jpg` | Hero (desktop) |
| `img03_7bbd154b69.jpg` | Hero (mobile) |
| `img04_62faa64049.jpg` | Why section |
| `kenya_band.jpg` | Kenya principal quote band |
| `img05`–`img08` | Community circle photos |
| `img09_d4a3165ce3.jpg` | Four Pillars background |
| `img10_526e7678c7.jpg` | Homeroom section |
| `img11`–`img13` | "More ways in" door cards |

---

## Known open items on the prototype (Dave Kebo — non-blocking)

| Item | Detail |
|------|--------|
| `href="#"` on donation CTAs | Hero, nav pill, Homeroom section — wire to Keela URLs when finance provides them (FEAT-060) |
| `href="#"` on door / footer links | "Start the conversation", "See events", social links — wire when pages exist (FEAT-004) |
| Newsletter form | `onsubmit="return false"` — no backend yet (FEAT-070) |
| Mobile nav drawer | Button scrolls to nav only — full drawer in FEAT-003 |

---

## Analytics stack (confirmed July 2026)

| Tool | Role |
|------|------|
| **GA4** | Primary — traffic, sessions, funnels, campaign attribution (existing account) |
| **Microsoft Clarity** | Heatmaps + session recordings — CRO (existing account) |
| **PostHog** | Product analytics, funnel cohorts, A/B testing |
| **Bing Webmaster Tools** | Bing + Copilot AI indexing (existing account) |
| **Google Search Console** | Google indexing, Core Web Vitals, manual actions |

> Plausible dropped (paid subscription). See [DECISIONS.md](./docs/planning/DECISIONS.md) DECISION-001.  
> GA4 sets cookies — cookie consent banner required. See DECISION-002.

---

## Contact

| Role | Contact |
|------|---------|
| Project / technical | somesh@contentment.org |
| General | hello@contentment.org |
