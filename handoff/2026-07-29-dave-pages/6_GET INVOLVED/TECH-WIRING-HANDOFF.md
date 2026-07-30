# Get Involved — Tech Wiring Handoff

**For:** the Contentment tech team (and the Claude session helping them wire it).
**Date:** 2026-07-28
**Page:** `get-involved.html` — the Homeroom / monthly-giving page.
**State:** Design-locked. Header/footer on shared kit v2. **Nothing is wired.** Every destination is a placeholder waiting for you.

If you are a Claude session reading this: this file is your full context. You do not need the design history. Your job is to help wire the seams below without touching the markup or styling. Read the "Rules of the road" section before editing anything.

---

## 1. What you were handed

`get-involved-project-2026-07-28.zip` unzips to:

```
get-involved.html          the page. Photos are base64-embedded (design's).
                           Logo lockups + seams.js load from assets/.
assets/
  logo_lockup_light.svg    white wordmark + white coin — nav at rest AND footer
  logo_lockup_dark.svg     grey wordmark, no coin — nav on the white scrolled bar
  seams.js                 THE file you edit. Config + resolver. See §3.
  cf_ball.png              retired from header/footer; kept in case a page uses the bare mark
README-deploy.txt          short version of this file
```

There is also a **self-contained single-file** build (`get-involved.html`, ~859KB, SVGs inlined, no `assets/` needed) used for Netlify Drop previews. Do not wire against that one — it is for quick visual previews. Wire the **project-tree** copy, where `assets/` ships alongside.

---

## 2. The one thing to understand first: seams

Every link on this page is intentionally a placeholder. The markup carries `data-*` attributes; the real URLs live in **one file**, `assets/seams.js`. You fill in that file and the resolver rewrites the `href`s at load.

**Why it is built this way:** the design track rebuilds this page's HTML regularly. If the URLs lived in the HTML, every rebuild would silently wipe your wiring. With seams.js, design owns the markup, you own one config file, and neither overwrites the other. A URL also changes in one place instead of six pages.

`seams.js` is **in the `assets/` folder but NOT yet referenced by the page.** That was deliberate on design's side — they don't wire. Turning it on is step one below.

---

## 3. How to wire (seams.js)

### Step 1 — reference the script

Add this line just before `</body>` in `get-involved.html`:

```html
<script src="assets/seams.js"></script>
```

Load it and open the console. You will see one grouped warning listing every unresolved seam. That list is your to-do.

### Step 2 — fill in the CONFIG block

Open `assets/seams.js`. Only the top `window.SEAMS = { ... }` block is yours. **Do not edit below the "RESOLVER — do not edit below this line" marker.** Leave anything you don't know yet as `''` (empty string); the resolver leaves that seam alone and keeps reporting it, so nothing fails silently.

```js
window.SEAMS = {
  page: {
    'about':          'about.html',   // already done
    'why-wellbeing':  '',
    'our-impact':     '',   // NOTE: renamed from 'stories' — see §5
    'for-schools':    '',
    'events':         '',
    'get-involved':   ''
  },
  donate: '',                          // Keela donate URL (nav pill + footer)
  join:   '',                          // Homeroom join flow; falls back to get-involved route if empty
  link: {
    'school-platform': '',             // Sign In
    'linkedin':        '',
    'instagram':       'https://www.instagram.com/contentmentorg/',  // live
    'facebook':        '',
    'youtube':         ''
  },
  embed: {
    'keela-homeroom':  ''              // HTML string that REPLACES the container's contents
  },
  options: { warn: true, external: true }
};
```

### Step 3 — bake for production (important for SEO)

The resolver rewrites `href`s in JavaScript, which crawlers handle inconsistently. `window.SEAMS.resolve()` is exposed so a deploy step can run it headless and bake the real `href`s into the HTML before shipping. **Treat seams.js as the dev-time layer and the baked output as what ships publicly.** Turn `options.warn` off in production.

---

## 4. Every seam on this page (all currently `#`)

