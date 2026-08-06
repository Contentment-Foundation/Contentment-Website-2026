# Website — UIUX to Development Handoff

**Date:** 28 July 2026  
**Source:** Zoom meeting assets (summary + next steps)  
**Attendees (from handoff prep):** Kristina, Dave, Woei Jing, Nav, Veron, Somesh

> Planning source of truth updated in `docs/planning/launch-plan-data.json` (Handoff Checklist + decisions).  
> **Stack note:** Call discussed React; repo/planning still has **D-11 Astro 4.x** until Nick confirms (**D-23 / HC-055**).

---

## Quick recap

Final review and handoff of the Contentment Foundation website design from Dave to Somesh for development. Outstanding design items: logo consistency, duplicated Priscilla quote, Jose donor video. Somesh outlined a responsive desktop + mobile build targeting **August 21** launch. Kristina emphasized a formal change-request process. Nav shared strong Q3 board confidence and the site’s importance for donor relations.

---

## Key outcomes

- Phase 1 UI/UX is complete and ready for handoff after: logo update, Jose video placeholder retained, critical-only final page review.
- Mobile responsiveness owned by **Somesh** in the development sprint (no separate Dave mobile deliverable).
- Copy changes excluded from Phase 1; only critical design/compliance red flags accepted.
- Priscilla duplicate quote → **Phase 2** (leave as-is for launch).
- Change management: Kristina creates a single form + Google Sheet for future website change requests.

---

## Decisions

| Topic | Decision |
|-------|----------|
| Logo | Use existing live-site logo (**without three dots**). Nav sends SVG via Slack; Dave implements in final pages; Somesh uses same SVG in build (**D-21**). |
| Jose donor video | Placeholder retained on Get Involved; video sent to Somesh when ready. |
| Priscilla quote | Replacement deferred to Phase 2. |
| Mobile | Somesh builds responsive natively; awkward elements may be hidden/adjusted after Phase 1. |
| Copy | Out of Phase 1 entirely except critical red flags (**D-22**). |
| Hosting path | Netlify (dev) → Vercel (production) / existing domain. |
| Framework | Call mentioned React — **pending Nick sign-off** vs resolved Astro (**D-23**). |
| Horizontal logo | Referenced, not confirmed → Phase 2 branding. |

---

## Next steps (from Zoom)

### Dave
- Implement crucial last-look changes (logo, etc.) by tomorrow morning.
- Send finalized UIUX pages, assets, and handoff reports (zip) to Somesh via Google Drive + link.

### Kristina
- Collate critical red-flag feedback from Slack and send list to Dave by end of day.
- Create change process/form + Google Sheet for website change requests.
- Connect with Lorna re: Somesh’s Claude account subscription.
- Create button inventory Miro board (page links + where each button leads) by end of week.

### Nav
- Send preferred logo SVG to Dave and team via Slack (immediate).
- Crucial page feedback within ~1 hour of the call (Slack `#website`).

### Woei Jing
- Final look-through; flag critical issues within ~1 hour of the call.

### Somesh
- Use Nav’s logo SVG (no three dots) in the build.
- Build homepage (desktop + mobile) first; share on Slack for review before remaining pages.
- Review Handoff Checklist Google Sheet and align open tickets.
- Provide / confirm development sprint timeline including mobile responsiveness.
- Bi-weekly check-ins with Kristina and Nick during the two-week sprint.

---

## Blockers (immediate)

1. **Logo SVG** — Nav → Slack (blocks Dave finalize).
2. **Critical review list** — WJ/Nav → Kristina → Dave (EOD / tomorrow AM).

---

## Pending confirmation

- Nick’s sign-off on React vs Astro (**D-23**).
- Whether the 2-week sprint is enough once mobile scope is clearer.
- Claude subscription level (Kristina ↔ Lorna).
- Button inventory Miro (EOW).
- Horizontal logo existence (Phase 2).
