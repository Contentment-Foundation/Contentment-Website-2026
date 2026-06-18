# The Contentment Foundation — Homepage

Static single-page site for [contentment.org](https://contentment.org). No build step, no framework — plain HTML, CSS, and vanilla JavaScript.

## Repository layout

```
site/
  index.html     ← primary editable build (~48 KB)
  assets/        ← images referenced by index.html (~2.8 MB)
  README.txt     ← detailed notes (same content as this file)

contentment-home.html   ← single-file build at repo root (~3.8 MB)
                          All images embedded as base64. Use for email,
                          offline preview, or sharing one file.
```

## Which file to edit

- **Day-to-day edits:** `site/index.html` — small enough to open quickly in any editor or AI session.
- **After changing `site/index.html`:** regenerate `contentment-home.html` if you still need the portable single-file version.
- **Image swaps:** replace files in `site/assets/` (keep filenames) or update the `src` / `background-image` paths in `index.html`.

## Preview locally

From the `site/` folder:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

(Or open `index.html` directly in a browser — external images still load.)

## Deploy

Upload the entire `site/` folder to any static host (Vercel, Netlify, Cloudflare Pages, S3, etc.). `index.html` is the entry point.

Root domain should serve `site/index.html`.

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

- **Email:** hello@contentment.org
- The Contentment Foundation · 501(c)(3) nonprofit
