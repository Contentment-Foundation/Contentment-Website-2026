# Launch Plan Google Sheet

Stakeholder-friendly view of the contentment.org build timeline, pages, decisions, integrations, ticket status, and **preview review feedback**.

**Source of truth (for AI + auto-sync):** `docs/planning/launch-plan-data.json` — except live tabs once seeded (see below).

Live preview under review: https://contentmentweb2.netlify.app/

---

## Can Cursor update the Sheet directly?

**No.** Edit `docs/planning/launch-plan-data.json` in the repo, then:

```bash
python3 scripts/google-sheets/build-sheet-script.py
```

Re-paste `LaunchPlanSheet.gs` into Apps Script → Save → **Launch Plan → Refresh from source**.

---

## Tabs

| Tab | Contents | Editable by team? |
|-----|----------|--------------------|
| **Tickets** | FEAT tracker — status, owner, blocker | **Yes** |
| **Decisions** | Open + resolved decisions | **Yes** |
| **Handoff Checklist** | HC-xxx handoff items | **Yes** |
| **Review & Feedback** | RF-xxx preview QA (page, device, severity) | **Yes** — log Slack/mobile review here |
| **Reference** | Overview, Timeline, Pages, Design Notes, Integrations, Blockers, Phase 2 | No — regenerated |
| **Black Box** | Append-only edit audit | No — protected |

Refresh **skips** Tickets / Decisions / Handoff Checklist / Review & Feedback once they have data. Use **Force reseed live tabs** only when you intentionally want to overwrite manual edits from JSON.

---

## Review & Feedback columns

`ID · Date · Reviewer · Page · Device · Severity · Status · Feedback · Owner · Resolution / Notes · Preview URL`

Statuses: Open · In Progress · Done · Won't Fix · Deferred

---

## Refresh after repo changes

1. `python3 scripts/google-sheets/build-sheet-script.py`
2. Re-paste `LaunchPlanSheet.gs` → Save
3. Sheet menu **Launch Plan → Refresh from source** (creates **Review & Feedback** if missing; seeds only if empty)
