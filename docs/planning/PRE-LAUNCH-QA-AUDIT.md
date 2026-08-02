# Pre-Launch QA Audit — FEAT-100

**Date:** 2 Aug 2026
**Scope:** All 7 Phase 1 pages (`/`, `/why`, `/our-impact`, `/schools`, `/events`, `/give`, `/about`) plus `/updates` (lower priority).
**Bar:** Lighthouse ≥ 85 in every category; no Critical or Serious accessibility violations.
**Verdict:** **0 of 8 pages currently clear the bar.** The causes cluster tightly — two shared-chrome fixes and one image/font pass would move most pages over the line.

---

## 1. Tooling actually used

| What | Tool | How |
|---|---|---|
| Accessibility scan | **axe-core 4.12.1** (real, not manual) | Injected via `page.addScriptTag()` into Playwright 1.47 Chromium; `axe.run()` with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice` |
| Lighthouse | **Lighthouse 13.4.1** (real programmatic runs) | `lighthouse` node API + `chrome-launcher`, headless Chrome, desktop and mobile presets |
| Keyboard / ARIA behaviour | Playwright scripted interaction | Real `Tab` / `Enter` / `Space` / `Escape` key presses, `document.activeElement` tracked at each stop |
| Reduced motion | Playwright `reducedMotion: 'reduce'` context | Compared computed styles + `document.getAnimations()` against a `no-preference` control |
| Console / network | Playwright `console`, `pageerror`, `requestfailed`, `response` listeners | All 8 routes × 2 viewports |

Target under test: `npm run build` → `npm run preview` on `http://localhost:4399` (production build, not dev server). `lighthouse` and `axe-core` were installed into a scratchpad directory — **`package.json` was not modified**.

### Caveats — read these before quoting numbers

1. **Localhost, not Vercel.** No CDN, no Brotli, no HTTP/2 prioritisation. Real production byte-delivery will be better; the *relative* ordering of pages and the LCP/asset problems will not change. Treat absolute Performance scores as indicative, not final.
2. **Single run per page/form-factor.** No median-of-5. Lighthouse performance scores carry roughly ±3–5 points of run-to-run variance. Scores within ~5 of 85 (`/` desktop at 88, `/give` desktop at 91) should be re-measured before anyone claims a pass.
3. **`llms-txt` fails on all 16 runs.** This is a new Lighthouse 13 audit for an unrelated emerging convention. Not a launch blocker — ignore it.
4. **`/schools` has an un-scannable region.** axe reported `frame-tested` (critical) because the Google Forms iframe (`schools.astro:364`) is cross-origin. **The accessibility of the embedded form could not be measured at all.** It is third-party markup we do not control.
5. **Contrast over images/gradients is unverified.** axe returned 18–60 `incomplete` contrast nodes per page — cases where text sits on a photo or gradient and no static ratio is computable. I did not manually sample every one. A designer pass over text-on-image is still owed.
6. **Screen-reader testing was not performed.** No VoiceOver/NVDA pass. ACCESSIBILITY.md §5 requires one before launch; this audit does not discharge it.
7. Findings already documented as intentional (HC-075 dead CTAs, FEAT-070 newsletter placeholder, D-24 events email slots, RF-009 static ripple) are **excluded** and were confirmed as expected behaviour, not re-reported.

---

## 2. Summary tables

### 2a. axe-core violations (distinct rules failed, axe's own impact rating)

| Page | Desktop C/S/Mo/Mi | Mobile C/S/Mo/Mi | Distinct rules failed |
|---|---|---|---|
| `/` | 0 / 1 / 2 / 0 | 0 / 1 / 2 / 0 | color-contrast, heading-order, region |
| `/why` | 0 / 0 / 2 / 0 | 0 / 0 / 2 / 0 | heading-order, region |
| `/our-impact` | 0 / 1 / 3 / 1 | 0 / 1 / 3 / 1 | color-contrast, heading-order, region, landmark-one-main, image-redundant-alt |
| `/schools` | 0 / 1 / 2 / 1 | 0 / 1 / 2 / 1 | color-contrast, heading-order, region, empty-table-header |
| `/events` | **2** / 1 / 2 / 0 | **2** / 1 / 2 / 0 | aria-allowed-attr, aria-required-children, color-contrast, region, landmark-one-main |
| `/give` | 0 / 0 / 2 / 0 | 0 / 0 / 2 / 0 | heading-order, region |
| `/about` | 0 / 0 / 1 / 0 | 0 / 0 / 1 / 0 | region |
| `/updates` | 0 / 1 / 3 / 0 | 0 / 0 / 3 / 0 | color-contrast, heading-order, region, landmark-one-main |

