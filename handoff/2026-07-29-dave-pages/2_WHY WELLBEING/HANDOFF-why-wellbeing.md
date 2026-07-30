# Handoff — "Why Teacher Wellbeing" page (`why-wellbeing.html`)

**Date:** 2026-07-28
**Page:** Teacher Wellbeing / "Why Teacher Wellbeing." Shipped as `index.html` for Netlify Drop; in the repo it is `why-wellbeing.html`.
**For:** Contentment tech team (and the next Claude picking this up).

---

## 1. What this file is

The page ships in **two equivalent forms** (both in the asset bundle):

- **`why-wellbeing.html`** — de-inlined: the 16 images are referenced from `assets/`. Repo-friendly; drop it in together with the `assets/` folder. Verified — all assets load, zero broken references.
- **`why-wellbeing.self-contained.html`** — every image base64-embedded, both logo SVGs inlined as data-URIs, no `assets/` folder, no external JS. Single-file Netlify Drop.

Both render identically. The only remote dependency in either is the Google Fonts `<link>` in `<head>` (Newsreader, Inter, Varela Round, Cedarville Cursive). It's on **shared header + footer kit v2** — the same furniture as the homepage.

**The asset bundle** (`why-wellbeing-assets.zip`) contains: both HTML forms, `assets/` (16 images + the two logo lockup SVGs + `seams.js`), the full `header-footer-kit-v2/` (furniture source of truth), a `README.txt`, and this file.

## 2. What changed this session (design track)

- **Hero spacing + responsive bounds.** Opened up the cramped headline, then capped how it scales: font-size ceilings, a frozen content-box width, and a comfortable left gutter so it reads well from mobile to ultrawide (previously the headline ballooned and ran into the subject on large screens; on small screens it rode the left edge).
- **Header + footer → kit v2.** Official logo lockup with the scroll cross-fade (white lockup + coin at rest, grey lockup on the white scrolled bar), new footer compliance line, both footer bottom lines kept. **Logos are inlined** (data-URIs) rather than referenced from `assets/`, to preserve this page's self-contained/single-file nature — same SVGs from the kit, just embedded.
- **Copy note.** The "National" stat descriptor now reads *"supporting the Ministry of Education's work with school counselors across Bhutan."*
- **Link note.** "Email our team" is now a **visible** link (deep-blue `#024E70`, underlined, semibold, 7.37:1 contrast) → `mailto:hello@contentment.org`. It was already a functional `mailto` but the global `a{color:inherit;text-decoration:none}` rule made it render as plain text.
- **`min-width:0` on `.news input`** is present (stops the 960–1280px horizontal-scroll bug).

## 3. THE SEAMS — everything below is still `#`, this is your job

Per the swap brief, all nav/footer destinations were deliberately left at `#` for tech to wire. **Recommended: bake the real hrefs directly into the markup** (replace each `#`). `seams.js` is the kit's optional dev-time layer, and the kit README itself says the *baked* output is what ships publicly — so no `seams.js` is needed at runtime if you bake. `seams.js` is included in the bundle's `assets/` for convenience, but **neither HTML form references it** — wiring it in is your call.

| Element (nav + footer) | Attribute | Current | Wire to |
|---|---|---|---|
| About | `data-page="about"` | `about.html` | ✅ already wired |
| Why Teacher Wellbeing | `data-page="why-wellbeing"` | `#` | `why-wellbeing.html` |
| Our Impact | `data-page="our-impact"` | `#` | the Our Impact page — see stories.html note below |
| Schools | `data-page="for-schools"` | `#` | for-schools page |
| Events | `data-page="events"` | `#` | events page |
| Get Involved | `data-page="get-involved"` | `#` | get-involved page |
| Sign In | `data-link="school-platform"` | `#` | school-platform / sign-in URL |
| Donate (nav pill + footer) | `data-donate` | `#` | Keela donate URL |
| Footer LinkedIn | `data-link="linkedin"` | `#` | LinkedIn URL |
| Footer Instagram | `data-link="instagram"` | `https://www.instagram.com/contentmentorg/` | ✅ live |
| Footer Facebook | `data-link="facebook"` | `#` | Facebook URL |
| Footer YouTube | `data-link="youtube"` | `#` | YouTube URL |
| Keela donation embed | `data-embed="keela-homeroom"` | placeholder card (labeled "Placeholder. Tech seam…") | real Keela donation embed |
| Newsletter form | `data-embed="newsletter"` | `onsubmit="return false"` | real newsletter provider |

