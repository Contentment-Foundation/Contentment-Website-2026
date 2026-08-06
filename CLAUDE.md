# CLAUDE.md — Contentment Foundation Website

Context and standing instructions for AI sessions working in this repo. Read this first.
Full project orientation: [`README.md`](./README.md).

## What this is

The website for **The Contentment Foundation** (contentment.org), a 501(c)(3) nonprofit
focused on teacher and student wellbeing.

- **Now:** multi-page **Astro 4.x** static site in `src/` — Netlify preview publishes `dist/`
  (`contentmentweb2.netlify.app`).
- **Target:** same build on **Vercel** at contentment.org (FEAT-101 cutover).
- **`site/`** is the superseded Phase 1 HTML prototype — do **not** edit it for production.

## Which file to edit (important)

- **Day-to-day page work → `src/`.** Routes in `src/pages/`; shared chrome in `src/components/`
  and `src/layouts/`; tokens/CSS in `src/styles/`.
- **CTA / Keela / donate / RSVP / social destinations → `src/config/seams.ts` only.**
- **Images → `public/assets/`.** Keep filenames stable, or update every `src` that references them.
- **Prototypes (map, Story Board) → `public/*.html`** (+ `public/program-data.js`).
- **Planning status → `docs/planning/launch-plan-data.json` + `TRACKER.md`** (see planning sync).
- **`contentment-home.html`** is a legacy single-file portable build — don’t treat it as the live site.

## Repo layout

```
src/                     PRIMARY — Astro site (edit here)
  pages/                 Routes: /, /why, /our-impact, /schools, /getinvolved,
                         /events, /about, /updates, /privacy, 404
  components/            Nav, Footer, Homeroom, Keela*, Newsletter, sections…
  layouts/BaseLayout.astro
  styles/                tokens.css + global.css
  config/seams.ts        CTA / Keela / external destinations
  scripts/               Client JS (nav, orbit, newsletter, …)
  lib/flodesk.js         Shared Flodesk helpers
public/                  Static assets + prototypes (copied into dist/)
  assets/                Images
  foundation-reach-map.html · story-board.html · story-board-feed-guide.html
  program-data.js
  sitemap.xml · robots.txt · llms.txt · favicon.svg
  docs/                  GENERATED at build — never hand-edit
netlify/functions/       Preview: newsletter.mjs → /api/newsletter
api/newsletter.js        Vercel twin of the same handler
site/                    Superseded Phase 1 prototype — not the publish root
prototypes/              Dev notes for map + Story Board
docs/                    Planning + content (source of truth for scope)
  planning/              PRD, TECHNICAL-ARCHITECTURE, FRONTEND-SPEC, ACCESSIBILITY,
                         FEATURE-TICKETS, DECISIONS, SECURITY, TRACKER,
                         launch-plan-data.json, QA/responsive audits
  research/              MESSAGING-AND-COPY, VOICE-AND-TONE, WEBSITE-ARCHITECTURE, EVIDENCE
  briefs/                Stakeholder summaries (.md/.html) — NOT authoritative specs
  correspondence/        External reviews / stakeholder comms
scripts/
  copy-docs.sh           docs/*.html → public/docs (build + local preview)
  refresh-timelines.py   Regenerates both timeline HTMLs from JSON
  refresh-launch-canvas.py
  google-sheets/         LaunchPlanSheet.gs builder
astro.config.mjs         output: 'static' (no adapter)
netlify.toml · vercel.json
```

## Source-of-truth hierarchy

For anything about scope, UI, or build approach, defer to `docs/planning/` in this order:

```
PRD.md (scope & MVP)
  → FRONTEND-SPECIFICATION.md (locked UI — ported into src/)
    → ACCESSIBILITY.md (a11y checklist + ARIA pattern reference)
  → TECHNICAL-ARCHITECTURE.md + SECURITY-AND-ACCESS.md (how we build)
  → FEATURE-TICKETS.md (specs)
  → TRACKER.md + launch-plan-data.json (live status)
```

`docs/briefs/*` are readable summaries only. **If a brief conflicts with `docs/planning/`, planning wins.**
Assume **no UI/UX redesign** beyond the approved pages unless a ticket says otherwise.

## Deployment

| Environment | Host | URL |
|-------------|------|-----|
| Dev preview (now) | Netlify | contentmentweb2.netlify.app |
| Production (target) | Vercel | contentment.org |
| PR previews | Vercel | `*.vercel.app` |

Netlify publishes `dist/` from `npm run build` (after `copy-docs.sh` → `public/docs`).
Prototype routes in `netlify.toml`: `/foundation-reach-map`, `/story-board`, `/story-board-feed-guide`.
`/give` → `/getinvolved` (301).

## Gotchas — read before editing

- **`public/docs/` is generated.** Edit brief sources in `docs/` only, then run `./scripts/copy-docs.sh`
  (or rely on the Netlify build). **At production cutover (FEAT-101 / HC-077):** remove Footer
  “Project docs”, stop publishing `/docs*` on contentment.org; keep `docs/` in the private repo only.
- **`astro.config.mjs` stays `output: 'static'` with no adapter.** Newsletter uses host-native
  functions (`netlify/functions` + `api/newsletter.js`), not Astro API routes — don’t reintroduce
  a hybrid/SSR adapter without an explicit ticket.
- Don’t list docs/prototype paths in Astro `redirects` — they overwrite real `public/` files with
  absolute `site`-URL meta-refresh pages. Keep those rewrites in `netlify.toml` / `vercel.json`.
