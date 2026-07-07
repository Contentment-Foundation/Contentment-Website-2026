# Launch Plan Google Sheet

Stakeholder-friendly view of the contentment.org build timeline, pages, decisions, integrations, and ticket status.

This is the team's **single tracker** — there is no separate tracker app, and the whole
spreadsheet is just 3 tabs. The team works directly in **Tickets** and **Decisions** (status,
owner, blocker columns); everything else (Overview, Timeline, Pages, Design Notes,
Integrations, External Blockers, Phase 2 Deferred) is merged into one read-only **Reference**
tab, refreshed from the repo.

**Source of truth (for AI + auto-sync):** `docs/planning/launch-plan-data.json` — except
Tickets and Decisions, whose live source of truth becomes the Sheet itself once seeded (see
"Refresh after repo changes" below).

---

## Can Cursor update the Sheet directly?

**No.** There is no Google Sheets connection in this workspace, and the script has no live
connection to GitHub either — the JSON data is embedded directly in `LaunchPlanSheet.gs`.
Updates work like this:

1. **You or Cursor** edit `docs/planning/launch-plan-data.json` in the repo
2. Run `python3 scripts/google-sheets/build-sheet-script.py` to bake the new JSON into `LaunchPlanSheet.gs`
3. **Re-paste** the updated `LaunchPlanSheet.gs` into the Apps Script editor and run `createOrRefreshLaunchPlan` (or use the Sheet menu)

Ask Cursor: *"Update the launch plan sheet data for …"* — it will edit the JSON file; you regenerate the script and re-paste.

---

## One-time setup

### 1. Create the Apps Script project

1. Open [script.google.com](https://script.google.com) → **New project**
2. Name it `contentment Launch Plan`
3. Delete the default `Code.gs` content
4. Copy the entire contents of **`LaunchPlanSheet.gs`** into the editor
5. **Save** → Run **`createOrRefreshLaunchPlan`**
6. Authorize when prompted
7. Check **Execution log** for the new Sheet URL
8. Copy the spreadsheet ID from the URL into `CONFIG.SPREADSHEET_ID` so future runs update the same file

### 2. Optional — daily auto-refresh

After opening the Sheet: **Launch Plan → Install daily auto-refresh (9am)**

Or run `installDailyRefreshTrigger` once from the script editor. This only re-runs the embedded
JSON already baked into the script — it does **not** fetch anything from GitHub, so it's only
useful once you've re-pasted an updated script.

---

## Tabs created (3 total)

| Tab | Contents | Editable by team? |
|-----|----------|--------------------|
| **Tickets** | FEAT tracker — status, owner, blocker, priority | **Yes — edit directly** |
| **Decisions** | Open + resolved decisions — status, owner, notes | **Yes — edit directly** |
| Reference | Overview, Timeline, Pages, Design Notes, Integrations, External Blockers, Phase 2 Deferred — stacked as labeled sections in one tab | No — regenerated |

---

## Refresh after repo changes

1. Regenerate the embedded JSON:

```bash
python3 scripts/google-sheets/build-sheet-script.py
```

2. Re-paste the updated `LaunchPlanSheet.gs` into the Apps Script editor → Save
3. Run refresh — either **Launch Plan → Refresh from source** in the Sheet menu, or run `createOrRefreshLaunchPlan` from the script editor

**Important — Tickets and Decisions are protected from refresh.** Once those two tabs have
been seeded once (i.e. they have any rows beyond the header), "Refresh from source" and the
daily auto-refresh trigger will **skip them** — they only rebuild the read-only reference
tabs. This is intentional: the team edits status/owner/blocker directly in those two tabs,
and a routine refresh must never silently discard that work.

If you genuinely want to reset Tickets/Decisions back to what's in
`docs/planning/launch-plan-data.json` (discarding all manual edits made in the Sheet), use
**Launch Plan → Force reseed Tickets + Decisions** from the Sheet menu. It asks for
confirmation before overwriting.

---

## Share with Kristina

1. Create the Sheet (steps above)
2. **Share** the Google Sheet (Viewer or Commenter)
3. Send the short Slack message (see below) with the Sheet link

---
