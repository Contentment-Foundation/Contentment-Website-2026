# Our Impact Responsive Design Audit

> **Date:** 31 July 2026 · Somesh Bhardwaj  
> **Scope:** Astro Our Impact (`src/pages/our-impact/index.astro` page `<style>`)  
> **Method:** CSS review + Playwright locked-width checks at 320, 390, 759, 768, 940, and 1280 px  
> **Design rule:** No visual redesign — tighten stacking, gutters, type scale, and auto-alignment against Dave’s Jul 29 handoff.

---

## Verdict

**Layout responsive design is production-ready** after the 31 Jul polish pass. Sections stack and scale at the locked homepage breakpoints (`≤940px`, `≤760px`, `≤560px`). No horizontal page scroll was observed at any tested width.

Singapore stub / pending story content (**FEAT-030**) is unchanged. Annual report Drive links (**HC-074**) stay as-is.

---

## Breakpoint system (locked — do not add new breakpoints)

Aligned to the homepage audit (`HOMEPAGE-RESPONSIVE-AUDIT.md`). Earlier Our Impact media queries used `900` / `960` / `620`, which left the locked **940** width on the cramped desktop magazine layout.

| Breakpoint | Changes |
|------------|---------|
| `≤940px` | Hero auto-height (drop `100svh` / `min-height:680`); region chips → flex 3-up, incomplete row centered; magazine lead stacks; mag-intro full width; mag-stats 2-col + tighter padding; stub body 1-col; region photo `16/9`; Singapore badge block under title; schoolsvid / close / reports padding tightened |
| `≤760px` | Mag-stats padding + number column tighten; voice portrait gaps reduce; body type slightly smaller |
| `≤560px` | Hero chips 2-up (5th centered); hero stats wrap without middots; mag-stats 1-col (number above label); video row 1-col; reports 1-col; full-width give + playlist CTAs (`min-height:48`); voice names fluid; play buttons 56px |

Fluid type: `.close-cta h2` and region headers use `clamp()`; `.lead-accent` scales at mobile.

---

## Section behavior (verified)

| Section | Desktop `1280` | Tablet `≤940` | Mobile `≤560` |
|---------|----------------|---------------|---------------|
| Hero map | Full viewport, 5 chips in a row | Auto height; 3-up chips, last row centered | 2-up chips; 5th centered; stats wrap |
| Region photo | `21/9` | `16/9` | Same + smaller radius |
| Mag lead | Video + text side-by-side (flip per region) | Stacked (text then video) | Same, tighter frame padding |
| Mag stats | 3-col white card | 2-col, reduced pad | 1-col; number above label |
| Voice portraits | 3-up / 2-up (`vp-2`) | Same, tighter gaps | Fluid name type; ≥44px tap area |
| Mag more videos | 3-up navy block | Same, reduced pad | 1-col stack |
| Singapore stub | Story + video 2-col | 1-col; badge under title | Same |
| Schools of Wellbeing | Centered feature + playlist | Reduced band pad | Full-width playlist CTA |
| Close CTA | Centered gold band | Fluid `h2` | Full-width give button |
| Reports | 2 featured cards + past pills | Same | 1-col cards; 44px past links |

---

## Horizontal overflow

| Width | Page scroll | Notes |
|-------|-------------|-------|
| 320px | None | Singapore chip centered under 2×2; mag-stats pad `20px 18px` |
| 390px | None | Same mobile rules |
| 759px | None | 3+2 chips centered; mag-lead stacked; stats 2-col |
| 768px | None | Same as 759 with ≤940 pad (just above 760) |
| 940px | None | Was previously still desktop magazine (900px MQ) — now stacks |
| 1280px | None | Full Dave desktop layout preserved |

`body { overflow-x: hidden }` in `global.css` remains intentional. Nav drawer off-canvas is expected and ignored in overflow checks.

---

## Before → after (this pass)

| Issue | Severity | Status |
|-------|----------|--------|
| Breakpoints at 900/960/620 left **940** on desktop magazine (5-col chips, side-by-side lead, 3-col stats) | **High** | ✅ Fixed — locked to 940 / 760 / 560 |
| Hero forced `100svh` + `min-height:680` on tablet cramped chips + stats | **High** | ✅ Fixed — auto height at ≤940 |
| Incomplete chip rows left-aligned (3+2, 2+2+1) | Medium | ✅ Fixed — flex + `justify-content:center` |
| Mag-stats / mag-more `38–44px` pad crushed content at 320 | Medium | ✅ Fixed — mobile pad `18–20px`; stats stack number/label |
| Video thumbs 2-col ~87px at 320 | Medium | ✅ Fixed — 1-col at ≤560 |
| Close / playlist CTAs not full-width on phone | Low | ✅ Fixed — full-width + 48px min height |
| No page-local `prefers-reduced-motion` for hover transforms | Low | ✅ Fixed — transitions/animations gated |
| Singapore stub badge inline with long title | Low | ✅ Fixed — badge blocks under title at ≤940 |
| FEAT-030 Singapore story copy | — | Open — stub only; do not invent content |
| HC-074 Drive report URLs | — | Unchanged (interim links) |

---

## Test checklist (repeat before Slack review)

- [ ] 320 / 390 / 759 / 768 / 940 / 1280 — no horizontal scroll
- [ ] Hero chips: incomplete last row centered at tablet + mobile
- [ ] Magazine lead stacks by 940; stats readable at 320
- [ ] Voice portraits open quotes; arrow tracks selected face on resize
- [ ] Video lightbox open/close (Esc + backdrop); play targets ≥44px
- [ ] Reports cards stack; HC-074 Drive links intact
- [ ] Singapore stub still “Story coming soon” (no invented copy)
- [ ] `prefers-reduced-motion: reduce` — no hover lifts / quote fade

---

## Related

- [HOMEPAGE-RESPONSIVE-AUDIT.md](./HOMEPAGE-RESPONSIVE-AUDIT.md) — locked breakpoint system
- [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) §4 — breakpoint table
- [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) — FEAT-031 Our Impact index
- [TRACKER.md](./TRACKER.md) — FEAT-030 / FEAT-031 / HC-074
