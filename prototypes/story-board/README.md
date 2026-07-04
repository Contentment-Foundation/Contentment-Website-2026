# Story Board — Design Prototype

Status: **in progress / not yet integrated into the homepage.**

A browsable wall of educator and student voices — photos, quotes, and video —
on a cork-board canvas with a faint world map. Complements the Foundation Reach map (`site/foundation-reach-map.html`).

## Preview

Open **`site/story-board.html`** in a browser while online (map background loads from CDN).

Deployed with `site/` on Netlify:

- https://contentmentweb2.netlify.app/story-board
- https://contentmentweb2.netlify.app/foundation-reach-map (shared `program-data.js`)

## Content & media feed

**How to add stories (team guide):** [`site/story-board-feed-guide.html`](../../site/story-board-feed-guide.html) · `/story-board-feed-guide` on Netlify

**Developer reference:** [`FEED-GUIDE.md`](FEED-GUIDE.md) — field reference, Google Drive & YouTube URL formats, consent checklist, Phase 2 admin portal plan.

Phase 1: paste Google Drive image links and YouTube URLs into `site/program-data.js`.  
Phase 2 (planned): staff admin portal — no code required to publish stories.

## Views

- **Board** — infinite canvas; default zoom fits all cards on screen; pan (drag), zoom (scroll, +/-, or pinch on touch), hanging frames with subtle sway
- **Grid** — responsive card grid (default on viewports ≤820px; tighter columns ≤600px)

## Controls

- Region and role filters (empty state when no stories match)
- Board / Grid toggle (zoom/fit controls hidden in Grid mode)
- Fit board · Reset — both return to fit-all-to-screen on Board view
- Click a frame → full story modal (YouTube embed when `video` is set)

## Data

Stories are flattened at runtime from **`site/program-data.js`** (shared `PROGRAM` object with the map prototype).

Each story supports: `{ q, text, full, by, role, img, cap, video? }`.

## To integrate after approval

1. Restyle to site tokens (`--paper`, `--teal`, `--ocean`, Newsreader / Inter / Varela Round).
2. Gate sway animation behind `prefers-reduced-motion`.
3. Link from Foundation Reach map → Story Board.
4. Replace placeholder images; wire real Drive/YouTube URLs or Phase 2 CMS feed.