`C/S/Mo/Mi` = Critical / Serious / Moderate / Minor. Counts are **distinct rules**, not node instances — `region` alone spans 23–61 nodes per page.

> Note: three findings below (**S-2** skip link, **S-3** lightbox focus management) are **not** in this table. axe cannot detect them — they were found by scripted keyboard testing. Their severity is my judgment, flagged as such.

### 2b. Lighthouse 13.4.1

| Page | Desktop Perf / A11y / BP / SEO | Mobile Perf / A11y / BP / SEO | Desktop LCP | Mobile LCP |
|---|---|---|---|---|
| `/` | 88 / 95 / 100 / 100 | **75** / 91 / 100 / 100 | 2.29 s | 7.74 s |
| `/why` | 96 / 98 / 100 / 100 | **58** / 95 / 100 / 100 | 1.25 s | 9.25 s |
| `/our-impact` | 92 / 93 / 100 / 100 | **75** / 90 / 100 / 100 | 1.92 s | 12.47 s |
| `/schools` | **71** / 94 / **77** / 100 | **56** / 91 / **77** / 100 | 3.57 s | 19.58 s |
| `/events` | 94 / 85 / 100 / 100 | **67** / **81** / 100 / 100 | 1.42 s | 7.09 s |
| `/give` | 91 / 98 / 100 / 100 | **66** / 94 / 100 / 100 | 1.52 s | 6.98 s |
| `/about` | 94 / 100 / 100 / 100 | **75** / 96 / 100 / 100 | 1.59 s | 8.11 s |
| `/updates` | 99 / 91 / 100 / 100 | **71** / 91 / 100 / 100 | 0.98 s | 4.77 s |

**Bold = below 85.** TBT was 0 ms and CLS ≤ 0.012 on every run — the site is not JS-bound and does not visibly shift. **Every mobile Performance score fails**; the problem is image weight and render-blocking fonts, not scripting.

### 2c. Console / network

Clean. **Zero JS errors, zero failed requests, zero 404s across all 16 page loads.** One benign warning on `/schools` only:

```
Failed to execute 'postMessage' on 'DOMWindow': the target origin provided
('http://localhost:4399') does not match the recipient window's origin
('https://docs.google.com').
```

Emitted by the embedded Google Form, localhost-only. Not a defect.

---

## 3. Findings by severity

### CRITICAL

#### C-1 — `/events` filter chips declare an ARIA pattern they don't implement
**File:** `src/pages/events.astro:106–111`
**axe:** `aria-allowed-attr` + `aria-required-children` (both critical) · **WCAG 4.1.2 Name, Role, Value (A)**, 1.3.1

```html
<div class="ev-filters" role="tablist" aria-label="Filter events">
  <button class="ev-filter is-active" data-filter="all" aria-selected="true">All</button>
```

The container claims `role="tablist"` but its children are plain `<button>`s, not `role="tab"` — so `aria-selected` is invalid on them, and the tablist has no permitted children. Screen readers get a broken widget: a tab list containing nothing it recognises as a tab.

Confirmed by keyboard test: **ArrowRight does not move focus** between chips, and all five chips carry `tabindex=0` — neither matches the tablist pattern (which requires roving tabindex + arrow navigation). This is also what drags `/events` mobile Lighthouse a11y down to 81.

**Fix (recommended, smaller):** these are filters, not tabs. Drop `role="tablist"` and `aria-selected`; use `aria-pressed="true|false"` on each button as a toggle-button group, and keep `tabindex=0` on all. This matches the ACCESSIBILITY.md §2 guidance for the Story Board filter chips and needs no JS keyboard work.
**Fix (alternative, larger):** commit to the real tab pattern — add `role="tab"`, `role="tabpanel"`, `aria-controls`, roving tabindex, and Left/Right/Home/End handlers.

---

### SERIOUS

#### S-1 — No `<main>` landmark on any of the 8 pages
**File:** `src/layouts/BaseLayout.astro:56` (`<slot />` sits bare between `<Nav />` and `<Footer />`)
**axe:** `region` (moderate, 23–61 nodes/page) + `landmark-one-main` (moderate) · **WCAG 1.3.1 Info and Relationships (A)**

Verified in the built output: `grep -c 'role="main"'` and `<main` both return **0 across all 8 `dist/*/index.html` files**. Every page's body content therefore sits outside any landmark, which is why `region` fires on 23–61 elements per page — the single largest violation count in the audit.

I rate this Serious rather than axe's Moderate: it degrades landmark navigation on every page simultaneously, and it is a one-line fix.

