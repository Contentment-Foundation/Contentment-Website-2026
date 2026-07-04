# Interactive World Map — Design Prototype

Status: **in progress / not yet integrated into the homepage.**

Built by **Somesh Bhardwaj**. Team review only — not linked from the public homepage yet.

## Where it lives

| | Path |
|---|------|
| **Source file** | `site/foundation-reach-map.html` |
| **Shared story data** | `site/program-data.js` (same file as Story Board) |
| **Map boundaries** | `site/assets/countries-110m.js` (`window.WORLD_ATLAS` — bundled TopoJSON) |
| **Integration notes** | This file |

## Deploy URLs (Netlify interim)

Configured in [`netlify.toml`](../../netlify.toml):

| Clean URL | File |
|-----------|------|
| `/foundation-reach-map` | `foundation-reach-map.html` |
| `/foundation-reach-map.html` | same |

Example: https://contentmentweb2.netlify.app/foundation-reach-map

At Vercel cutover (FEAT-101), copy the same redirect into `vercel.json`.

## Preview locally

**Recommended** — serve from `site/`:

```bash
cd site && python3 -m http.server 8080
```

Open http://localhost:8080/foundation-reach-map

**Direct `file://`:** supported. Map data loads via `<script src="assets/countries-110m.js">` (not fetch — browsers block `d3.json()` from `file://`). D3 and topojson-client still load from jsDelivr CDN (internet required once).

## Tech stack (map layer only)

| Piece | Role |
|-------|------|
| **D3.js** (CDN) | SVG map: `geoNaturalEarth1` projection, `geoPath` to draw countries, `d3.zoom` for pan/zoom |
| **topojson-client** (CDN) | Converts bundled TopoJSON → GeoJSON features D3 can render |
| **`countries-110m.js`** | [Natural Earth world-atlas](https://github.com/topojson/world-atlas) at 110m resolution (~108 KB) |
| **`program-data.js`** | TCF countries, stats, and educator/student stories |
| **Vanilla JS** | Pin cards, modals, region filters — no React/framework |

Why D3 + TopoJSON for a prototype: full visual control (custom pin cards, colors, animation), no Mapbox/Google API keys, matches the static HTML prototype approach. Production may vendor D3 locally or embed the map as an Astro section after design approval.

## How it works (current build)

- **Map:** flat D3 `geoNaturalEarth1` projection; served countries highlighted green.
- **Country matching:** ISO numeric code via `isoLookup` (handles zero-padded codes like `036` → Australia), with name fallback.
- **Pin cards (desktop):** up to two stories per country (educator + student preferred); hanging cards with pendulum animation; visible at default zoom. Hover zooms the card, click opens an expanded modal.
- **Balloon pins (mobile / `pointer:coarse`):** one 18 px colour balloon per country, tail tip anchored to the country centroid. Balloons scale proportionally with map zoom (√zoom factor). Tapping a balloon opens the story modal. When two or more pins are within 44 px of each other a bottom-sheet picker slides up listing the nearby countries so the user can choose exactly which story to open.
- **Interactions:** region filter chips, hover tooltip, click/tap → modal, pan/zoom (scroll, pinch, or +/- buttons).
- **Data:** edit `site/program-data.js` once — Story Board and this map both read it.

Manual card position overrides (crowding): `India`, `Russia` — see `OVERRIDES` in `foundation-reach-map.html`.

## Regenerate map data (optional)

If you update `site/assets/countries-110m.json` from upstream world-atlas:

```bash
node -e "const fs=require('fs'); const j=fs.readFileSync('site/assets/countries-110m.json','utf8'); fs.writeFileSync('site/assets/countries-110m.js', '// World Atlas countries-110m\\nwindow.WORLD_ATLAS='+j+';\n');"
```

## To integrate after approval

1. Embed as a section on the homepage or a dedicated route (e.g. `/impact`).
2. Restyle to site design tokens (`--ocean`, `--deep`, `--green`, `--teal`, `--paper`; Newsreader / Inter / Varela Round).
3. Gate animation behind `prefers-reduced-motion`.
4. Replace placeholder story images with real photos in `site/assets/`.
5. Vendor D3/topojson in `site/assets/` or bundle via Astro — remove CDN dependency for production.
