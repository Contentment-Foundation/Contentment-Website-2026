---
task: swap this page onto the shared header + footer kit v2
version: 2026-07-28
scope: header and footer ONLY. Nothing else on the page changes.
---

# HEADER + FOOTER SWAP — drop-in brief

You have been given three things:

1. **`header-footer-kit-v2.zip`** — the source of truth. Everything you need is in it.
2. **`index.html`** — the homepage, as a **reference only**. See the warning below.
3. **This file.**

Your job is to put this page onto the shared header and footer. **That is the entire task.**
Do not restyle anything else, do not touch copy, do not change colours.

---

## ⚠️ Read these four warnings before you start

### 1. `index.html` is a reference, NOT a source to copy from
Look at it to check your result matches. **Do not lift its `<style>` block.** A wholesale style
swap breaks four things that have nothing to do with nav or footer:

- `.hero::after` — picks up a mint gradient meant for the homepage's *next* section
- `.homeroom-panel` — the homepage's went light; inner pages are blue, and it references a
  texture this page does not have
- `.impact` — missing texture
- `.quote-card .qmark` / `.voice .qmark` — expect an `<img>`; inner pages have a text `"`

**Take the CSS from `header-footer.css` in the kit.** From `index.html`, take nothing.

### 2. Ignore the `seams.js` script tag
`index.html` has `<script src="assets/seams.js"></script>` just before `</body>`. **That file is
not part of this task and does not exist for this page.** Do not copy that line. If you do, this
page throws a 404 in the console.

### 3. The header and footer are site-wide furniture, not this page's design
They were fought out and measured once, and they are identical across all six pages. **If
something about the nav or footer looks wrong, do not fix it here.** A nav change is a site-wide
change and goes back to Dave. Fixing it on one page forks the site, which has already happened
once and cost a session to unpick.

This includes review notes. If a note on this page asks for a nav or footer change, flag it, do
not apply it.

### 4. The header got taller. Check whether this page cares.
**78px → 82px at rest, 62px → 67px scrolled.** If anything on this page offsets for the fixed
header — a `padding-top` on the first section, a `scroll-margin-top` on anchors, a hero doing
`100svh` minus a hardcoded number — **it is now 4px out.** Adjust the offset. Do not shrink the
header back.

---

## The swap

1. Paste the font `<link>` tags into `<head>` (they're in `header-footer.json` under
   `dependencies.fontLinks`).
2. Paste `header-footer.css` into this page's `<style>`. **Merge `:root`, do not duplicate it.**
   The kit's `:root` is purely additive.
3. Replace this page's `<header>…</header>` with `header.html`.
4. Replace this page's `<footer>…</footer>` with `footer.html`.
5. Add `header-footer.js` to this page's script block.
6. Copy **both** SVGs into this page's `assets/`:
   `logo_lockup_light.svg` and `logo_lockup_dark.svg`.

### Then make these per-page edits. All six are required.

| # | edit | why |
|---|---|---|
| 1 | Brand logo href `#top` → **`index.html`** | `#top` scrolls to top on the homepage. On an inner page it must go home. |
| 2 | Footer "Our Impact" → the Our Impact page, and any `#impact` anchor → **`index.html#impact`** | `#impact` is a homepage anchor. On an inner page it dies. |
| 3 | About tab → **`about.html`** | that page exists now |
| 4 | Add **`min-width:0`** to the `.news input` rule | see below |
| 5 | If this page still has the old About dropdown, **delete the dead `.drop` / `.drop-menu` / `.chev` CSS** | otherwise you're carrying dropdown styling for a dropdown that no longer exists |
| 6 | Check the header offset (warning 4 above) | |

---

## Two logo files, and they are not interchangeable

- **`logo_lockup_light.svg`** — white wordmark **plus a white coin behind the mark**.
  Used on the nav **at rest** (over photography) and in the **footer**.
- **`logo_lockup_dark.svg`** — grey wordmark, **no coin**. Used on the **white scrolled bar** only.

They share an identical viewBox so they stack with `grid-area:1/1` and cross-fade with zero
geometry shift. **Do not edit one file's viewBox without the other.** The kit CSS already wires
this up; you should not have to touch it.

**The coin is load-bearing, not decoration.** The mark's dominant colour is `#0190BE`, the footer
is `#0090be`, and those measure **1.000:1**. Without the coin, 44.6% of the mark disappears into
the footer. If you ever need the logo on another dark ground on this page, **use the light file.**

---

## `min-width:0` on `.news input` — a confirmed bug, not a preference

**Symptom:** between roughly 960px and 1280px wide the whole page gets a horizontal scrollbar and
slides sideways.

**Cause:** `.news .row` is a 420px flex box holding two inputs. Flex items default to
`min-width:auto`, so each input refuses to shrink below its intrinsic ~237px.
**237×2+12 = 486px of content in a 420px box.**

**`flex:1` does not fix this.** It sets the flex *basis* to 0 and leaves the min-width floor alone.

**Fix:** one line. `min-width:0` on the `.news input` rule. Measured on the homepage: 102px of
sideways scroll at 1120px, down to 5px.

If this page has no newsletter section, add it anyway as insurance.

---

## Verify before you hand back

Do not assert these, measure them.

- **Nav content measures ~601px in a 1240px box.** If you get ~968px, you still have the old
  seven-tab dropdown nav and the swap did not take.
- **Six tabs, in this order:** About · Why Teacher Wellbeing · Our Impact · Schools · Events ·
  Get Involved. Plus Sign In as a text link and Donate as a pill.
- **Horizontal overflow** — `document.documentElement.scrollWidth - clientWidth` at **1280px and
  360px**. Report anything above 0 rather than silently leaving it.
- **Both SVGs load** and report an identical natural size. No 404s, no console errors.
- **Cross-fade:** at rest light=1 / dark=0, scrolled light=0 / dark=1.
- **Footer background** computes `rgb(0, 144, 190)`.
- **Nothing else on the page moved.** Compare against the page before your edit.

**A blank headless screenshot is not evidence the page is broken.** Screenshots have rendered
blank in this sandbox before. Verify with `getComputedStyle()` and `getBoundingClientRect()`.

---

## Things that look like bugs and are not. Do not "fix" these.

- **Footer `#0090be` with white text is 3.66:1**, under WCAG AA. Raised three-plus times,
  measured, **closed by Dave. The blue stays.** Same for the Donate pill at 3.2:1.
- **The footer compliance sentence ends "All rights reserved." and the line beneath it is
  "© 2026 The Contentment Foundation".** The copyright is asserted twice. **Deliberate, approved
  off a render.** Leave both lines.
- **`contentment.org` was removed from the fine print on purpose.** The only correct remaining
  reference is `mailto:hello@contentment.org` in the footer's Connect column.
- **Varela Round is no longer used by the header or footer.** It may still be used elsewhere on
  this page. **Grep before removing the font link.**
- **Every nav and footer destination is still `#`.** That is the tech team's job, not yours.
  Leave them.

---

## Report back

When you're done, tell Dave:

1. The measured nav width, and the overflow figures at 1280px and 360px.
2. Which of the six per-page edits applied, and which didn't (e.g. no newsletter on this page).
3. **Whether this page had a header offset that needed adjusting**, and what you changed it to.
4. Anything you found that looks like a site-wide issue rather than a page issue. **Flag it,
   don't fix it.**
5. Anything in this brief that did not match what you actually found on the page.
