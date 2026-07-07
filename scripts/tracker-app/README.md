# v1 Tracker Board (Apps Script + Google Sheets)

This is a lightweight Jira/Asana-inspired tracker using:

- **Google Apps Script Web App** for UI and backend
- **Google Sheets** as the data store
- **Python sync** to seed/update issues and decisions from `docs/planning/launch-plan-data.json`

Spreadsheet ID in use:
`18_WjO7OrCNUrcciBpjqEA90dzbhvKEeEzgC2B4fRGJk`

---

## What this v1.1 supports

- Single-page board grouped by status
- Drag and drop between status columns
- Add issue
- Update issue status
- Assignee dropdown editing on cards
- Priority color chips on cards
- Search + owner/phase filters + "My items" view
- Per-issue comments
- Comment attribution via user email (`Session.getActiveUser().getEmail()`)
- Decision panel with inline status editing
- Decision detail drawer with editable notes
- Top activity feed (latest audit events)
- CSV export from board toolbar
- Weekly summary email (manual + scheduled trigger)
- Activity logging on create/update/comment
- Sync tickets + decisions from repo JSON

---

## 1) Deploy Apps Script web app

Create a new Apps Script project and add 4 files from `scripts/tracker-app/apps-script/`:

- `Code.gs`
- `Index.html`
- `Styles.html`
- `App.html`

Then:

1. Save
2. Run `doGet` once to authorize
3. **Deploy > New deployment > Web app**
4. Execute as: **Me**
5. Who has access: your org/team as needed
6. Copy web app URL

> Note: weekly summary uses `MailApp`, so Apps Script will request additional email permissions.

The first load auto-creates these tabs in your spreadsheet if missing:

- `issues`
- `comments`
- `decisions`
- `activity_log`
- `lookups`

---

## 2) Service account prep (for Python sync)

1. Create service account in GCP
2. Download JSON key
3. Share spreadsheet with the service account email (Editor)
4. Set env var locally:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/key.json"
```

---

## 3) Run Python sync

From repo root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/tracker-app/python/requirements.txt

python scripts/tracker-app/python/sync_tracker.py \
  --spreadsheet-id 18_WjO7OrCNUrcciBpjqEA90dzbhvKEeEzgC2B4fRGJk \
  --json-path docs/planning/launch-plan-data.json
```

This upserts:

- `tickets` -> `issues`
- `decisions` -> `decisions`

It does **not** erase comments/activity.

---

## 4) Suggested workflow

1. Keep planning data in `launch-plan-data.json`
2. Run Python sync after updates
3. Team collaborates in web app:
   - status updates
   - comments
   - owner updates
4. `activity_log` gives basic audit trail
5. Set weekly summary:
   - enter recipient email in toolbar
   - click **Save Email**
   - click **Install Weekly**
   - use **Send Weekly Now** once to verify

---

## Next upgrades (v2)

- markdown comments
- notifications (email/slack)
- row-level permissions
