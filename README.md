# The Contentment Foundation — contentment.org

Phase 1 homepage prototype: static HTML, CSS, and vanilla JavaScript in `site/`. Full site plan (multi-page Astro on Vercel) lives in [`docs/`](./docs/).

## Deployment

| Environment | Host | URL | When |
|-------------|------|-----|------|
| **Development preview** | Netlify (interim) | [contentmentweb2.netlify.app](https://contentmentweb2.netlify.app) | Now — prototype + internal briefs |
| **Production** | Vercel | [contentment.org](https://contentment.org) | After Astro migration (`TICKET-002`) |
| **PR previews** | Vercel | `*.vercel.app` | Per pull request on `main` |

**Now:** `netlify.toml` publishes `site/` and **generates** `site/docs/` on each build by copying `docs/*.html`. That folder is **not in git** — edit sources in `docs/` only.

**Target:** Astro 4.x static build on Vercel — see [`docs/planning/TECHNICAL-ARCHITECTURE.md`](./docs/planning/TECHNICAL-ARCHITECTURE.md) and [`docs/WEBSITE-ARCHITECTURE.md`](./docs/WEBSITE-ARCHITECTURE.md).

| Netlify path | Page |
|--------------|------|
| `/` | Homepage (`site/index.html`) |
| `/docs` | Project docs hub |
| `/docs/team-brief` | Team brief |
| `/docs/tech-brief` | Technical development brief |
| `/docs/growth-brief` | Growth, SEO & analytics brief |
| `/docs/automation-brief` | Automation & integrations brief |

**Google Drive (optional):** PDF/Doc exports of briefs only — not `.md` files. Paste URLs in `docs/drive-links.js`.

## Repository layout

```
site/
  index.html     ← primary editable build (~48 KB)
  assets/        ← images referenced by index.html (~2.8 MB)
  README.txt     ← detailed notes (same content as this file)

docs/
  index.html           ← project docs hub (source for /docs)
  TEAM-BRIEF.html      ← team brief (source for /docs/team-brief)
  TECH-BRIEF.html      ← tech brief (source for /docs/tech-brief)
  GROWTH-BRIEF.html    ← growth brief (source for /docs/growth-brief)
  *.md                 ← planning & copy reference (repo only)
  planning/            ← PRD, technical architecture, feature tickets

contentment-home.html   ← single-file build at repo root (~3.8 MB)
                          All images embedded as base64. Use for email,
                          offline preview, or sharing one file.
```

## Which file to edit

- **Day-to-day edits:** `site/index.html` — small enough to open quickly in any editor or AI session.
- **After changing `site/index.html`:** regenerate `contentment-home.html` if you still need the portable single-file version.
- **Image swaps:** replace files in `site/assets/` (keep filenames) or update the `src` / `background-image` paths in `index.html`.

## Preview locally

**Homepage** — from the `site/` folder:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

(Or open `site/index.html` directly in a browser — use the footer **Project docs** link or open `site/docs/index.html`. Links use relative paths so they work over `file://` as well as a local server. Run the docs copy command below first so `site/docs/` exists.)

**Project docs** — copy HTML from `docs/` into `site/docs/`, then serve `site/`:

```bash
./scripts/copy-docs.sh
cd site && python3 -m http.server 8080
```

Then open http://localhost:8080/docs

(`site/docs/` is gitignored — run `./scripts/copy-docs.sh` after editing anything in `docs/*.html` or `docs/drive-links.js`.)

## Planning docs

| Doc | Path |
|-----|------|
| Site architecture & URLs | [`docs/WEBSITE-ARCHITECTURE.md`](./docs/WEBSITE-ARCHITECTURE.md) |
| Technical architecture | [`docs/planning/TECHNICAL-ARCHITECTURE.md`](./docs/planning/TECHNICAL-ARCHITECTURE.md) |
| Open technical decisions | [`docs/planning/DECISIONS.md`](./docs/planning/DECISIONS.md) |
| Docs index | [`docs/README.md`](./docs/README.md) |

## Page sections (anchor links)

| Anchor | Section |
|--------|---------|
| `#top` | Hero |
| `#why` | Why Teacher Wellbeing (split image + text) |
| `#impact` | Stats + educator quote |
| — | Kenya voice band (no anchor) |
| `#how` | How Change Happens (scroll-pinned ripple animation) |
| — | You Are Not Alone / community circles |
| — | Four Pillars (interactive cards) |
| `#homeroom` | Monthly giving tiers ($5 / $25 / $100) |
| — | More ways in (schools, events, share) |
| — | Newsletter signup |
| — | Footer |

## Assets (`site/assets/`)

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

## Interactions

Defined in the `<script>` block at the bottom of `site/index.html`:

- Sticky nav background on scroll
- Hero entrance animation on load
- IntersectionObserver scroll reveals (`.anim`)
- Impact stat count-up (`.num` `data-count`)
- Four Pillars accordion (`.pcard` click / keyboard)
- How Orbit pinned scroll (560vh; beat fade 1.1s)
- Subtle parallax on pillars background + hero text
- `prefers-reduced-motion` respected throughout

## Still to do (non-blocking)

**Donation / CTA links** (currently `href="#"`):

- Hero: "Join Homeroom, from $5/month"
- Nav: "Join Homeroom" pill
- Homeroom: "Take your seat in Homeroom"

→ Wire to real Keela donation URL when available.

**Other placeholder links** (`href="#"`):

- Doors: "Start the conversation", "See events", "Share the movement"
- Footer: Events, Give, Share, Subscribe, LinkedIn, Instagram, YouTube

**Newsletter form:** `onsubmit="return false"` — no backend integration yet.

**Optional polish:**

- Tune orbit scroll pacing (`.orbit-scroll` height, currently `560vh`)
- Tune beat fade duration (currently `1.1s`)
- Mobile menu button only scrolls to nav — no full drawer yet

## Contact

- **Project / technical:** somesh@contentment.org
- **General:** hello@contentment.org
- The Contentment Foundation · 501(c)(3) nonprofit