(Exact page filenames for the `data-page` slugs are yours to confirm as those pages land.)

## 4. Live-site checks (do NOT work from a local file open)

- **Four videos** (`data-yt`) are **unlisted YouTube**, embedded via `youtube-nocookie`. They need `https` to play — click each once on the live site. IDs: `-9EAmpgkZ5w`, `OZsgO23XFj0`, `Q86tC-AaJQc`, `WtC8tA2PCtw`. Making them public later needs no rebuild.
- **Keela Donate button color.** Inside the Keela embed the Donate button defaults to `#507b91`; set **`#0090bd`** in the **Keela dashboard**. Not reachable from our CSS.

## 5. Site-wide flags (intentionally NOT fixed on this one page)

- **Active-tab marker is gone.** Kit v2 and the homepage have no active-tab indicator, so this page follows suit (the old underline on "Why Teacher Wellbeing" was removed to avoid forking the nav). If you want inner pages to mark their current tab, that's a site-wide header change across all six pages — a Dave decision.
- **Two contradictions in the kit docs to reconcile** so the next page isn't ambiguous:
  1. Kit `README` step 7 says add `seams.js` to every page; the swap brief warning #2 says do **not**. We followed the brief (no `seams.js`; links at `#`; bake at deploy).
  2. Kit `README` prose says drop the footer "© 2026" line; the shipped `footer.html`, the kit CSS, and the homepage all keep **both** bottom lines. We kept both.
- **`min-width:0` still live elsewhere.** Applied here, but per the earlier deploy notes it was still unfixed on the homepage `index.html` and the other inner pages — apply the one-line `.news input{min-width:0}` there too.
- **`stories.html` → "Our Impact."** That page became "Our Impact"; it needs renaming/redirecting so `data-page="our-impact"` has somewhere to point.

## 6. Deploy

- **Repo (`Contentment-Website-2026`):** use the de-inlined **`why-wellbeing.html` + the `assets/` folder** from the bundle; drop at repo root, replacing the existing page. If the repo already carries shared copies of any of these images, dedupe as you see fit. (The self-contained form also drops in standalone if you'd rather keep images inlined.)
- **Netlify Drop (preview):** use **`why-wellbeing.self-contained.html`** (rename to `index.html`), or the single-file `why-wellbeing-netlify-drop.zip` — `index.html` at the zip root, no nested folder. Standalone preview only: the six nav tabs point at `#` until wired (section 3), so they won't navigate.

## 7. Notes for the next Claude

- Two equivalent forms exist (de-inlined `why-wellbeing.html` + `assets/`, and `why-wellbeing.self-contained.html`). Treat the de-inlined one as the canonical repo copy; if you edit one, mirror the change to the other so they don't drift. No build step either way.
- A few asset filenames are generic (`image.jpg`, `image-2.jpg`, `image-3.jpg`) where the source markup had no alt/aria-label to name them from. Rename freely — just update the matching `src`/`url()` in `why-wellbeing.html`.
- **Verify with `getComputedStyle()` / `getBoundingClientRect()`, not just screenshots.** Headless screenshots render blank in this sandbox, especially for `.anim` elements (they start `opacity:0` until the `IntersectionObserver` adds `.in`; programmatic scroll doesn't reliably fire it). Force `.in` on `.anim` before screenshotting if you need a visual.
- Palette lives in `:root`. This page keeps its own desaturated `--ob1/2/3` orbit values — the kit's `:root` differs there, so don't blindly overwrite them.
- Header/footer are **site-wide furniture**. Don't fork nav/footer per page; site-wide changes go back to Dave.
