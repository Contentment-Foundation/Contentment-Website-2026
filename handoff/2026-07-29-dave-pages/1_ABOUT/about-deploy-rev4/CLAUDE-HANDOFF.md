# Handoff - About page (`about.html`), rev 4

**Date:** 2026-07-28
**For:** the tech team's Claude session (wiring + deploy).
**From:** the design/build session. Dave (CCO) directed these changes.

---

## 1. What this file is

`about.html` is the Contentment Foundation's **About** page, one of the six
site pages. It ships **self-contained**: every image is base64-embedded and both
logo lockup SVGs are inlined as data-URIs. The only remote dependencies are the
Google Fonts `<link>` in `<head>` and the live Instagram href in the footer.
There is no `assets/` folder and no build step required to deploy it.

It rides the **shared header + footer kit v2** (2026-07-28) - the same nav and
footer furniture as the homepage `index.html`. Header/footer are **site-wide
furniture**: do not fork them per page. Any nav/footer change goes back to Dave
and gets re-transplanted across all pages, not patched here.

## 2. What changed in rev 4 (from rev 3)

1. **Header + footer -> kit v2.** Old cf_ball + text wordmark replaced by the
   official logo lockup. At rest: 54px white lockup (white wordmark + white
   coin) on the transparent/photo header. On scroll: header turns white, the
   lockup cross-fades to the 47px grey wordmark with **no** coin. Footer uses
   the light lockup (coin required on the blue ground - the mark's own blue is
   `#0190BE` and vanishes on the `#0090be` footer without the white coin).
   Verified: at-rest light=1/dark=0, scrolled light=0/dark=1, footer bg
   `rgb(0,144,190)`.
2. **Footer bottom lines:** BOTH kept - the compliance sentence (`.foot-legal`)
   plus "(c) 2026 The Contentment Foundation" (`.foot-copy`) - matching the
   homepage, per Dave. (The kit README prose says drop the second line; the
   shipped `footer.html` and homepage keep both. We followed the homepage,
   which the kit itself names as source of truth. Flag reconciled.)
3. **Our Story copy** replaced verbatim with the compliance-approved block.
   Prose now reads **"Dr. Daniel Cordaro"**. Closing text link is
   **"Our answer lives here ->"** (target unchanged: `why-wellbeing.html`).
   The photo caption stays **"Dan teaching in Bhutan, 2014"** - familiar in the
   caption, formal in prose, by Dave's call.

## 3. YOUR JOB - the seams (everything below is still `#`)

Per the swap brief, all nav/footer destinations were left at `#` for tech to
wire. `about.html` does **not** reference `seams.js`. Two ways to wire, pick
whichever matches the other pages - do not mix approaches across the site:
  - **Bake** real hrefs into the markup at deploy (the swap brief's preference), or
  - **Add** `<script src="assets/seams.js"></script>` before `</body>` and drop
    `seams.js` into an `assets/` folder (the kit README's approach).

| Element (nav + footer)      | Attribute                  | Current | Wire to |
|-----------------------------|----------------------------|---------|---------|
| About                       | `data-page="about"`        | `about.html` (aria-current) | already wired |
| Why Teacher Wellbeing       | `data-page="why-wellbeing"`| `#`     | `why-wellbeing.html` |
| Our Impact                  | `data-page="our-impact"`   | `#`     | Our Impact page (see note below) |
| Schools                     | `data-page="for-schools"`  | `#`     | for-schools page |
| Events                      | `data-page="events"`       | `#`     | events page |
| Get Involved                | `data-page="get-involved"` | `#`     | get-involved page |
| Sign In                     | `data-link="school-platform"` | `#`  | school-platform / sign-in URL |
| Donate (nav pill + footer)  | `data-donate`              | `#`     | Keela donate URL |
| Footer LinkedIn             | `data-link="linkedin"`     | `#`     | LinkedIn URL |
| Footer Instagram            | `data-link="instagram"`    | live    | already live |
| Footer Facebook             | `data-link="facebook"`     | `#`     | Facebook URL |
| Footer YouTube              | `data-link="youtube"`      | `#`     | YouTube URL |
| Newsletter form (Card 1)    | `data-embed="newsletter"`  | `onsubmit` returns false (swallows submissions) | real newsletter/Keela provider |

**Keela Donate button color:** set `#0090bd` in the **Keela dashboard** (not
reachable from our CSS; it defaults to `#507b91`).

**Open question (carried from rev 3):** "Our Impact" uses `data-page="our-impact"`.
The old page was `stories.html`. If a "stories" seam is already wired somewhere,
rename one side so they match. The footer's Our Impact no longer targets
`index.html#impact`.

## 4. Before public deploy

- **Name manifest:** `about-name-manifest.txt` needs Dave's line-by-line pass.
  Board + Advisory names were transcribed from old-site screenshots and still
  need his eyeball. Do not deploy publicly before that sign-off.
- **Voice-doc override, do NOT "fix":** the approved Our Story copy contains
  two internally banned words, **"quiet"** and **"donors"**. `build_about.py`
  prints a COPY WARNING for each at build time. They are intentional (approved
  by WJ/compliance). Leave them. Logged in the manifest.
- **Cosmetic pending:** hi-res `bali5` hero swap; CLOSE section copy unspecced.

## 5. Deploy

- **GitHub repo `Contentment-Website-2026`:** drop `about.html` at repo root,
  replacing the existing About page. Self-contained, so no `assets/` needed for
  this page to render. Netlify is case-sensitive - the only hard internal links
  are `index.html`, `about.html`, `why-wellbeing.html`.
- **Netlify Drop preview:** rename `about.html` to `index.html`, zip with
  `index.html` at the ZIP ROOT (no nested folder - macOS nests by default). The
  six nav tabs point at `#` until wired, so they won't navigate in preview.

## 6. Rebuilding (only if you swap an asset or re-edit)

`build/` reproduces `about.html` **byte-identical** (verified this build).
`build/` is source-only; `build_about.py` expects images in the same directory:
`hero_bali5.jpg`, `dan_q82.jpg`, `story_country3.jpg`, and `headshots/`. Copy
them from `photos/` (renaming the three top-level ones per README-FOR-TECH),
then `python3 build_about.py`.

**Gotchas:**
- `t_base.css` MUST precede `t_kit.css` in the style order (already wired). The
  kit is a component, not a foundation - without the base layer the page renders
  as Times-with-underlines-and-white-border.
- The two logo SVGs are **inlined as data-URIs** in `t_header.html` /
  `t_footer.html` to keep the page self-contained. If you re-transplant the kit,
  re-inline them the same way. The coin is baked into the SVG (a white circle
  behind the mark), not CSS - it carries automatically.
- Verify with `getComputedStyle()` / `getBoundingClientRect()`, not screenshots -
  headless screenshots render blank in the sandbox, and `.anim` elements start
  at `opacity:0` until the IntersectionObserver adds `.in`.

## 7. Verified this build

- No unresolved `__TOKEN__`s. Fully self-contained (no `assets/` refs; only
  Google Fonts + live Instagram remote).
- Zero horizontal overflow at 1280px and 360px (the kit's `.news input{min-width:0}`
  fix is present).
- Brand lockup 54px at rest / 47px scrolled / 45px mobile. Cross-fade correct
  both states. Footer resolves to `#0090be` with both bottom lines.
- Build reproduces `about.html` byte-identical from `build/`.
