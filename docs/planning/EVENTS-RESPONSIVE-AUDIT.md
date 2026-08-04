# Events Responsive Audit (light)

> **Date:** 31 July 2026 · Somesh Bhardwaj  
> **Scope:** `src/pages/events.astro` (+ shared `Nav.astro` / `global.css`)  
> **Method:** Locked-width QA (320 / 390 / 759 / 768 / 940 / 1280) via RF-006/RF-007 + CSS review  
> **Status:** **HC-072 review-only** — design not locked; Dave’s second notes still pending. This audit is lighter than `HOMEPAGE-RESPONSIVE-AUDIT.md` on purpose.

---

## Verdict

**No production-risk layout breaks found.** No document-level horizontal overflow at locked widths. Sections stack correctly; filter chips wrap; grids go 3 → 2 → 1; access benefits go 2-col → 1-col; recaps / close / hero / signup reflow as coded.

**Do not treat this page as launch-locked.** Soft visual flags stay for Dave (HC-072). No redesign in this pass.

---

## Fixes shipped (this pass)

| Item | Action |
|------|--------|
| Shared nav `.menu-btn` clip ≤380px | Fixed earlier (31 Jul) in `global.css` — tracked on RF-007 |
| Events page CSS | **None** — no clear overflow/stacking/type/touch-target production risk that wouldn’t fight HC-072 |

---

## Soft flags (leave for Dave — not blockers)

| Flag | Width | Notes |
|------|-------|--------|
| Flagship title `white-space:nowrap` soft overflow | ~1280 | `.ev-flagship-title` scrollWidth ≈783 vs container 760 — soft, not page scroll |
| Filter chip wrap | ≤390 | Intentional `flex-wrap`; multi-row chips are acceptable for now |
| Hero contrast | Mobile / desktop | White copy over lighter photo regions — design/scrim call for Dave |

---

## Breakpoints (page-local)

| Breakpoint | Notable behavior |
|------------|------------------|
| `≤980px` | Upcoming grid → 2 columns |
| `≤900px` | Flagship / close stack; title/script allow wrap |
| `≤860px` | Hero / signup / why stack to 1 column |
| `≤760px` | Recaps → 1 column; access CTA full-width |
| `≤720px` | Upcoming head stacks; Join Homeroom full-width |
| `≤640px` | Access benefits → 1 column |
| `≤620px` | Upcoming grid → 1 column; slightly smaller filter chips |

Shared nav drawer: `≤940px` (see homepage audit / FEAT-003).

---

## Email capture (open — do not wire)

Three placeholder seams stay unwired:

| Slot | Location | `data-embed` |
|------|----------|--------------|
| Fold under hero | `.ev-signup` — “Embed slot · tech to wire” | `newsletter-signup` |
| Why we gather | Inline capture | `event-announcements` |
| Close | “Want first access to all of it?” | `event-announcements` |

Plus festival “Be first to know” CTAs carry `data-embed="festival-signup"`.

**Decision D-24 (Open):** destination is **Flodesk vs Keela vs other** — Somesh asking **WoeiJing + Kristina**. Pairs with FEAT-070 / D-19. **Do not invent provider embeds** until that lands.

---

## Related trackers

- **HC-072** — Open (second notes; design not locked)
- **RF-007** — Open (review-only QA row; soft flags above)
- **HC-071** — RSVP / join-flow seams empty
- **D-24 / FEAT-070 / D-19** — email-capture provider
