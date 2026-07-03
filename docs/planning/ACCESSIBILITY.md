# Accessibility — Checklist & ARIA Pattern Reference

> Companion to [FRONTEND-SPECIFICATION.md §5](FRONTEND-SPECIFICATION.md#5-accessibility-requirements). Target: **WCAG 2.1 AA** (PRD `F10`). This doc translates external standards into checks specific to this repo — it isn't a replacement for reading the sources directly.

## Standards this checklist draws from

| Source | Use it for |
|---|---|
| [The A11y Project Checklist](https://www.a11yproject.com/checklist/) | Plain-language, page-level checklist — content, structure, forms, media, mobile |
| [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) + [Patterns index](https://www.w3.org/WAI/ARIA/apg/patterns/) | Reference implementation for each interactive component (dialog, accordion, disclosure, carousel, etc.) — keyboard behavior, ARIA roles/states, focus management |
| [MDN — Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) | Background concepts, ARIA attribute reference, browser/AT support notes, and a learning path for onboarding new contributors |
| WCAG 2.1 AA | The actual conformance target — the three references above are how we hit it in practice |

---

## 1. Page-level checklist

### Structure & semantics
- [ ] One `<h1>` per page; heading levels don't skip (`h2` → `h3`, never `h2` → `h4`)
- [ ] Landmarks present: `<header>`, `<nav>`, `<main>`, `<footer>` — not just `<div>`s
- [ ] `lang="en"` set on `<html>` (already present on all shipped pages)
- [ ] DOM reading order matches visual order — check anything positioned with CSS Grid or absolute positioning (Story Board's pinned-card layout, the orbit scroll section)

### Images & media
- [ ] Every `<img>` has `alt`; decorative images (doodles, washi-tape spans, stickers) use `alt=""` or `aria-hidden="true"` — not a missing attribute
- [ ] Story photos have descriptive `alt` (who/what — not `photo1.jpg`); see the card pattern in `site/story-board.html`
- [ ] Any future video/audio ships with captions or a transcript (Foundation Reach map's planned educator/student story slider) before it goes live

### Color & visual
- [ ] Text contrast ≥ 4.5:1 (body), ≥ 3:1 (large text / UI components) — re-check whenever a new token pairing is introduced (teal-on-white, white-on-deep already verified per FRONTEND-SPECIFICATION §5)
- [ ] Color is never the only signal — active/selected state also changes weight, border, or an icon, not just hue (check `.chip.active`, `.btn.active` in `story-board.html`)
- [ ] Focus indicator is visible on every interactive element, including custom ones — never `outline: none` without a visible replacement
- [ ] `prefers-reduced-motion: reduce` disables or shortens all animation (pendulum sway, hero entrance, pinned-scroll ripple, hover-expand cards) — already implemented; gate **new** animation the same way

### Keyboard & focus
- [ ] Every interactive element is reachable and operable via keyboard alone (Tab/Shift+Tab, Enter/Space, Escape, Arrow keys where the pattern calls for it)
- [ ] Tab order matches visual order
- [ ] No keyboard trap outside an intentionally-modal dialog — and even there, Escape must always work
- [ ] Custom interactive elements (`.frame-wrap` cards, accordion headers) have `tabindex="0"`, a `role`, and handle both `Enter` and `Space`

### Forms
- [ ] Every input has an associated `<label>` or `aria-label` — not just a placeholder
- [ ] Required fields are marked programmatically (`required` / `aria-required`), not just visually
- [ ] Errors are announced, not just shown as a red border — associate via `aria-describedby`; consider `aria-live="polite"` for inline validation
- [ ] Live character counters (e.g. "180 characters left" in the Pin-a-Story form) update in a way assistive tech can perceive without being spammy (see §3)

### Mobile & touch
- [ ] Touch targets ≥ 24×24px (WCAG 2.1 AA) with adequate spacing
- [ ] Pan/zoom/drag interactions (Story Board corkboard, Foundation Reach map) have a non-gesture alternative — the Grid view toggle already serves this purpose; keep it
- [ ] Pinch-zoom is never disabled at the viewport level (`user-scalable=no` must never be added)

---

## 2. Component → ARIA pattern map

Match each interactive component we've built (or plan to build) to its APG reference pattern. "Status" reflects what's actually implemented today — update this table as components change; don't let it go stale.

| Component | Where | APG pattern | Key requirements | Status |
|---|---|---|---|---|
| Four Pillars accordion | `site/index.html` | [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Trigger has `aria-expanded`, controls the panel via `aria-controls`; panel is hidden, not just visually collapsed | ✅ `tabindex="0"`, `role="button"`, `aria-expanded` per FRONTEND-SPEC §5 |
| Mobile nav menu | `site/index.html` | [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | `aria-expanded` on toggle; focus moves into the panel when opened; Escape closes and returns focus to the toggle | ⚠️ Button currently only scrolls to nav — no drawer yet (PRD `F12`, known gap) |
| Story detail modal | `site/story-board.html` `#modal` | [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; focus moves in on open and is trapped inside; focus returns to the trigger on close; Escape closes | ⚠️ Escape + backdrop-click work; `role`/`aria-modal`/focus trap/focus-return not yet implemented — see §4 |
| Pin-a-Story modal | `site/story-board.html` `#pinModal` | [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Same as above | ⚠️ Has `role="dialog"` + `aria-modal` + `aria-labelledby` + initial focus on the quote field; still missing focus trap and focus-return-on-close — see §4 |
| Filters dropdown panel | `site/story-board.html` `#filterPanel` | [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Toggle has `aria-expanded`/`aria-controls`; Escape and click-outside close it | ⚠️ `aria-expanded` toggled; Escape + click-outside work; missing `aria-controls` wiring and focus-return to the toggle button |
| Board / Grid view switch | `site/story-board.html` | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) (two-state toggle group) | Pressed state exposed via `aria-pressed`, not just a CSS class | ⚠️ Visual `.active` class only |
| Region / role filter chips | `site/story-board.html` | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) group, single-select | Consider `aria-pressed`, or expose as a `radiogroup` so assistive tech announces position ("1 of 6") | ⚠️ Visual state only |
| Region / card-size selects (Pin-a-Story form) | `site/story-board.html` | Native `<select>` — **not** a custom [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) / [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | Keep native — native selects already ship full keyboard/screen-reader support for free | ✅ |
| Image slider in map popups | `site/foundation-reach-map.html` (planned per `prototypes/world-map/README.md`) | [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) | Visible + accessible prev/next controls; pause control if it autoplays; slide position announced | 🔲 Not yet built |
| "X stories" live count | `site/story-board.html` `#countLabel` | Live region (general APG guidance, not a standalone pattern) | `aria-live="polite"` so screen readers hear the updated count after filtering, without needing to re-find the element | 🔲 Not yet implemented |
| "Listen to story" TTS toggle | `site/story-board.html` `#mListen` | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) with state | Label already changes ("Listen" ↔ "Stop"); add `aria-pressed` so state is exposed programmatically | ⚠️ Label-only, no `aria-pressed` |

---

## 3. Notes on specific patterns worth getting right

**Dialog focus management is the biggest current gap.** Per the APG Dialog pattern, opening a modal must: (1) move focus to the dialog or its first focusable element, (2) trap Tab/Shift+Tab inside the dialog while open, (3) return focus to whatever triggered it when closed. We have (1) partially — the Pin-a-Story modal focuses the quote textarea; the story detail modal doesn't move focus at all — and are missing (2) and (3) everywhere a dialog exists. This is the highest-value accessibility fix available in the current prototypes.

**Live regions — use sparingly.** `aria-live="polite"` is right for the story count and empty-state message, but don't wrap the whole board in one — screen readers would re-announce every card on each re-render. Scope the live region to just the count/status text.

**Don't rebuild what's already accessible.** Native `<select>`, `<button>`, and `<input>` elements ship full keyboard and screen-reader behavior for free. Only reach for a custom ARIA widget when the native element genuinely can't do the job (e.g., the corkboard's drag/zoom viewport has no native equivalent).

---

## 4. Known gaps in the current prototypes

Found while auditing `site/story-board.html` — these are real, not hypothetical:

1. `#modal` (story detail) has no `role="dialog"`, `aria-modal`, or `aria-labelledby`.
2. Neither `#modal` nor `#pinModal` traps focus — Tab can escape into the corkboard behind the dialog while it's open.
3. Neither dialog returns focus to the element that opened it when closed (keyboard/screen-reader users lose their place; mouse users won't notice).
4. Board/Grid toggle and filter chips expose state via CSS class only, not `aria-pressed`.
5. `#countLabel` isn't a live region, so screen reader users filtering the board don't hear the updated count.
6. Mobile nav menu button (`site/index.html`) only scrolls to the nav — no real disclosure/drawer yet (tracked under PRD `F12`).

None of these block a design-review prototype, but they should be resolved before `TICKET-100` (pre-launch QA) — add them as explicit line items there, or open a dedicated ticket if the list grows.

---

## 5. Testing

| Method | Tool | When |
|---|---|---|
| Automated scan | axe DevTools / `@axe-core/cli` | Every PR touching markup; blocking check in `TICKET-100` |
| Keyboard-only pass | — | Before every prototype review handoff |
| Screen reader spot check | VoiceOver (macOS/iOS), NVDA (Windows) | Before each route ships in the Astro migration |
| Zoom/reflow | Browser zoom to 200% and 400%, check for horizontal scroll or clipped content | Before launch |
| Reduced motion | macOS/Windows "reduce motion" system setting | Any time a new animation is added |
| Color contrast | Browser DevTools contrast checker / WebAIM tool | Any time a new color/token pairing is introduced |

---

## Related documents

| Document | Location |
|----------|----------|
| Locked UI spec (this doc's parent) | `docs/planning/FRONTEND-SPECIFICATION.md` §5 |
| Feature scope (F10 accessibility baseline, F12 mobile nav) | `docs/planning/PRD.md` |
| Pre-launch QA ticket | `docs/planning/FEATURE-TICKETS.md` — `TICKET-100` |
| Security & access model | `docs/planning/SECURITY-AND-ACCESS.md` |
