# Homepage Responsive Design Audit

> **Date:** 30 July 2026 · Somesh Bhardwaj  
> **Scope:** Astro homepage (`src/pages/index.astro` + `src/styles/global.css`)  
> **Method:** CSS review + live browser checks at 320, 390, 759, 768, 940, 941, and 1280 px  
> **Design rule:** No visual redesign — audit and fix gaps only against the approved Jul 29 handoff.

---

## Verdict

**Layout responsive design is production-ready.** All sections stack and scale correctly at the three locked breakpoints (`≤940px`, `≤760px`, `≤560px`). No horizontal page scroll was observed at any tested width.

**FEAT-003 (mobile nav drawer)** was the only functional responsive gap — implemented 30 Jul 2026 in `Nav.astro` + `nav.js` + `global.css`.

---

## Breakpoint system (locked — do not add new breakpoints)

| Breakpoint | Changes |
|------------|---------|
| `≤940px` | Single-column splits; 2×2 stats; hamburger + drawer nav; static orbit beats; 2×2 pillars; 1-col doors/homeroom/news; 2×2 footer |
| `≤760px` | Kenya voice band stacks (image on top) |
| `≤560px` | Mobile hero image swap; `22px` horizontal padding; full-width hero CTAs; 1-col pillars; stacked newsletter inputs; Sign In hidden in header |

Fluid typography and spacing use `clamp()` throughout (hero `h1`, section `.band` padding, `.title`, `.lead`).

---

## Section behavior (verified)

| Section | Desktop | Tablet `≤940` | Mobile `≤560` |
|---------|---------|---------------|---------------|
| Nav | Full link row | Drawer + Donate (+ Sign In) | Drawer + Donate only |
| Hero | Desktop photo | Same | Mobile photo, bottom-aligned copy |
| Why split | 50/50 | Image top, text below | Same |
| Stats | 4 columns | 2×2 | 2×2 |
| Voice (Kenya) | Side-by-side | Side-by-side until 760 | Stacks at `≤760` |
| Invite (Marla) | Horizontal paper mask | Same | Vertical mask, repositioned photo |
| Orbit | Pinned scroll animation | Same scroll-reveal, stacked grid | Same |
| Community circles | 4 across | 2×2, 16:10 aspect | 2×2 |
| Four Pillars | 4-col accordion | 2×2 | 1 column |
| Homeroom | Card + ask split | Single column | Same |
| Doors | 3 across | 1 column | 1 column |
| Newsletter | 2 columns | 1 column | Stacked inputs |
| Footer | 4 columns | 2×2 | 1 column |

---

## Horizontal overflow

| Width | Page scroll | Notes |
|-------|-------------|-------|
| 320px | None | Header fits (brand + Donate + hamburger) |
| 390px | None | Circle watercolor frames clip inside `.alone { overflow: hidden }` |
| 768px | None | All grids reflow as specced |
| 1280px | None | Full desktop layout |
| 1440px | None | Decorative ripple rings exceed container internally but are clipped |

`body { overflow-x: hidden }` is intentional; section-level `overflow: hidden` on impact, doors, pillars, homeroom, and alone bands prevents decorative bleed.

---

## Known remaining items (not layout breaks)

| Item | Severity | Status |
|------|----------|--------|
| Pull quote clipped into green Impact band on mobile | **High** (layout) | ✅ Fixed 30 Jul — `.split` had `max-height:1040px`; stacked image+text overflowed onto `#impact`. At ≤940px: `max-height:none`, capped image `min-height`, extra `.split-txt` bottom padding |
| Orbit section showed all 3 beats statically on mobile | **High** (interaction) | ✅ Fixed 30 Jul — restored pinned scroll-reveal on ≤940px (same as desktop): one beat at a time, `--ob` ground colors, ring/bloom animation. Stacked fallback only for `prefers-reduced-motion` |
| Community circles became ovals; watercolour patches misaligned | **High** (layout) | ✅ Fixed 30 Jul — removed `.circ{aspect-ratio:16/10}` at ≤940px (forced top-aligned ovals inside square wraps). Photos stay 1:1 with patches |
| Four Pillars default all-open on mobile | Low (prototype parity) | Open — long section on small screens; matches Dave handoff |
| Invite `.sub` uses `max-width: min(34ch, 44%)` with no mobile override | Low (visual) | Open — subcopy can stay narrow on paper side |
| Footer contrast on `#0090be` (~3.66:1) | Medium (a11y) | Open — documented in CSS; not a responsive issue |
| Orbit scroll height: CSS `340vh` (3 beats) vs spec line `560vh` | Doc only | CSS matches Jul 29 handoff; update spec line when convenient |

---

## FEAT-003 implementation summary

Delivered in shared `Nav.astro` (all 7 Astro routes):

- Slide-in panel from right, `var(--deep)` background, white links with teal underline on hover/focus
- Join Homeroom CTA → `/give` (or `seams.join` when wired)
- Donate CTA → `seams.donate` (fallback `#`)
- Sign In in drawer actions (hidden in header bar at `≤560px` per existing CSS)
- `aria-expanded` on menu button; `aria-hidden` on drawer
- Focus trap while open; Escape closes; focus returns to toggle
- Body scroll locked (`body.nav-open`)
- Auto-closes on resize above 940px and on link click

---

## Test checklist (repeat before HC-057 Slack review)

- [ ] 320 / 390 / 768 / 940 / 1280 — no horizontal scroll
- [ ] Hamburger opens drawer; all 6 nav links reachable
- [ ] Escape closes drawer; focus returns to hamburger
- [ ] Tab cycles within drawer only while open
- [ ] Voice band stacks at 760 and below
- [ ] Hero swaps to mobile image at 560 and below
- [ ] `prefers-reduced-motion: reduce` — no animations

---

## Related

- [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) §4 — breakpoint table
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — mobile nav ARIA pattern
- [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) — TICKET-003 acceptance criteria
- [TRACKER.md](./TRACKER.md) — FEAT-003 status
