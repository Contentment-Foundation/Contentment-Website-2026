# Get Involved / Give Responsive Design Audit

> **Date:** 31 July 2026 · Somesh Bhardwaj  
> **Scope:** Astro Give page (`src/pages/give.astro` page `<style>` + shared `Nav` / `global.css`)  
> **Method:** CSS review + Playwright locked-width checks at 320, 390, 759, 768, 940, and 1280 px  
> **Design rule:** No visual redesign — polish gaps only against the Jul 29 Dave / V phase-1 handoff.

---

## Verdict

**Layout responsive design is production-ready after the 31 Jul polish pass.** Hero, what-is split, benefits cards, quote band, become-split, and other-ways stack and scale at the locked widths. No horizontal page scroll was observed at any tested width.

Earlier RF-006 click-through (same day) found no P0/P1; this pass tightened mobile gutters, breakpoint alignment, stacked video aspect, and type scale.

---

## Breakpoint system (locked — do not add new breakpoints)

Give now follows the site system (was drifting to `900` / `680` only):

| Breakpoint | Changes |
|------------|---------|
| `≤940px` | What-is + become + other-ways stack to 1 column; landscape video placeholder; single gutter (no double padding); become CTA full-width (max 360px) |
| `≤680px` | Benefits grid → 1 column; featured Events card stacks photo under copy; other-ways CTAs stack |
| `≤560px` | Mobile hero image; bottom-aligned hero copy; `22px` gutters; tighter type; fuller tier copy width; 44px seelink touch target |

Fluid typography and spacing use `clamp()` on hero, titles, quote, become, and band padding.

---

## Section behavior (verified)

| Section | Desktop `1280` | Tablet `≤940` | Mobile `≤560` |
|---------|----------------|---------------|---------------|
| Nav | Full link row | Drawer + Donate (+ Sign In) | Drawer + Donate only |
| Hero | Desktop photo, left copy | Same | Mobile photo, bottom-aligned copy, full-width Join CTA |
| What-is split | Text left · portrait 9:16 video right | Text top · landscape 16:9 video below (overrides global `.split` image-first order so “Meet Jose” sits above the placeholder) | Same, `22px` gutters |
| Benefits | Featured row + 2×2 cards | Featured row + 2×2 through 759/768 | 1 column from `≤680` |
| Quote band | Centered paper band | Same | Slightly tighter type + vertical padding |
| Become / Join | Copy left · photo right | Copy top · photo below | Same; tighter tier padding; full-width Join CTA |
| Other ways | Copy · stacked CTAs | 1 column; CTAs row-wrap | CTAs stacked full-width |
| Footer | Shared footer | Shared 2×2 | Shared 1-col |

---

## Horizontal overflow

| Width | Page scroll | Notes |
|-------|-------------|-------|
| 320px | None | Hero bg `scale(1.06)` bleeds internally; clipped by `.gi-hero { overflow: hidden }` |
| 390px | None | Same |
| 759 / 768px | None | Benefits stay 2×2; become already stacked |
| 940px | None | Splits stacked; portrait video no longer forces a ~660px block |
| 1280px | None | Desktop 2-col what-is + become |

`body { overflow-x: hidden }` remains intentional in global CSS; section-level `overflow: hidden` on hero / quoteband / become clips decorative bleed.

---

## Fixes shipped this pass (31 Jul)

| Issue | Severity | Fix |
|-------|----------|-----|
| What-is double horizontal padding when stacked (section `32px` + `.split-txt` `32px` ≈ 64px/side at 320) | **High** | At `≤940`, zero section side padding; single `clamp(22px,…)` gutter on text/media |
| Stacked portrait 9:16 video ~660px tall at 940 | **High** | Landscape `16/9` + `max-width:min(520px,100%)` when stacked; keep 9:16 on desktop split |
| Global `.split` mobile `order` put video above copy (orphaned “Meet Jose” lead) | **High** | `.gi-what-split` forces text `order:1`, media `order:2` at `≤940` |
| Become / other-ways stacked only at `≤900` (nav drawer already at 940) | Medium | Stack at `≤940` with site breakpoints |
| Hero / become type + gutters heavy at 320 | Medium | `≤560` type clamps, `22px` gutters, bottom-aligned hero, smaller tier amt |
| Tier descriptions ~100px wide at 320 | Medium | Reduced tier padding/amt size; tdesc ~160px+ |
| “See what members receive” undersized touch target | Low | `min-height:44px` + padding on `.hero-seelink` |
| Play control oversized on short landscape placeholder | Low | Smaller `.gi-play` at `≤940` |

---

## Known remaining items (not layout breaks)

| Item | Severity | Status |
|------|----------|--------|
| Keela Join / one-time / ways-to-give seams still `#` | Product | Open — D-02 / HC-075 / FEAT-060; do not invent URLs |
| Member video placeholder (“tech to wire”) | Content / eng | Open — portrait embed pending recording |
| D-03 `/give` vs `/give/monthly` routing | Product | Open — Homeroom UI stays at `/give` for now |
| Benefits head white on `#54bf98` (~2.26:1) | Medium (a11y) | Open — V palette choice; documented in page CSS |
| Quote holding copy (WJ replacing) | Content | Open — no headshot by design |
| Base64 hero / card / texture images in `give.astro` | Perf | Intentional for handoff parity; extract later if needed |

---

## Test checklist (repeat before Slack / HC review)

- [ ] 320 / 390 / 759 / 768 / 940 / 1280 — no horizontal scroll
- [ ] Hero swaps to mobile image at `≤560`; Join CTA full-width
- [ ] What-is: text above landscape video at `≤940`; portrait video beside text at 1280
- [ ] “Meet Jose…” immediately above the video placeholder when stacked
- [ ] Benefits: 2×2 at 759/768; 1-col at 320/390
- [ ] Become: tiers readable at 320; Join CTA + tax line clear
- [ ] Other-ways CTAs full-width stack at 320
- [ ] Hamburger drawer works; Keela links still `#` (expected)
- [ ] `prefers-reduced-motion: reduce` — hero zoom / `.anim` gated via shared CSS

---

## Related

- [HOMEPAGE-RESPONSIVE-AUDIT.md](./HOMEPAGE-RESPONSIVE-AUDIT.md) — locked widths + breakpoint conventions
- [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) §4 — breakpoint table
- [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) — FEAT-050 / FEAT-051 / FEAT-060
- [TRACKER.md](./TRACKER.md) — FEAT-050 status · D-03 open
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — mobile nav ARIA pattern
