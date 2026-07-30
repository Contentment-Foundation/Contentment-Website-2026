# For Schools — Tech Handoff (deploy + seam wiring)

**Page:** For Schools · The Contentment Foundation
**State:** design review fully applied, header/footer on the shared **kit v2 (2026-07-28)**.
**Deliverable:** one self-contained HTML file. Everything needed to render is inside it.

---

## What's in the zip
```
fs_review1/
  index.html              ← the page. Self-contained: all 17 images + both logo SVGs are
                            base64-inlined. Opens and renders on its own, no asset folder needed.
  source-images/          ← original photos (already embedded in the HTML; kept for the repo)
  video-posters/          ← YouTube poster JPGs (already embedded; kept for the repo)
  CHANGES-review1.txt      ← human-readable change log
  TECH-HANDOFF-for-schools.md  ← this file
```

## Is this everything you need?
**To render and deploy: yes.** `index.html` is fully self-contained. The only things it fetches at
runtime are Google Fonts (CDN) and the YouTube embeds/playlist — both over https, both already
wired. **What's left is your side:** wiring the seam URLs (below) and two external items (Keela
button colour, photo rights).

## Putting it in the repo
1. **Rename `index.html` → `for-schools.html`** and place it at the **repo root**, next to
   `index.html` (homepage), `about.html`, etc. The nav/footer link to `about.html` and
   `index.html#impact`, so those siblings must exist at the root for the links to resolve.
2. No external asset files are required for this page (all images + both logos are inlined). The
   `source-images/` and `video-posters/` folders are originals kept for the repo, not runtime deps.
3. If you deploy this page alone via Netlify Drop, `index.html` must sit at the ZIP root. In the
   full repo it's just a sibling page.

---

## Seams to wire — every destination is currently `#`
The markup carries `data-*` attributes; the real URLs are yours to fill in. The kit ships
`assets/seams.js` as the intended resolver (design owns the markup, tech owns one config file, so
design rebuilds don't wipe your wiring). **We did NOT wire `seams.js` into this single-file build**
— you can either drop it in and add `<script src="assets/seams.js"></script>` before `</body>`, or
bake the hrefs straight into the HTML. Your call.

| attribute | appears | wire to |
|---|---|---|
| `data-page="about"` | nav + footer | `about.html` (already set as the href — confirm) |
| `data-page="why-wellbeing"` | nav + footer | Why Teacher Wellbeing page URL |
| `data-page="our-impact"` | nav + footer | `index.html#impact` (already set — confirm) |
| `data-page="for-schools"` | nav + footer | this page (self-link); nav tab carries `aria-current="page"` |
| `data-page="events"` | nav + footer | Events page URL |
| `data-page="get-involved"` | nav + footer | Get Involved page URL |
| `data-donate` | nav Donate pill + footer Donate | Keela donate URL |
| `data-link="school-platform"` | Sign In | School Platform login URL |
| `data-link="linkedin"` | footer | LinkedIn URL |
| `data-link="instagram"` | footer | **LIVE** — `https://www.instagram.com/contentmentorg/` (already wired) |
| `data-link="facebook"` | footer | Facebook URL |
| `data-link="youtube"` | footer | YouTube channel URL |
| `data-cta="discovery"` | "Start a Conversation" (closing section) | currently `mailto:hello@contentment.org?subject=…` — swap for the Discovery Form URL if there is one |
| `data-cta="deck"` | "Download the partner deck" (hero + closing section) | partner-deck download URL |

Note: the **hero** "Start a Conversation" button is an in-page anchor to `#start` (the closing
section). That's intentional — leave it.

## YouTube
- **Difference section** ("We make sure this doesn't feel like one more thing to do") — Middleton
  International School, video ID **`2xw6WjymTPU`**.
- **Video section** ("See the work in real schools") — The Country School, video ID
  **`Ot_ZecrcNs0`**, playlist **`PL6grto2rTA0-W5HRhrk6i7S0UqJ2030Q3`**.
- Both open in a click-to-play lightbox via `youtube-nocookie`. Confirm "Allow embedding" is on and
  none are age-restricted. Unlisted is fine — the embed URL is identical to public, so flipping a
  video public later needs no rebuild.

## External items (not code, but blocking full public launch)
- **Keela Donate button colour** must be set to `#0090bd` in the **Keela dashboard** — it lives
  inside the embed and can't be reached from our CSS.
- **Confirm photo usage rights** before going fully public.

---

## Deliberate decisions — please DO NOT "fix" these
If you run this through an AI assistant, these will look like bugs. They are not; they were reviewed
and approved. Leave them.

- **Footer `#0090be` with white text is 3.66:1** (under WCAG AA). Closed by Dave — the blue stays.
  Same for the **Donate pill** (3.2:1) and several of V's section/card colours (the mint buttons,
  the gold `#e3b25d` ripple beat, `#81d4ee` on the trust blue). These were applied to V's exact
  hexes; contrast was intentionally not "corrected."
- **The footer asserts copyright twice** — the compliance line ends "All rights reserved." and the
  line below is "© 2026 The Contentment Foundation." Deliberate, approved off a render. Keep both.
- **`contentment.org` was removed from the footer fine print on purpose.** The only correct
  reference is `mailto:hello@contentment.org` in the footer's Connect column.
- **Header + footer are the shared v2 kit** (site-wide furniture). Don't restyle them per-page; a
  nav/footer change is a site-wide change.
- **Two logo SVGs cross-fade on scroll** — light (white wordmark + white coin) at rest and in the
  footer; dark (grey, no coin) on the white scrolled bar. **The white coin is load-bearing on
  blue** (the mark's `#0190BE` is ~1:1 against the footer blue without it) — don't strip it.
- **The "How the change happens" ripple is a scroll-driven pinned animation**, not a tap/click
  interaction. Intentional.

## Quick check after you upload
- Nav shows six tabs — About · Why Teacher Wellbeing · Our Impact · Schools · Events · Get Involved
  — plus Sign In (text link) and Donate (pill). Nav-links block measures ~601–616px in a 1240 box.
- No horizontal scrollbar at 360px or 1280px wide.
- Header bar turns white on scroll and the logo cross-fades; footer background computes
  `rgb(0, 144, 190)`.
- Console is clean — no 404 (there is no `seams.js` referenced unless you add it).

---

*Built deterministically from the 2026-07-06 base build with the review notes applied. Full
design-side detail lives in the design team's notes (handoff "H") and isn't needed for deploy.*
