# Launch Plan Google Sheet

Stakeholder-friendly view of the contentment.org build timeline, pages, decisions, integrations, and ticket status.

**Source of truth (for AI + auto-sync):** `docs/planning/launch-plan-data.json`

---

## Can Cursor update the Sheet directly?

**No.** There is no Google Sheets connection in this workspace. Updates work like this:

1. **You or Cursor** edit `docs/planning/launch-plan-data.json` in the repo
2. **Push to GitHub** (sheet must be able to fetch the raw JSON URL)
3. **Apps Script** refreshes the Sheet (manual menu, or daily trigger)

Ask Cursor: *"Update the launch plan sheet data for …"* — it will edit the JSON file; you push and refresh the Sheet.

---

## One-time setup

### 1. Push the JSON file to GitHub

The Sheet auto-sync needs a public raw URL, e.g.:

`https://raw.githubusercontent.com/YOUR_ORG/Contentment-Website-2026/main/docs/planning/launch-plan-data.json`

### 2. Create the Apps Script project

1. Open [script.google.com](https://script.google.com) → **New project**
2. Name it `contentment Launch Plan`
3. Delete the default `Code.gs` content
4. Copy the entire contents of **`LaunchPlanSheet.gs`** into the editor
5. At the top of `CONFIG`, set:

```javascript
JSON_URL: 'https://raw.githubusercontent.com/YOUR_ORG/Contentment-Website-2026/main/docs/planning/launch-plan-data.json',
```

6. **Save** → Run **`createOrRefreshLaunchPlan`**
7. Authorize when prompted
8. Check **Execution log** for the new Sheet URL
9. Copy the spreadsheet ID from the URL into `CONFIG.SPREADSHEET_ID` so future runs update the same file

### 3. Optional — daily auto-refresh

After opening the Sheet: **Launch Plan → Install daily auto-refresh (9am)**

Or run `installDailyRefreshTrigger` once from the script editor.

---

## Tabs created

| Tab | Contents |
|-----|----------|
| README | Version, summary, refresh instructions |
| Overview | 2-week vs launch buffer summary |
| Timeline | Week-by-week sprint plan |
| Pages | All routes, Dave drafts, complexity |
| Design Notes | Per-page dev flags for stakeholders |
| Decisions | Open + resolved decisions |
| Integrations | Keela, Flodesk, analytics, etc. |
| Tickets | FEAT tracker (simplified) |
| External Blockers | Who we're waiting on |
| Phase 2 Deferred | Map, Story Board, About sub-pages, etc. |

---

## Refresh after repo changes

**Option A — Sheet menu:** Launch Plan → Refresh from source

**Option B — Script editor:** Run `createOrRefreshLaunchPlan`

**Option C — Regenerate script embedded data** (if not using GitHub URL yet):

```bash
python3 scripts/google-sheets/build-sheet-script.py
```

Then re-paste `LaunchPlanSheet.gs` into Apps Script and run refresh.

---

## Share with Kristina

1. Create the Sheet (steps above)
2. **Share** the Google Sheet (Viewer or Commenter)
3. Send the short Slack message (see below) with the Sheet link

---

## Regenerating the script from JSON

If you change `launch-plan-data.json` and want the embedded fallback updated without GitHub:

```bash
python3 scripts/google-sheets/build-sheet-script.py
```

This rewrites `LaunchPlanSheet.gs` with the latest embedded JSON.
