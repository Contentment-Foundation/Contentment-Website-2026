---
project: Contentment Foundation website rebuild
audience: tech team, and any fresh Claude session the tech team spins up
version: 2026-07-28
status: design build in progress. NOTHING below is wired. Every seam is still on "#".
---

# TECH HANDOFF — contentment.org rebuild

**Drop this file into a new chat and start. It is self-contained: you do not need the design
vault, the design history, or any prior session to do the work described here.**

---

## Read this first, it will save you a bad afternoon

**This is a design build that is not finished.** The pages are static HTML produced by the design
track. Your job is the wiring: destinations, embeds, hosting. It is *not* to restyle anything.

**Three rules that are not negotiable:**

1. **The header and footer are site-wide furniture, not per-page design.** They live in
   `header-footer-kit-v2.zip`. If a change is needed, it changes in the kit and propagates to all
   six pages. **Never fix the nav or footer on one page.** If you find yourself editing a header
   on a single page, stop and raise it with Dave (CCO).
2. **Do not touch copy.** Not the compliance line, not headings, not CTAs, not alt text. Several
   strings are verbatim-locked, including quotes attributed to real named people. If copy looks
   wrong, flag it, don't correct it.
3. **Do not change colours.** Several values look like accessibility bugs and have been raised,
   measured, and deliberately closed by the CCO. See "Things that look like bugs and aren't."

**If you are a Claude session:** ask before building. Show renders, not descriptions. Measure
rather than assert. Do not invent a URL, an ID, an email address, or a person's job title. If a
destination is unknown, leave the seam on `#` and list it.

---

## What exists right now

Six static pages. Each was built in a separate chat, so they are not identical under the hood.

| page | file | header/footer state |
|---|---|---|
| Homepage | `index.html` | **kit v2 (current)** |
| About | `about.html` | kit v1 (2026-07-23), needs v2 |
| Why Teacher Wellbeing | — | kit v1, needs v2 |
| Our Impact (was "Stories") | — | **old pre-v1 nav**, needs v2 |
| For Schools | — | kit v1, needs v2 |
| Events | — | **old pre-v1 nav**, needs v2 |
| Get Involved | — | **old pre-v1 nav**, needs v2 |

At time of writing only the homepage has been rebuilt to kit v2. The other five are being
propagated in parallel chats. **Confirm the state of a page by grepping it, not by trusting this
table**, which will go stale.

- Repo: `https://github.com/Contentment-Foundation/Contentment-Website-2026`
- Current preview: `https://comfy-brigadeiros-00c4b6.netlify.app/` — **Netlify Drop, temporary,
  will expire.** Replacing this with real hosting is a tech-team decision that has not been made.
- Netlify Drop requires `index.html` at the **ZIP root**, not nested in a folder.

---

## ⭐ START HERE: `assets/seams.js` — you edit ONE file, not six pages

**Do not hand-edit hrefs in the page HTML.** The design track rebuilds these pages regularly, and
anything wired into the markup gets silently wiped on the next rebuild. That failure is quiet and
it bites late.

Instead, every destination on every page resolves at load from a single config file,
`assets/seams.js`. Fill in the CONFIG block at the top. Do not edit below it.

```js
window.SEAMS = {
  page:   { 'about':'about.html', 'why-wellbeing':'', 'our-impact':'', ... },
  donate: '',
  join:   '',
  link:   { 'school-platform':'', 'linkedin':'', 'instagram':'https://...', ... },
  embed:  { 'keela-homeroom':'' },
  options:{ warn:true, external:true }
};
```

**Behaviour worth knowing:**

- **Empty means "not wired yet."** The resolver leaves that seam exactly as the markup had it.
  It never blanks something out.
- **Unresolved seams report themselves** in one grouped console warning, e.g.
  `[SEAMS] 2 unresolved on this page: link:facebook, link:youtube`. Nothing fails silently.
  Set `options.warn = false` for production.
- **Off-site URLs automatically get `target="_blank" rel="noopener"`.** Same-origin ones don't.
- **`join` falls back to the `get-involved` page route** if left empty, so the button is never
  dead once that route is filled.
