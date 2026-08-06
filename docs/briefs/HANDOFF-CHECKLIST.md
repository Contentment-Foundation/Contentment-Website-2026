# UI/UX → Development Handoff Checklist

> **Canonical copy lives in the Google Sheet**, not here.
>
> Sheet: **contentment.org — Launch Plan** → tab **`Handoff Checklist`**
> Source of truth in repo: `docs/planning/launch-plan-data.json` → `handoffChecklist`
>
> Meeting: Jul 28, 2026 · Kristina, Dave, Woei Jing, Nav, Veron, Somesh  
> Notes: [`docs/correspondence/HANDOFF-MEETING-2026-07-28.md`](../correspondence/HANDOFF-MEETING-2026-07-28.md)

## How to use

1. Open the Launch Plan sheet → **Handoff Checklist** tab.
2. Flip **Status** as work lands (`Open` → `Confirmed` / `Ready` / `Done`).
3. After repo updates: re-paste `LaunchPlanSheet.gs` → **Launch Plan → Refresh from source** (Reference). Use **Force reseed…** only if you need a fresh checklist (overwrites Status edits).

## Confirmed on the Jul 28 handoff call

| Item | Decision |
|------|----------|
| Phase 1 hard go-live | **Aug 21** |
| Mobile | **Somesh** owns responsive build in sprint — no separate Dave mobile comps (**HC-021**) |
| Logo | Live-site mark **without three dots**; Nav SVG → Dave → Somesh (**D-21 / HC-027**) |
| Jose video | Placeholder on Get Involved; file → Somesh when ready (**HC-040**) |
| Priscilla quote | Leave as-is → **Phase 2** (**HC-042**) |
| Copy changes | Excluded from Phase 1; critical design/compliance only (**D-22 / HC-043**) |
| Build order | Homepage desktop + mobile first → Slack review before other pages (**HC-057**) |
| Change process | Kristina owns CR form + Google Sheet (**HC-054 / HC-058**) |

## Closed since the call (5 Aug 2026 status sweep)

> These sat `Open` on the Sheet long after they were actually settled, which made the open queue look twice its real size. Full reasoning in each item's Notes and in [`TRACKER.md`](../planning/TRACKER.md).

| Item | Now | Why |
|------|-----|-----|
| Logo SVG (**HC-027**) | ✅ **Confirmed** | Shipped and in use — `public/assets/logo_lockup_light.svg` + `logo_lockup_dark.svg`, rendered by the brand lockup in `Nav.astro` on all 10 routes; `favicon.svg` live; JSON-LD points at the real file. The live-site mark without three dots is what D-21 asked for. |
| Critical red flags → consolidated list (**HC-028**) | ✅ **Confirmed** | Ran as designed: flags via Slack #website, Kristina consolidated, Dave applied the reworks Jul 29. Pages are four review rounds past that snapshot. |
| Named approvers for go/no-go (**HC-053**) | ✅ **Confirmed** | Already operating: design **Dave + Veron**, content **Kristina + WoeiJing**, legal **Lorna** (D-08), final go/no-go **Nav + WoeiJing**, engineering **Somesh**. The go/no-go *event* still gates on HC-068. |
| Newsletter destination (**HC-032**) | ✅ **Confirmed** | D-19 resolved to Flodesk; live since 4 Aug — 11 capture points, double opt-in on. |
| Design tokens / component inventory / a11y rule (**HC-022/023/025**) | ✅ **Confirmed** | Tokens locked and in use; 17 components under `src/components/`; contrast rule in force is *WCAG wins over strict brand palette*. |
| Astro scaffold, 7-page conversion, analytics + SEO, live credentials (**HC-061/062/066/076**) | ✅ **Confirmed** | All finished and verified live — see FEAT-001/002/080/081. |
| Deploy + DNS (**HC-067**), unpublish docs (**HC-077**) | 🔵 **Ready** | Fully prepared, date-gated on Aug 21 — nothing outstanding from anyone else. |

## Still open (post-call)

