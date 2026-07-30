# Handoff — "Our Impact" page (repo build)

**Date:** 2026-07-28
**Page:** Our Impact (the page formerly known as `stories.html`).
**Build in this bundle:** de-inlined `index.html` + `assets/` (repo-friendly form).
**For:** Contentment tech team and the next Claude picking this up.

---

## 1. What this build is

This is the **Our Impact** page swapped onto **shared header/footer kit v2**, packaged
in the **de-inlined** form to match the Why-Wellbeing repo convention:

- `index.html` — 91 KB. Every image is referenced from `assets/` (no base64 embedded).
- `assets/` — 37 files: 34 photos (`img-01.jpg`..`img-34.jpg`), `worldmap.png`
  (hero world map), `logo_lockup_light.svg`, `logo_lockup_dark.svg`.
- `README.txt` — short structural note.

There is also a **self-contained single-file** form maintained in parallel
(`work.html` in the working dir, images base64-embedded) for Netlify Drop previews.
The two are kept in sync; if you edit one, mirror the change to the other. No build
step either way.

Only remote dependency: the Google Fonts `<link>` in `<head>` (Newsreader, Inter,
Cedarville Cursive — Varela Round was dropped, header/footer no longer use it).

---

## 2. What changed this session

**Header + footer → kit v2.** Replaced the old furniture (42px `.ball` PNG coin in
both header and footer) with the official horizontal lockup and scroll cross-fade:
`logo_lockup_light.svg` (white wordmark + coin, nav-at-rest + footer) cross-fades to
`logo_lockup_dark.svg` (grey wordmark, no coin) on the scrolled white bar, via
`grid-area:1/1`. New footer compliance line + separate "© 2026" line (both bottom
lines kept). `.news input{min-width:0}` bug-fix carried in as insurance. Header
padding 14px/10px. No content restyling beyond the furniture.

**Video poster fix (the one that took several passes — read this).** The
Schools-of-Wellbeing feature video card ("The Country School / Los Angeles",
`.schoolsvid .videoframe`, YouTube id `Ot_ZecrcNs0`) showed **two play buttons**.
Two separate defects, fixed in order:

1. The poster JPEG was a **screenshot of the YouTube thumbnail with the play button
   baked into the image**. Replaced it with the real thumbnail
   (`https://i.ytimg.com/vi/Ot_ZecrcNs0/maxresdefault.jpg`, clean 1280×720, no button).
2. The real culprit: the `.vplay` element renders its play arrow via the global
   `.vplay::after` triangle (used by every card). This one card **also** had its own
   `.schoolsvid .videoframe .vplay::before` rule drawing a **second** triangle on top —
   two overlapping arrows inside one white circle. Fixed by neutralizing the extra
   rule to `.schoolsvid .videoframe .vplay::before{content:none}`, so the card now
   uses only the base `::after`, exactly like the other cards. Also normalized this
   card's circle from 74px → 66px to match the other feature videos.

**Lesson for next time (debugging discipline):** when a card looks "doubled," check
the **pseudo-elements** (`::before`/`::after`), not just the element count and the
poster image. Enumerate `getComputedStyle(el,'::before'/'::after')` for every element
in the card. Counting `.vplay` nodes returns 1 and hides a two-triangle bug.

---

## 3. THE SEAMS — all nav/footer destinations are still `#` (by design)

Per the swap brief, links were deliberately left at `#` for tech to wire, and
**no `seams.js` is included** (bake real hrefs into the markup at deploy). There are
18 `href="#"` anchors (six nav tabs × 2 for the mobile/duplicate nav, plus donate/
signin). Wire these:

| Element | Attribute | Current | Wire to |
|---|---|---|---|
| About | `data-page="about"` | `#` | about page |
| Why Teacher Wellbeing | `data-page="why-wellbeing"` | `#` | why-wellbeing page |
| Our Impact | `data-page="our-impact"` | `#` | this page's public URL |
| Schools | `data-page="for-schools"` | `#` | for-schools page |
| Events | `data-page="events"` | `#` | events page |
| Get Involved | `data-page="get-involved"` | `#` | get-involved page |
| Sign In | `data-link="school-platform"` | `#` | school-platform / sign-in URL |
| Donate (nav pill + footer) | `data-donate` | `#` | Keela donate URL |
| Footer LinkedIn | `data-link="linkedin"` | `#` | LinkedIn URL |
| Footer Instagram | `data-link="instagram"` | live | `https://www.instagram.com/contentmentorg/` ✅ |
| Footer Facebook | `data-link="facebook"` | `#` | Facebook URL |
| Footer YouTube | `data-link="youtube"` | `#` | YouTube URL |

The "Our Impact" tab keeps `aria-current="page"`. (Kit v2 has no active-tab
underline; if you want inner pages to mark their current tab visually, that's a
site-wide header change across all six pages — a Dave decision, do not fork it here.)

---

## 4. Live-site checks (do NOT judge from a local file open)

- **Videos are unlisted YouTube**, embedded via `youtube-nocookie`; they need `https`
  to play. The feature video id is `Ot_ZecrcNs0` (playlist
  `PL6grto2rTA0-W5HRhrk6i7S0UqJ2030Q3`). Click once on the live site to confirm.
- **`assets/img-10.jpg` is the feature-video poster** (the Country School frame). If
  you renumber or dedupe assets, keep that reference in sync — it is the file most
  likely to be touched again.

---

## 5. Deploy

- **Repo:** drop `index.html` + `assets/` at this page's repo location. If the repo
  already carries shared copies of the two logo SVGs from the header/footer kit, you
  may dedupe against those. Rename `index.html` to the repo's page filename if the
  repo convention differs (this page was `stories.html`; it is becoming "Our Impact",
  so confirm the final filename and that `data-page="our-impact"` points at it).
- **Netlify Drop (preview only):** use the self-contained single-file form, renamed to
  `index.html` at the zip root (no nested folder — macOS nested-folder issue breaks
  Netlify Drop). Nav tabs point at `#` until wired, so they won't navigate in preview.

---

## 6. Verification run on this build (all pass)

- `.vplay` in the feature card: **1 element, 1 triangle** (`::before` = none,
  `::after` present), 66px — matches the other feature videos.
- Feature poster is pixel-identical to the clean YouTube thumbnail (no baked-in button).
- 37 asset references, 37 files on disk, **0 missing, 0 orphan, 0 broken images, 0 4xx**.
- **0** `data:image` URIs remaining in the HTML (fully de-inlined).
- Horizontal overflow **0px at 1280px and 360px**.
- Residue: no old `.ball` furniture, no `Varela+Round` in the fonts link,
  no `seams.js`; brand cross-fade + footer legal/copy present; `aria-current` kept.

Verify visuals with `getComputedStyle()` / `getBoundingClientRect()` and, for play
buttons, pseudo-element inspection — headless screenshots render blank/unreliable in
the sandbox and hid this bug for several passes.

---

## 7. Open items / on the horizon

- Tech wiring pass (section 3) across this and the other pages.
- `stories.html` → "Our Impact" rename/redirect so `data-page="our-impact"` resolves.
- Apply `.news input{min-width:0}` on the homepage and other inner pages (still unfixed
  there per earlier notes).
- Worth a quick audit of the other pages' video posters: if any poster was captured as
  a **screenshot** rather than pulled from `i.ytimg.com/vi/<id>/maxresdefault.jpg`, it
  will carry a baked-in button. Use the real thumbnail URL per video id.
