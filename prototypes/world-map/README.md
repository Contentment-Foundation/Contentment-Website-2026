# Interactive World Map — Design Prototype

Status: **in progress / not yet integrated into the homepage.**

The shareable prototype lives at **`site/foundation-reach-map.html`** — deployed with the rest of
`site/` on Netlify (e.g. `contentmentweb2.netlify.app/foundation-reach-map.html`).

Use it for team navigation, discussion, and design finalization. Once approved, the map will be
restyled and embedded as a section on a page (likely the homepage).

## Preview locally

From the `site/` folder:

```bash
python3 -m http.server 8080
```

Open http://localhost:8080/foundation-reach-map.html (needs internet for D3 + map CDN).

## How it works

- **Map:** D3 `geoNaturalEarth1` flat projection rendering `world-atlas` TopoJSON. No globe, no zoom.
- **Matching:** served countries are matched by **ISO numeric code** (with a name fallback), so the
  highlight/click join can't silently fail.
- **Data lives in `site/program-data.js`** (shared with the Story Board prototype):
  - `PROGRAM` — keyed by display name; each entry has `iso`, `region`, `since`, `schools`,
    `educators`, `students`, `impact{}`, `programs[]`, and `stories[]`.
  - `CITIES` — city pins with `[lng, lat]` coords.
  - Each story: `{ q, text, by, role, img, cap, full }`. Missing fields are auto-filled; images are
    placeholder SVGs until real photos are set via `img` (URL or local path).
- **Interactions:** hover tooltip, click → floating popup (country summary), region filters,
  searchable country list, animated totals, a "Read the stories" trigger that slides open a
  right-side panel listing **all** that country's voices as collapsible blocks, and a
  collapsible country list sidebar.

## To integrate after approval

1. Move the map into a new section of `site/index.html` (Phase 1 stays a single self-contained file).
2. Restyle to the site's design tokens (`--ocean`, `--deep`, `--green`, `--teal`, `--paper`;
   Newsreader / Inter / Varela Round) instead of the prototype's purple/green palette.
3. Gate any animation behind `prefers-reduced-motion`, matching the rest of the homepage.
4. Replace placeholder images with real photos in `site/assets/` and point `story.img` at them.
5. Decide whether map libs stay on CDN or get vendored for the Astro migration.