- CSP lives in both `netlify.toml` and `vercel.json` — keep them in sync by hand when origins change.
- `prefers-reduced-motion` is respected throughout — gate any new animations the same way.
- Timeline HTML status spans / notes / `As of` are **generated** — use `refresh-timelines.py`, never hand-edit.

## Design tokens (defined in `src/styles/tokens.css`)

| Token | Value | | Fonts | |
|-------|-------|-|-------|-|
| `--teal` | `#1FAFC0` | | Display | Newsreader |
| `--ocean` | `#0080B0` | | Body | Inter |
| `--deep` | `#024E70` | | Brand | Varela Round |
| `--green` | `#4FA98C` | | | |
| `--paper` | `#FBFAF7` | | | |

## Homepage sections & interactions

Anchors: `#top` hero · `#why` · `#impact` · Kenya band · `#how` (scroll-pinned ripple) ·
community circles · Four Pillars (accordion cards) · `#homeroom` (Keela donate / Homeroom) ·
doors · newsletter · footer.

Client JS lives under `src/scripts/` (nav, orbit, animations, newsletter) — not a single
bottom-of-page `<script>` block as in the old `site/index.html`.

## Known open items

- Per-tier Homeroom Keela products — General Donation Form is live; `seams.joinTiers` still empty (HC-075).
- Analytics credentials — scaffold in `Analytics.astro` + Sentry; waiting on IDs (HC-076).
- Newsletter — Flodesk path shipped; live e2e submit test + Upstash rate limit + Vercel verify pending.
- `/terms` + final legal privacy copy (FEAT-071).
- Pre-launch QA fixes — audit done ([PRE-LAUNCH-QA-AUDIT.md](docs/planning/PRE-LAUNCH-QA-AUDIT.md)).
- Production DNS cutover (FEAT-101) including HC-077 unpublish `/docs*`.
- **Foundation Reach Map:** `public/foundation-reach-map.html` → `/foundation-reach-map`.
  D3 + topojson-client (CDN), `program-data.js`, `assets/countries-110m.js`.
  Notes: [`prototypes/phase-2/world-map/README.md`](prototypes/phase-2/world-map/README.md).
  After approval, embed on site and restyle to tokens.
- **Story Board:** `public/story-board.html` → `/story-board`. Same `program-data.js`.

## Browser MCP (dev QA)

Two browser MCP servers may be available in Cursor:

| Server | Use for |
|--------|---------|
| **cursor-ide-browser** (built-in) | Fast layout QA — navigate pages, click nav/accordions, snapshots, screenshots |
| **chrome-devtools** ([chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)) | Deeper checks — Lighthouse, performance traces, console/network inspection |

**Astro dev:** run `npm run dev` (default `http://localhost:4321`), then ask the agent to verify behavior in the browser.

**Locked responsive widths** (from `docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md`): 320, 390, 759, 768, 940, 1280 px — use `resize_page` or viewport emulation.

**Example prompts:** “Open `/our-impact` at 390px and screenshot the hero”; “Run Lighthouse a11y on the homepage”; “List console errors on the Foundation Reach Map.”

Config: `~/.cursor/mcp.json` (global — applies to all Cursor projects). Restart Cursor or reload MCP after changes.

## Standing instructions for AI sessions

- **Day-to-day page work → `src/` (Astro).** Routes under `src/pages/`; shared chrome in `src/components/`; tokens/CSS in `src/styles/`. Netlify publishes `dist/` from `npm run build`. `site/` is the superseded Phase 1 prototype — don't edit it for production.
- Match existing tokens, fonts, and the `.anim` reveal pattern — don't introduce a new design language.
- When in doubt about scope or architecture, check `docs/planning/` before acting.
- **Planning sync:** follow `.claude/rules/planning-docs-sync.md` (mirrored in `.cursor/rules/planning-docs-sync.mdc`). Code-only UI fixes don't need planning. Status / route / CTA / schedule / decision changes do — update `launch-plan-data.json` + `TRACKER.md`, run `build-sheet-script.py` + `refresh-launch-canvas.py` + `refresh-timelines.py --notes`, and walk the rule's full checklist (FEATURE-TICKETS / DECISIONS / briefs / sitemap / redirects) for anything that applies. **The two timeline HTMLs are generated now** — never hand-edit their status spans, note cells or `As of` stamp; `refresh-timelines.py --check` exits 1 when they're stale. On commit/push of status-worthy work, include those updates and remind: Sheet **Launch Plan → Refresh from source** (or Force reseed).

## Recent work attribution (read before editing)

Engineering owner for the live Astro site and launch-plan sync is **Somesh Bhardwaj** (`Dev-Somesh` in git; somesh@contentment.org). When TRACKER / JSON notes say **Aug 4 (Somesh)** (or similar dated Somesh tags), treat those as Somesh-directed changes — do not reattribute to Dave, Kristina, or another agent without evidence.

**4 Aug 2026 session (Somesh), still relevant:**

| Area | What landed |
|------|-------------|
| `/getinvolved` | Donate split `#donate` — `public/assets/gi-donate-photo.jpg` + `KeelaDonateForm` (same General Donation Form as homepage); one-time gift → `#donate` |
| Nav | Current-page underline via `aria-current="page"` — white on transparent header, `--btnblue` when scrolled; desktop + drawer |
| `/schools` | Wellbeing-lead photo replaced at `public/assets/fs-Jadielsm.jpg` (same path) |
| Cutover checklist | **HC-077** — unpublish Footer “Project docs” + public `/docs*` at contentment.org go-live; keep `docs/` in private repo |

Authoritative changelog: `docs/planning/TRACKER.md`. Sheet source: `docs/planning/launch-plan-data.json`.

## Contact

Project/technical: somesh@contentment.org · General: hello@contentment.org
