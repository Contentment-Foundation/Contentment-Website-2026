# CLAUDE.md — Contentment Foundation Website

Context and standing instructions for AI sessions working in this repo. Read this first.

## What this is

The website for **The Contentment Foundation** (contentment.org), a 501(c)(3) nonprofit
focused on teacher and student wellbeing. This repo holds the **Phase 1 homepage prototype**
(static HTML/CSS/vanilla JS) plus the planning docs for the full multi-page rebuild.

- **Now:** single approved homepage — `site/index.html` — deployed to Netlify.
- **Target:** multi-page **Astro 4.x** static site on **Vercel** at contentment.org (migration = `TICKET-002`).

## Which file to edit (important)

- **Day-to-day homepage edits → `site/index.html`.** This is the primary editable build (~48 KB,
  self-contained: CSS in `<style>`, JS in a `<script>` block at the bottom). This is the file to
  touch for almost all homepage work.
- **`contentment-home.html`** (repo root, ~3.8 MB) is a portable single-file build with all images
  base64-embedded, for email/offline sharing. **Regenerate it from `site/index.html` when needed** —
  don't edit it directly.
- **Images → `site/assets/`.** Keep filenames stable, or update the `src`/`background-image` paths.

## Repo layout

```
site/                    Phase-1 build (what ships now)
  index.html             ← PRIMARY editable homepage
  assets/                images referenced by index.html
  docs/                  GENERATED at build time, gitignored — never edit here
contentment-home.html    portable single-file build (regenerate from site/index.html)
docs/                    planning + content (source of truth for the rebuild)
  planning/              PRD, TECHNICAL-ARCHITECTURE, FRONTEND-SPEC, ACCESSIBILITY, FEATURE-TICKETS, DECISIONS, SECURITY
  research/              MESSAGING-AND-COPY, VOICE-AND-TONE, WEBSITE-ARCHITECTURE, EVIDENCE
  briefs/               stakeholder summaries (.md/.html/.docx) — NOT authoritative specs
  index.html, *-BRIEF.html   sources for the /docs/* routes
scripts/copy-docs.sh     copies docs/*.html → site/docs/ for local preview
netlify.toml             Netlify build config
```

## Source-of-truth hierarchy

For anything about scope, UI, or build approach, defer to `docs/planning/` in this order:

```
PRD.md (scope & MVP)
  → FRONTEND-SPECIFICATION.md (locked UI = site/index.html)
    → ACCESSIBILITY.md (a11y checklist + ARIA pattern reference for that UI)
  → TECHNICAL-ARCHITECTURE.md + SECURITY-AND-ACCESS.md (how we build)
  → FEATURE-TICKETS.md (execution order)
```

`docs/briefs/*` are readable summaries only. **If a brief conflicts with `docs/planning/`, planning wins.**
Assume **no UI/UX changes beyond the approved prototype** unless a ticket says otherwise.

## Deployment

| Environment | Host | URL |
|-------------|------|-----|
| Dev preview (now) | Netlify | contentmentweb2.netlify.app |
| Production (target) | Vercel | contentment.org |
| PR previews | Vercel | `*.vercel.app` |

Netlify publishes `site/` and generates `site/docs/` on each build from `docs/*.html`.

## Gotchas — read before editing

- **`site/docs/` is gitignored and generated.** Edit brief sources in `docs/` only, then run
  `./scripts/copy-docs.sh` to refresh the local preview.
- After editing `site/index.html`, regenerate `contentment-home.html` if the single-file build is still needed.
- Links use **relative paths** so the site works over `file://` and a local server.
- `prefers-reduced-motion` is respected throughout — keep any new animations gated the same way.

## Design tokens (defined in `:root` of `site/index.html`)

| Token | Value | | Fonts | |
|-------|-------|-|-------|-|
| `--teal` | `#1FAFC0` | | Display | Newsreader |
| `--ocean` | `#0080B0` | | Body | Inter |
| `--deep` | `#024E70` | | Brand | Varela Round |
| `--green` | `#4FA98C` | | | |
| `--paper` | `#FBFAF7` | | | |

## Homepage sections & interactions

Anchors: `#top` hero · `#why` · `#impact` · Kenya band · `#how` (scroll-pinned ripple) ·
community circles · Four Pillars (accordion cards) · `#homeroom` (giving tiers) · doors · newsletter · footer.

JS (bottom `<script>` of `site/index.html`): sticky nav, hero entrance, IntersectionObserver reveals
(`.anim`), stat count-up (`.num[data-count]`), Four Pillars accordion, pinned orbit scroll (560vh),
subtle parallax.

## Known open items

- Donation/CTA links are `href="#"` — wire to the real Keela URL when available.
- Newsletter form is `onsubmit="return false"` — no backend yet.
- Mobile menu button only scrolls to nav; no full drawer.
- **Interactive world map section (in progress):** a flat D3 + TopoJSON world map with hoverable/
  clickable served countries and city pins that open a popup (schools, educators, students, impact,
  and educator/student stories with an image slider). Team review prototype:
  **`site/foundation-reach-map.html`** (also `/foundation-reach-map` on Netlify). Integration notes
  in `prototypes/world-map/README.md`. Once approved, embed as a section in `site/index.html` and
  restyle to site design tokens. Data lives in a `PROGRAM` object + `CITIES` array; map libs load
  from CDN.

## Standing instructions for AI sessions

- Prefer editing `site/index.html` over creating new files unless a ticket calls for it.
- Match existing tokens, fonts, and the `.anim` reveal pattern — don't introduce a new design language.
- Keep the homepage a single self-contained file for Phase 1 (no build step) until the Astro migration.
- When in doubt about scope or architecture, check `docs/planning/` before acting.

## Contact

Project/technical: somesh@contentment.org · General: hello@contentment.org
