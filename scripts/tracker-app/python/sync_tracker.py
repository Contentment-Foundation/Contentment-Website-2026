#!/usr/bin/env python3
"""Sync launch-plan-data.json into Google Sheet tracker tabs.

Usage:
  export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
  python3 scripts/tracker-app/python/sync_tracker.py \
    --spreadsheet-id 18_WjO7OrCNUrcciBpjqEA90dzbhvKEeEzgC2B4fRGJk \
    --json-path docs/planning/launch-plan-data.json
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

import gspread
from google.oauth2.service_account import Credentials

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

ISSUE_HEADERS = [
    "id",
    "title",
    "type",
    "phase",
    "priority",
    "status",
    "owner",
    "depends_on",
    "blocker",
    "source_ticket",
    "updated_by",
    "updated_at",
]

DECISION_HEADERS = [
    "decision_id",
    "topic",
    "status",
    "owner",
    "impact",
    "notes",
    "updated_by",
    "updated_at",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def auth_client() -> gspread.Client:
    credentials_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_path:
        raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS is not set")
    creds = Credentials.from_service_account_file(
        credentials_path,
        scopes=SCOPES,
    )
    return gspread.authorize(creds)


def ensure_sheet(ss: gspread.Spreadsheet, title: str, headers: List[str]) -> gspread.Worksheet:
    try:
        ws = ss.worksheet(title)
    except gspread.WorksheetNotFound:
        ws = ss.add_worksheet(title=title, rows=2000, cols=max(20, len(headers)))
    current = ws.row_values(1)
    if current != headers:
        ws.clear()
        ws.update("A1", [headers])
    return ws


def normalize_ticket(ticket_row: List[str]) -> Dict[str, str]:
    # launch-plan-data.json tickets columns:
    # ID, Title, Phase, Priority, Status, Owner, Depends on, Blocker / Note
    issue_id = ticket_row[0]
    return {
        "id": issue_id,
        "title": ticket_row[1],
        "type": issue_id.split("-")[0] if "-" in issue_id else "FEAT",
        "phase": ticket_row[2],
        "priority": ticket_row[3],
        "status": ticket_row[4],
        "owner": ticket_row[5],
        "depends_on": ticket_row[6],
        "blocker": ticket_row[7],
        "source_ticket": issue_id,
        "updated_by": "sync-bot@contentment.org",
        "updated_at": now_iso(),
    }


def normalize_decision(row: List[str]) -> Dict[str, str]:
    # decisions columns:
    # ID, Decision, Options, Owner, Status, Blocks, Priority
    return {
        "decision_id": row[0],
        "topic": row[1],
        "status": row[4],
        "owner": row[3],
        "impact": row[6],
        "notes": f"Options: {row[2]} | Blocks: {row[5]}",
        "updated_by": "sync-bot@contentment.org",
        "updated_at": now_iso(),
    }


def upsert_rows(
    ws: gspread.Worksheet,
    headers: List[str],
    key_name: str,
    rows: List[Dict[str, str]],
) -> None:
    existing = ws.get_all_records()
    index = {str(r.get(key_name, "")): i + 2 for i, r in enumerate(existing)}

    updates = 0
    inserts = 0
    for row in rows:
        key = str(row[key_name])
        values = [row.get(h, "") for h in headers]
        if key in index and key:
            ws.update(f"A{index[key]}:{chr(64 + len(headers))}{index[key]}", [values])
            updates += 1
        else:
            ws.append_row(values, value_input_option="USER_ENTERED")
            inserts += 1
    print(f"{ws.title}: {updates} updated, {inserts} inserted")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spreadsheet-id", required=True)
    parser.add_argument("--json-path", default="docs/planning/launch-plan-data.json")
    args = parser.parse_args()

    data = json.loads(Path(args.json_path).read_text())
    client = auth_client()
    ss = client.open_by_key(args.spreadsheet_id)

    issues_ws = ensure_sheet(ss, "issues", ISSUE_HEADERS)
    decisions_ws = ensure_sheet(ss, "decisions", DECISION_HEADERS)
    ensure_sheet(ss, "comments", ["comment_id", "issue_id", "comment_text", "author_email", "created_at"])
    ensure_sheet(ss, "activity_log", ["event_id", "entity_type", "entity_id", "action", "old_value", "new_value", "actor_email", "at"])
    ensure_sheet(ss, "lookups", ["key", "value"])

    tickets = data.get("tickets", [])[1:]  # skip header
    issues = [normalize_ticket(t) for t in tickets if t and t[0]]
    upsert_rows(issues_ws, ISSUE_HEADERS, "id", issues)

    decisions_raw = data.get("decisions", [])[1:]  # skip header
    decisions = [normalize_decision(d) for d in decisions_raw if d and d[0]]
    upsert_rows(decisions_ws, DECISION_HEADERS, "decision_id", decisions)

    print("Sync complete.")


if __name__ == "__main__":
    main()