- **`embed` values are HTML strings** that replace the container's contents, e.g.
  `'keela-homeroom': '<iframe src="https://..." title="Donate"></iframe>'`.
- Include it on every page: copy into that page's `assets/` and add
  `<script src="assets/seams.js"></script>` just before `</body>`.

**⚠️ SEO caveat, decide before public launch.** Links resolve in JavaScript, and crawlers handle
that inconsistently. `window.SEAMS.resolve()` is exposed so a deploy step can run it headless and
bake the real hrefs into the HTML. **Treat `seams.js` as the dev-time layer and the baked output
as what ships publicly.** If you'd rather not add a build step, bake the hrefs manually at launch
and keep `seams.js` as the record of what they are.

---

## THE SEAM LIST — what needs filling in

Every one of these is currently `href="#"` or a placeholder image. Extracted from the shipped
`index.html` on 2026-07-28, not from memory. **Fill these into `seams.js`, not into the HTML.**

### Page routing — `data-page`

| attribute | appears | current href | needs |
|---|---|---|---|
| `data-page="about"` | nav + footer | **`about.html`** ✅ | already wired, see warning below |
| `data-page="why-wellbeing"` | nav + footer | `#` | page URL |
| `data-page="our-impact"` | nav + footer | `#` | page URL |
| `data-page="for-schools"` | nav + footer + an inline "Learn more about how we work with schools" CTA | `#` | page URL |
| `data-page="events"` | nav + footer | `#` | page URL |
| `data-page="get-involved"` | nav + footer + the "Support a teacher monthly" button | `#` | page URL |

> ⚠️ **`about.html` is already live in the homepage nav.** If the homepage deploys **without**
> `about.html` in the same deploy, that link is a 404. Either ship both together or revert that one
> href to `#`.

> ⚠️ **`our-impact` used to be called `stories`.** The seam was renamed when "Our Impact" replaced
> "Stories" in the nav. **If anything on your side is already wired to `stories`, rename it.** Also
> note the footer's "Our Impact" now points at the *page*, whereas it historically pointed at
> `#impact`, a homepage anchor for the stats band. Those are different destinations. The page is
> correct.

> ⚠️ **On every inner page**, any `#impact` anchor must become `index.html#impact` or it dies.
> Likewise the brand logo href is `#top` on the homepage and must be `index.html` everywhere else.

### Donation — `data-donate`

Appears **twice**: the nav Donate pill and the footer Donate link. Both `#`. Needs the Keela
donate URL.

### The Keela embed — `data-embed="keela-homeroom"`

`<div class="hr-widget" data-embed="keela-homeroom">` currently contains a **placeholder PNG**,
`assets/keela_widget.png`, with alt text "Choose your donation amount and frequency". Replace the
whole thing with the real Keela embed.

Two things about this:

- **Tiers are $25 / $50 / $100 / Other.** The old $5/month tier is dead and has been removed from
  the homepage. If you find `$5` anywhere on an inner page, it is stale. Flag it, don't silently
  change the number.
- **Keela's own Donate button colour has to be set inside the Keela dashboard.** It is inside the
  embed and unreachable from our CSS. It should be `#0090bd`. **Measured from the supplied widget
  PNG: it is still `#507b91`, the Keela default. This has not been done.**

### Join flow — `data-join`

One instance, on the "Support a teacher monthly" button (which also carries
`data-page="get-involved"`). Needs the Homeroom/Keela join destination. **The choreography of this
flow is undecided** — whether it routes to the Get Involved page, opens the Keela widget in place,
or goes straight to Keela. That is a product decision, not a wiring one. Get Involved and Events
are both blocked on it.

### Sign In — `data-link="school-platform"`

One instance in the nav. Needs the school platform / Homeroom login URL.

### Social — `data-link`

| | status |
|---|---|
| `instagram` | **LIVE** — `https://www.instagram.com/contentmentorg/`, footer + an inline follow CTA |
| `linkedin` | `#` |
| `facebook` | `#` |
| `youtube` | `#` |

### Other placeholders

- **Annual Report PDFs (2019–2024)** are linked from the Our Impact page and need hosting + URLs.
- A few **team portraits** on the About page are still placeholders: Yeshi Wangchuk, Evelyn Bilha
  Wanjiru, Ginger Lee Charles, Matt Melnick.