| Seam | Where | Wire to |
|---|---|---|
| `data-page="why-wellbeing"` | nav + footer | Why Teacher Wellbeing page |
| `data-page="our-impact"` | nav + footer | Our Impact page — **see §5** |
| `data-page="for-schools"` | nav + footer | Schools page |
| `data-page="events"` | nav + footer | Events page |
| `data-page="get-involved"` | nav + footer | this page |
| `data-page="about"` | nav + footer | ✅ already `about.html` |
| `data-donate` (×2) | nav pill + footer | Keela donate URL |
| `data-join="homeroom"` | hero button + Join Homeroom button | Keela/Homeroom join flow (owner: Somesh) |
| `data-join="one-time"` | Prefer to give differently | one-time gift flow |
| `data-join="ways-to-give"` | Prefer to give differently | other Keela options (owner: Lorna — destination still an open question) |
| `data-embed="impact-video"` | What is Homeroom section | portrait 9:16 video. Member recording was pending; drop a YouTube/Vimeo iframe straight into the slot |
| `data-link="school-platform"` | Sign In | sign-in / school platform URL |
| `data-link="linkedin"` | footer | LinkedIn URL |
| `data-link="facebook"` | footer | Facebook URL |
| `data-link="youtube"` | footer | YouTube URL |
| `data-link="instagram"` | footer | ✅ live: `https://www.instagram.com/contentmentorg/` |

---

## 5. Open question you have to resolve: `our-impact` vs `stories`

The "Our Impact" tab uses `data-page="our-impact"`. It was previously `data-page="stories"`, and the page it points to used to be called Stories. Design promoted it to Our Impact.

**If you have already wired a `stories` route anywhere,** either rename that route to `our-impact`, or change this page's seam back to `stories`. It is a one-word change on one side. Pick whichever matches the rest of your routing. `seams.js` carries this same note inline.

---

## 6. Rules of the road (for the Claude session helping wire this)

- **Do not touch the markup or CSS.** Wiring happens entirely in `assets/seams.js`. If a URL needs to change, it changes there, not in the HTML.
- **Do not edit `seams.js` below the resolver marker.** Only the CONFIG block.
- **Leave unknown seams as `''`.** The resolver reports them; that is the intended workflow, not an error to suppress.
- **The header and footer are site-wide furniture.** They are identical across all six pages and were measured once. If something about the nav or footer looks wrong, do not fix it here — that forks the site. Flag it for Dave.
- **The page's photos are base64-embedded on purpose.** That is design's call, not something to "optimize" into an assets folder. Only the shared kit assets (logos, seams.js) live in `assets/`.

---

## 7. Things that look like bugs and are not — do not "fix" these

- **Footer `#0090be` with white text is 3.66:1**, under WCAG AA. The Donate pill is 3.2:1. Raised repeatedly, measured, **closed by Dave. The blue stays.**
- **The footer asserts copyright twice** — the compliance sentence ends "All rights reserved." and the line beneath is "© 2026 The Contentment Foundation." **Deliberate, approved off a render. Leave both lines.**
- **`contentment.org` was removed from the footer fine print on purpose.** The only correct remaining reference is `mailto:hello@contentment.org` in the Connect column.
- **One banned word ("monthly donors") survives** in the Join Homeroom copy. Kept on Dave's instruction. This is WJ's copy; leave it.
- **`Friends from all over the world`** in the Community card is final copy (it replaced a `__COUNTRIES__` placeholder). Not a leftover.

---

## 8. Still with the design team (not your problem, but context)

- WJ owes: confirmation on two dropped benefit lines (the "99% complimentary" gatherings line and the retreat member discount), and the Jose member video.
- V owns the colour/contrast decisions on this page; several are below AA and shipped as her spec, with Dave's ruling to let the team decide.
- Priscillah's quote band has no headshot yet — WJ is replacing that quote, so it was left alone.

None of the above blocks wiring. The only true blocker to a **public** launch was the `__COUNTRIES__` placeholder, and that is now resolved.

---

## 9. One cross-site flag worth your attention

The shared header/footer CSS (transplanted from the homepage) contains a stray doubled `}}` at the end of a `.voice` `@media(max-width:760px)` block. The extra brace kills the rule immediately after it. On this page that rule was the giving-tier grid; it was fixed here. **The same brace is very likely sitting on the other five pages, silently killing whatever rule follows it there.** Worth a `grep "}}"` across the site before you wire the rest. This is a CSS bug, not a wiring bug, but you will be touching every page and are best placed to catch it.

---

## 10. Verify before you ship

Measure, don't eyeball (headless screenshots render blank in some sandboxes):

- After filling seams.js, reload and confirm the console warning count drops to only the seams you intentionally left empty.
- `document.querySelectorAll('[href="#"]')` should return only genuinely-unwired seams, nothing you meant to fill.
- Baked build: confirm real `href`s are present in the shipped HTML, not just resolved at runtime.
- Footer background still computes `rgb(0, 144, 190)`.
- No horizontal overflow at 1280px and 360px (`scrollWidth - clientWidth`).
- Both logo SVGs load (no 404s in the network panel).
