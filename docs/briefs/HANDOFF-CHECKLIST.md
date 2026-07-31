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
| Logo | Live-site mark **without three dots**; Nav SVG → Dave → Sam (**D-21 / HC-027**) |
| Jose video | Placeholder on Get Involved; file → Somesh when ready (**HC-040**) |
| Priscilla quote | Leave as-is → **Phase 2** (**HC-042**) |
| Copy changes | Excluded from Phase 1; critical design/compliance only (**D-22 / HC-043**) |
| Build order | Homepage desktop + mobile first → Slack review before other pages (**HC-057**) |
| Change process | Kristina owns CR form + Google Sheet (**HC-054 / HC-058**) |

## Still open (post-call)

| Item | Owner | Needed by |
|------|-------|-----------|
| Logo SVG via Slack | Nav | Immediate |
| Critical red flags → consolidated list | WJ/Nav → Kristina → Dave | ~1hr / EOD Jul 28; Dave applies Jul 29 AM |
| Button inventory Miro | Kristina | End of week |
| Nick sign-off React vs Astro (**D-23**) | Nick | Before scaffold lock |
| Claude subscription (~$100/mo) | Kristina ↔ Lorna | Sprint tooling |
| Keela URLs / `/give` / newsletter | Finance / Lorna / Comms | Per existing D-02, D-03, D-19 |
| Keela Donate button color (dashboard-only fix) | Finance / Lorna | Before Aug 21 (**HC-070**) |
| Keela/Homeroom join-flow choreography | Lorna / Kristina | Blocks Get Involved + Events gated CTAs (**HC-071**) |
| Events page — second round of team notes | Dave | Before /events production build (**HC-072**) |
| Annual Report PDFs (2019–2024) | Somesh | Our Impact page PDF section (**HC-074**) |
| Live Keela checkout URLs per tier ($25/$50/$100) for Homeroom donate button | Lorna + Somesh | Blocks FEAT-060/FEAT-051 (**HC-075**, Critical — splits the URL deliverable out from D-02/FEAT-060). Both escalating with Keela support for a senior support exec. |

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
**HC-063** (responsive across 7 pages) → In Progress (homepage done; remaining pages pending).

Filter the sheet by **Status = Open** (and Priority = Critical) for the live queue.

## Related

- Meeting notes: `docs/correspondence/HANDOFF-MEETING-2026-07-28.md`
- Timeline briefs: `docs/briefs/DEV-TIMELINE.html`, `docs/briefs/dev-timelinev2.html`
- Tracker changelog: `docs/planning/TRACKER.md`