- **The About page name manifest has not had its final line-by-line verification.** 24 named
  people. **Do not deploy About publicly until Dave has signed that off.**
- `mailto:hello@contentment.org` in the footer Connect column is real. Leave it.

---

## The header/footer kit

`header-footer-kit-v2.zip` — version 2026-07-28. Contents: `header.html`, `footer.html`,
`header-footer.css`, `header-footer.js`, `header-footer.json` (same content, machine-readable, for
you), `assets/logo_lockup_light.svg`, `assets/logo_lockup_dark.svg`, `assets/cf_ball.png`
(retired from header and footer, kept in case a page uses the bare mark elsewhere), and a README.

**Nav is six flat tabs, no dropdown:** About · Why Teacher Wellbeing · Our Impact · Schools ·
Events · Get Involved. Plus Sign In (text link) and Donate (pill).

### ⚠️ There are TWO logo SVGs and they are not interchangeable

- `logo_lockup_light.svg` — white wordmark **plus a white coin behind the mark**. Use on the nav
  **at rest** (over photography) and in the **footer**.
- `logo_lockup_dark.svg` — grey wordmark, **no coin**. Use on the **white scrolled bar** only.

They share an identical viewBox (`-3.1 -3.16 300.3 83.6`) so they stack with `grid-area:1/1` and
cross-fade on scroll with zero geometry shift. **Do not edit one file's viewBox without the other.**

**The coin is load-bearing, not decoration.** The mark's dominant colour is `#0190BE`. The footer
background is `#0090be`. Those differ by **one level in the red channel** and measure **1.000:1**.
44.6% of the mark is that colour, and the mark's internal line-work is transparent, so on the
footer it fills with footer blue too. Without the coin the outer circle and base vanish and it
stops reading as a globe. Coin ratio is **1.08**; do not go below about 1.04, where the keyline
starts breaking up under antialiasing.

**If you ever need the logo on another dark ground, use the light file.** Do not put the plain
lockup on anything blue.

### Applying the kit to a page

1. Paste the font `<link>` tags into `<head>` (in the JSON under `dependencies.fontLinks`).
2. Paste `header-footer.css` into the page's `<style>`. **Merge `:root`, don't duplicate it.**
3. Replace the page's `<header>…</header>` with `header.html`.
4. Replace the page's `<footer>…</footer>` with `footer.html`.
5. Add `header-footer.js` to the page's script block.
6. Copy **both** SVGs into that page's `assets/`.

**Per-page edits you must make:** brand href `#top` → `index.html`; footer "Our Impact" and any
`#impact` anchor → `index.html#impact`; About → `about.html`; check asset path depth if the page
sits in a subfolder.

**Do NOT swap the whole homepage `<style>` into an inner page.** It breaks four things unrelated to
nav and footer: `.hero::after`, `.homeroom-panel`, `.impact`, and the quote-mark elements. Take
only `:root`, the nav family, the footer family, `.news`, and `.btn-primary`.

---

## Known bugs, confirmed and reproducible

### 1. `.news input` needs `min-width:0` — apply on contact
**Symptom:** on a laptop roughly 960px–1280px wide the whole page gets a horizontal scrollbar and
slides sideways.
**Cause:** `.news .row` is a 420px flex box holding two inputs. Flex items default to
`min-width:auto`, so each input refuses to shrink below its intrinsic ~237px. 237×2+12 = **486px of
content in a 420px box.**
**`flex:1` does not fix this.** It sets the flex *basis* to 0 and leaves the min-width floor alone.
**Fix:** one line, `min-width:0` on the `.news input` rule.
**Status:** fixed on Homepage, Why Wellbeing, For Schools. **Still broken on Our Impact, Events,
Get Involved.**

### 2. Video lightbox iframe collapses
`iframe{height:100%}` collapses when the wrapper div (`#lbSlot`) is unsized.
**Fix:** `position:absolute; inset:0; width:100%; height:100%` on the slot div.
**This bug exists on more than one page.**

