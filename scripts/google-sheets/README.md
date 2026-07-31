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
Severities: Critical · High · Medium · Low · Nit

A side legend panel (columns M–N) explains the row format (one issue per row, next
sequential RF-0xx, leave Status/Owner/Resolution to the triager) plus what each Status
and Severity value means — mirrors the Handoff Checklist tab's legend (columns J–K).
Built by `writeReviewFeedbackLegendPanel_` / `writeHandoffLegendPanel_` in
`LaunchPlanSheet.gs`; edits there don't trip the Black Box (ignored by column).

---

## Black Box is one-way

The Black Box tab is an **append-only edit log inside the Sheet** (`onEditAudit_` →
`appendAuditEvent_`) — it records who changed what, when, on the live tabs. It does
**not** sync anything back to the repo. If a manual Sheet edit (a Status flip, a new
HC/RF row, an Owner reassignment) should actually change project truth, someone has to
read the Black Box / live tabs and port that change into `docs/planning/launch-plan-data.json`
+ `TRACKER.md` by hand — same as any other planning update (see repo root
`.claude/rules/planning-docs-sync.md`). There is no Apps Script → GitHub write path.

---

## Refresh after repo changes

1. `python3 scripts/google-sheets/build-sheet-script.py`
2. Re-paste `LaunchPlanSheet.gs` → Save
3. Sheet menu **Launch Plan → Refresh from source** (creates **Review & Feedback** if missing; seeds only if empty)