| Item | Owner | Needed by |
|------|-------|-----------|
| Button inventory Miro (**HC-005**) | Kristina | 🟠 **Partial** — overtaken by events; Somesh wired the destinations without it. Only three remain: Spread-the-movement door (WJ), per-tier Keela (Lorna), Events RSVP (Kristina) |
| Nick sign-off React vs Astro (**D-23**) | Nick | Before scaffold lock |
| Claude subscription (~$100/mo) | Kristina ↔ Lorna | Sprint tooling |
| Keela URLs / `/give` / newsletter | Finance / Lorna / Comms | Per existing D-02, D-03 (newsletter D-19 now closed) |
| **Where sign-ups land — Keela or Flodesk (HC-078 / DECISION-008)** | Kristina / Lorna / WJ | 🔴 **Critical.** Lorna's map assumes every sign-up lands in Keela; we route all email capture to Flodesk, and nothing syncs between them. Supersedes D-24's Events-only framing — the answer has to be sitewide. Lorna asks by **Fri 8/7** |
| **What Homeroom membership includes — benefits, not price (D-25)** | Kristina / WJ / Lorna | 🔴 **Critical.** Sets the tax-deductible portion of the receipt → the Keela designation → the widget config. Price is *already settled* — D-01 fixed $25/$50/$100 on 27 Jul. Lorna asks by **Fri 8/7** |
| **November waitlist page + routing (HC-079)** | Kristina / Ni Luh (Cika) | Lorna's map shows a waitlist page that does not exist in our build and is not in the Phase 1 page list. Depends on HC-078 or it gets built twice |
| **Launch date — 8/17 or Aug 21 (HC-080)** | Kristina / Nav | 🔴 **Critical.** Lorna is scheduling her Keela build and testing against **8/17**; this plan says **Aug 21**. If 8/17 holds, the Aug 10–14 review window *becomes* launch week |
| Keela Donate button color (dashboard-only fix) | Finance / Lorna | Before Aug 21 (**HC-070**) |
| Keela/Homeroom join-flow choreography | Lorna / Kristina | Blocks Get Involved + Events gated CTAs (**HC-071**) |
| Events page — second round of team notes | Dave | Before /events production build (**HC-072**) |
| Annual Report PDFs (2019–2024) | Somesh | Our Impact page PDF section (**HC-074**) |
| Live Keela checkout URLs per tier ($25/$50/$100) for Homeroom donate button | Lorna + Somesh | Blocks FEAT-060/FEAT-051 (**HC-075**, Critical — splits the URL deliverable out from D-02/FEAT-060). Both escalating with Keela support for a senior support exec. |
| Unpublish Project docs at production cutover | Somesh | Before contentment.org go-live (**HC-077** / FEAT-101): remove Footer “Project docs”; stop public `/docs*` routes; keep `docs/` in private repo only |

## Received Jul 29

Asset zip + Handoff Report MDs → Dave delivered all 7 page builds + assets via Drive Jul 29 AM;
received into `handoff/2026-07-29-dave-pages/`. Same-day intake review resolved: About Us roster
title (Dave Kebo = Chief Media Officer, **HC-035**), photo usage rights cleared (**HC-069**), Our
Impact route confirmed `/our-impact` (**HC-073**). A shared CSS bug from the homepage transplant
was found and fixed across all affected pages; internal page nav wired in the shared `assets/seams.js`.

## Jul 30 — Homepage responsive audit

Browser-tested Astro homepage at 320–1280px. No horizontal scroll; all three breakpoints match
FRONTEND-SPEC §4. Mobile nav drawer implemented (**FEAT-003** ✅). Full report:
[`docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md`](../planning/HOMEPAGE-RESPONSIVE-AUDIT.md).
**HC-063** (responsive + a11y across the pages) → **still In Progress, and honestly so.** Responsive is done — locked-width QA (320/390/759/768/940/1280) passed on every page. Accessibility is not: [`PRE-LAUNCH-QA-AUDIT.md`](../planning/PRE-LAUNCH-QA-AUDIT.md) (2 Aug) found 1 Critical / 4 Serious / 6 Moderate / 3 Minor across 8 routes, including a real keyboard trap in the `/schools` video lightbox. Fixes tracked on FEAT-100.

## Aug 5 — status sweep

Open handoff items went **22 → 8**. Nothing was deleted; fifteen items were settled work that had never been flipped, and three genuinely new items were added from Lorna's Keela map (HC-078/079/080). Ticket statuses were re-cut against a written rule at the same time — **work on us = In Progress; stopped on someone else = Blocked; part landed = Partial**, with a new **Waiting on** column naming the person. Reasoning per item is in the Sheet's Notes column and [`TRACKER.md`](../planning/TRACKER.md).

Filter the sheet by **Status = Open** (and Priority = Critical) for the live queue.

## Related

- Meeting notes: `docs/correspondence/HANDOFF-MEETING-2026-07-28.md`
- Timeline briefs: `docs/briefs/DEV-TIMELINE.html`, `docs/briefs/dev-timelinev2.html`
- Tracker changelog: `docs/planning/TRACKER.md`