### 3. Residual 5px horizontal overflow at 1120px (homepage)
Isolated to the `.circles` grid inside `section.band-tight.alone`. Pre-existing, was masked by the
much larger newsletter bug above. Nothing inside it has an unclipped bounding box past the
viewport, so it is grid track/gap arithmetic. **Not fixed** — it was outside the scope of the note
being worked. One line, if someone wants it.

### 4. Nav overflows at 390px
The nav's content box overflows by a small margin at 390px on every page carrying the transplant.
This is **site-wide**, so it does not get fixed on one page. Improved by kit v2 (the lockup is
narrower than the old brand) but not eliminated.

---

## Things that look like bugs and aren't. Do not "fix" these.

- **Footer `#0090be` with white text is 3.66:1.** Under WCAG AA. Raised three-plus times,
  measured, and **closed by the CCO. The blue stays.** Same for the Donate pill at 3.2:1.
- **The footer compliance sentence ends "All rights reserved." and the line beneath it is
  "© 2026 The Contentment Foundation".** The copyright is asserted twice. **This is deliberate and
  was approved off a render.** Leave both.
- **`contentment.org` was removed from the fine print on purpose.** The only correct remaining
  reference in the footer is the `mailto:hello@contentment.org` in the Connect column.
- **The header is 82px at rest and 67px scrolled** as of kit v2, up from 78/62. Driven by wordmark
  legibility. If an inner page offsets content for the fixed header (a `padding-top`, a
  `scroll-margin-top`, a hero doing `100svh` minus a hardcoded number), **it will be 4px out** and
  that offset is what needs adjusting, not the header.
- **Varela Round is no longer used by the header or footer.** It is still in the locked type
  system and may be used elsewhere on a page. **Grep before removing the font link.**
- **Em-dashes appear in the homepage's own CSS comments.** Harmless, they don't render. The
  em-dash ban is a **copy** rule. Scope any automated check to rendered text.

---

## Verification, because screenshots lie here

- **Playwright/headless screenshots have rendered blank in some sandboxes.** A blank screenshot is
  **not** evidence the page is broken. Verify with computed styles and geometry instead:
  `getComputedStyle(el)[prop]` and `getBoundingClientRect()`.
- **Check horizontal overflow** with `document.documentElement.scrollWidth - clientWidth` at
  **1280px and 360px minimum**. Anything above 0 needs explaining.
- **Netlify's Linux filesystem is case-sensitive, macOS is not.** Check the case of every asset
  reference before deploying or you will get 404s that worked locally.
- **Check your metric measures what you think it measures.** Real example from this build: a
  colour-isolation check reported 31% failure because the tolerance was ±8 per channel and the two
  colours being distinguished differ by 1. Re-run at exact match, the real answer was 0.

---

## Who owns what

| | role | note |
|---|---|---|
| **Dave** | CCO | arbitrates everything, can override with documentation |
| **Nav** | CEO | |
| **KB** | project manager / evidence | **takes precedence over V** on structure |
| **V** (Veronica Zhen) | graphic designer | owns colour and type |
| **WJ** (Woei Jing) | | owns copy and CTAs. **Her copy is not edited without her input.** |

**Route questions accordingly.** A colour question is not a tech decision. A copy question is not a
tech decision. A destination URL is.

---

## Open decisions blocking tech work

1. **Real hosting.** The Netlify Drop preview is temporary and will expire.
2. **The join-flow choreography** for `data-join`. Get Involved and Events are both blocked on it.
3. **Keela dashboard button colour** — `#0090bd`, currently still the `#507b91` default.
4. **Annual Report PDF hosting** and the six URLs.
5. **Photo usage rights** need confirming before anything goes fully public.
6. **Whether `about.html` deploys alongside the homepage** (see the 404 warning above).

---

## If you are a fresh Claude session

You have everything you need in this file for the wiring work. You do **not** have, and should not
guess at: the design rationale, the review history, the copy decisions, or the reasons behind
specific colours. If a task requires any of those, say so and ask Dave rather than inferring.

**Do not deploy anything.** Produce the changed files and hand them back. Deploys are gated on
design lock, and the About page is additionally gated on Dave's name-by-name verification.