**Fix:** wrap the slot — `<main id="main"><slot /></main>`. Single edit, clears `region` and `landmark-one-main` on all 8 pages at once.

#### S-2 — No skip link on any page (not detectable by axe)
**File:** `src/layouts/BaseLayout.astro:54–57`
**WCAG 2.4.1 Bypass Blocks (A)** — see honesty note below

Measured on the homepage: the first 9 tab stops are logo → 6 nav links → Sign In → Donate, before the first content link is reachable. `grep -rniE 'skip.{0,15}(content|main|nav)' src/` returns nothing.

**Honest caveat:** axe's `bypass` rule *passes* on these pages, because a valid heading structure is itself an accepted bypass mechanism under 2.4.1. So this is not an unambiguous WCAG failure. But with S-1 also true, headings are currently the *only* bypass mechanism — there is no skip link and no landmark. Fixing S-1 alone materially improves this; adding a skip link closes it properly.

**Fix:** add a visually-hidden-until-focused skip link as the first focusable element in `<body>`, targeting the `#main` introduced by S-1.

#### S-3 — Video lightboxes have no focus management (not detectable by axe)
**Files:** `src/pages/why.astro:228` · `src/pages/our-impact/index.astro:393` · `src/pages/schools.astro:411`
**WCAG 2.4.3 Focus Order (A)**, 4.1.2 · APG [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

All three lightboxes correctly declare `role="dialog"` / `aria-modal="true"` / `aria-label="Video"` — but the behaviour behind them is missing. Measured on each page:

| Behaviour | `/why` | `/our-impact` | `/schools` |
|---|---|---|---|
| Focus moves into dialog on open | ✗ stays on trigger | ✗ stays on trigger | ✗ stays on trigger |
| Focus trapped while open (8 Tab presses) | ✗ 8/8 escaped | ✗ 8/8 escaped | ✗ 8/8 escaped |
| Escape closes | ✓ | ✓ | **✗ stayed open** |
| Focus returns to trigger on close | ✗ landed on an unrelated chip | ✗ landed on an unrelated button | ✗ landed **inside the YouTube iframe** |

With `aria-modal="true"` set, assistive tech is told the rest of the page is inert while Tab in fact walks straight out into it — the announced and actual states disagree.

**`/schools` is the worst case and I'd treat it as near-Critical:** Escape did not close the lightbox, and focus ended up inside the cross-origin YouTube iframe. A keyboard user who opens that video has no scripted way back out — an effective keyboard trap (**WCAG 2.1.2, Level A**).

**Relationship to known gaps:** ACCESSIBILITY.md §4 documents exactly this defect class (no focus trap, no focus return) — but scoped to `site/story-board.html`, the Phase 1 prototype. These are the **new Astro production pages**, carrying the same defect. Not covered by the accepted list; §4 also states this should be resolved *before* TICKET-100, which is this ticket.

**Fix:** one shared lightbox helper used by all three pages — on open, store the trigger and move focus to the close button; trap Tab/Shift+Tab within `#lb`; on Escape or backdrop click, close and restore focus to the stored trigger. Fix the `/schools` Escape handler as part of it.

#### S-4 — White text on mint `#54bf98` fails AA (2.0–2.26:1)
**Files:** `src/components/OrbitSection.astro:6–8` · `src/pages/give.astro:298` (+ `:294–297`) · also `/our-impact`, `/events`, `/schools`, `/updates`
**axe:** `color-contrast` (serious) · **WCAG 1.4.3 Contrast (Minimum) (AA)**

Measured ratios: `.orbit-title` 2.26:1 (needs 3:1 at that size), `.orbit-sub` 2.0:1, `.orbit-cta` 2.26:1, expanded pillar body 2.1:1 (all need 4.5:1).

**This is already known and half-fixed — that's the actionable part.** The source comments say so outright:

- `src/pages/events.astro:475–476` — *"V: buttons → #54bf98 (mint). White-on-mint measures ~2.1:1 (fails AA); #1d1d1d ink on mint ~8:1, so button text is ink for legibility."*
- `src/pages/give.astro:294–297` — *"Documented: white on #54bf98 is 2.26:1, under AA."*

So `/events` and `/why` already resolved this by switching to ink `#1d1d1d` (~8:1), while `/give`'s benefits band and the homepage orbit kept white. **The remedy is proven and already in the codebase — it just wasn't applied consistently.**

**Fix:** this needs a design decision, not a unilateral dev change (give.astro:295 records it as Dave's call). Recommend applying the existing ink-on-mint treatment site-wide, or darkening the mint token. Either way the two treatments should stop disagreeing.

---

### MODERATE

#### M-1 — Footer skips `<h2>` → `<h4>` on 6 pages
**File:** `src/components/Footer.astro:11, 12, 13` · **axe:** `heading-order` · WCAG 1.3.1
"Explore" / "Get Involved" / "Connect" are `<h4>` following page `<h2>`s. **Fix:** change to `<h3>`; restyle via class, not tag level.

#### M-2 — `/our-impact` report cards skip `<h2>` → `<h4>`
**File:** `src/pages/our-impact/index.astro:369` (under the `<h2>` at `:362`) · **axe:** `heading-order`. **Fix:** `<h3>`.

#### M-3 — Mobile touch targets below 24 × 24 px
**WCAG 2.5.8 Target Size (Minimum) (AA)** · Lighthouse `target-size` failed **8/8 mobile runs**
Measured at 390 px: footer nav links **164 × 18**, homepage door links (`.dlink`) **312 × 23**, Homeroom checkboxes **18 × 18**. **Fix:** raise line-height/padding on footer and `.dlink` anchors to ≥ 24 px tall; enlarge the checkbox hit area.

#### M-4 — Four Pillars accordion: `<div role="button">`, no `aria-controls`
**File:** `src/components/Pillars.astro:8, 12, 16, 20`
**Verified working:** Enter and Space both toggle, and `aria-expanded` updates correctly (`true → false → true`). Credit where due — this is better than most.
**Gaps:** built from `<div role="button" tabindex="0">` rather than native `<button>`; no `aria-controls` linking trigger to panel; all four ship expanded, so the collapsed-panel state is never the initial state. **Fix:** native `<button>` + `aria-controls` pointing at an id'd panel.

#### M-5 — `/events` filter results change with no announcement
**File:** `src/pages/events.astro` (filter handler) · WCAG 4.1.3 Status Messages (AA)
Measured: **zero `aria-live` regions on the page.** Filtering silently swaps the card list — a screen-reader user gets no confirmation anything happened. ACCESSIBILITY.md §2 flags this same pattern for Story Board's `#countLabel`; it recurs here. **Fix:** a polite live region announcing "N events shown". Keep it scoped to the count only (per §3).

#### M-6 — No `width`/`height` on any image, site-wide
**Lighthouse `unsized-images` failed 16/16 runs.** Every image on every page lacks intrinsic dimensions.
CLS is currently excellent (0.000–0.012) — but that is measured over localhost where images arrive almost instantly. On a real mobile connection this is the single largest layout-shift risk. **Fix:** add `width`/`height` (or `aspect-ratio`) to all `<img>`. This also feeds directly into the performance work in §4.

---

### MINOR

#### m-1 — `/our-impact`: 14 images whose alt duplicates adjacent text
`img[alt="Bhutan"]`, `alt="East Africa"`, `alt="Deki Choden"` etc. sit beside captions with the same words — screen readers read them twice. **axe:** `image-redundant-alt`. **Fix:** `alt=""` where the caption already names it, or make alt descriptive of the *image* ("Students in a Bhutanese classroom").

#### m-2 — `/schools`: empty `<th scope="col">`
**File:** `src/pages/schools.astro:264` · **axe:** `empty-table-header`. Corner cell of the comparison matrix. **Fix:** visually-hidden text, e.g. `<th scope="col"><span class="sr-only">Feature</span></th>`.

#### m-3 — No custom focus ring
All interactive elements fall back to the UA default (`outline: auto 1px rgb(0,95,204)`). It **is** visible on all 12 sampled tab stops, so this is not a violation — but a 1 px system blue is thin and off-brand against the teal/deep palette. **Fix (optional):** a token-based `:focus-visible` ring.

---

## 4. Performance detail

**No page is JS-bound** — TBT was 0 ms on all 16 runs. Every performance problem is asset delivery.

| Root cause | Evidence | Affected |
|---|---|---|
| Unsized images | `unsized-images` 16/16 runs | All pages |
| Render-blocking Google Fonts | `render-blocking-insight`, est. 310 ms desktop → **3,940 ms** on `/updates` mobile | All pages — `BaseLayout.astro:49` |
| Oversized image payloads | `image-delivery-insight`: **1,118 KiB** `/our-impact`, **1,307 KiB** `/about` | Most pages |
| Base64-inlined images (known) | 6 `data:image` in `schools.astro`, 10 in `give.astro` | `/schools`, `/give` |
| Total page weight | `/schools` **7,022 KiB** desktop, `/our-impact` 4,422 KiB, `/` 3,994 KiB | `total-byte-weight` failed 8 runs |

**On the known base64 issue:** confirmed as a real contributor, as expected. `/schools` is the heaviest page in the audit (7 MB desktop) and the only page failing desktop Performance (71), with a 19.6 s mobile LCP. Worth noting the inlining is not the whole story — the Google Forms iframe and general image weight contribute too, so removing base64 alone will not lift `/schools` to 85.

**`/schools` Best Practices = 77 (both form factors)** — the only non-perfect BP score. Cause: `third-party-cookies` (3 cookies) plus `inspector-issues`, both from the embedded Google Form at `schools.astro:364`. This is inherent to embedding Google Forms; it is unlikely to be fixable without replacing the embed with a native form (which would also resolve caveat #4, the unscannable iframe).

**Reduced motion is correctly implemented** — verified, not assumed. With `prefers-reduced-motion: reduce`: transition durations drop to `0s`, running animations drop from 9 to **0**, and the orbit section collapses from 3,960 px to 969 px. This is RF-009's intended behaviour working exactly as specified.

---

## 5. Verdict per page

Bar: Lighthouse ≥ 85 in all four categories on both form factors, and no Critical/Serious a11y.

| Page | Verdict | Why |
|---|---|---|
| `/` | **FAIL** | Mobile Perf 75. Serious: S-4 contrast (orbit), S-1, S-2 |
| `/why` | **FAIL** | Mobile Perf 58 (lowest but one). Serious: S-3 lightbox, S-1, S-2 |
| `/our-impact` | **FAIL** | Mobile Perf 75. Serious: S-4 contrast, S-3 lightbox, S-1, S-2 |
| `/schools` | **FAIL** | Desktop Perf 71 · Mobile Perf 56 · BP 77 (both). Serious: S-3 (**Escape doesn't close — near-Critical**), S-4, S-1, S-2 |
| `/events` | **FAIL** (advisory — HC-072) | **2 Critical** ARIA (C-1) · Mobile Perf 67 · Mobile A11y 81. Findings advisory pending Dave's second notes round, but C-1 is a genuine defect regardless of review status |
| `/give` | **FAIL** | Mobile Perf 66. Serious: S-4 contrast (benefits band, `give.astro:298`), S-1, S-2 |
| `/about` | **FAIL** | Mobile Perf 75 only. **Cleanest page in the audit** — desktop A11y 100, a single moderate violation. Fails solely on mobile perf + the two site-wide items |
| `/updates` | **FAIL** | Mobile Perf 71. Serious: S-4 contrast, S-1, S-2 |

**Reading this fairly:** 8/8 FAIL overstates the distance to launch. Every page fails on S-1/S-2 (one shared file) and on mobile performance (one asset pass). Only `/events` has a page-specific Critical, and only `/schools` has a page-specific structural problem. `/about` is essentially there.

---

## 6. Fix these first

1. **`/events` filter chips (C-1)** — `events.astro:106–111`. Only Critical in the audit. Drop `role="tablist"` + `aria-selected`, use `aria-pressed`. Small, self-contained; also lifts `/events` mobile A11y off 81.
2. **`<main>` + skip link (S-1, S-2)** — `BaseLayout.astro:54–57`. Two lines in one shared file clears the highest-volume violation (`region`, 23–61 nodes/page) plus `landmark-one-main` across **all 8 pages**. Best effort-to-impact ratio here.
3. **Lightbox focus management (S-3)** — `why.astro:228`, `our-impact/index.astro:393`, `schools.astro:411`. One shared helper for all three. **Start with `/schools`**, where Escape doesn't close and focus lands in the YouTube iframe — that's a keyboard trap, the most severe user-facing defect found. ACCESSIBILITY.md §3 already calls this "the highest-value accessibility fix available".
4. **Mobile performance pass (M-6 + §4)** — all 8 pages fail. Highest leverage, in order: add `width`/`height` to every `<img>`; make the Google Fonts link non-render-blocking (`BaseLayout.astro:49`, up to 3.9 s); compress/resize the heavy images (~1.1–1.3 MB recoverable on `/our-impact` and `/about`); then de-base64 `/schools` and `/give`.
5. **Resolve the mint contrast inconsistency (S-4)** — needs a design call, so start the conversation early rather than late. The ink-on-mint fix is already proven in `events.astro:477`; it just needs applying to the orbit section and `/give`'s benefits band, or the mint token needs darkening.

**Still owed before launch, not covered by this audit:** a screen-reader pass (VoiceOver/NVDA), a manual review of text-over-image contrast (18–60 unresolved nodes per page), and an accessibility check of the embedded Google Form — none of which can be automated from here.
