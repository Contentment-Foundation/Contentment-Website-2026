#!/usr/bin/env python3
"""
Regenerate the Phase 1 launch board canvas from live project sources.

Sources (in priority order for overlapping FEAT IDs):
  - docs/planning/launch-plan-data.json  (Launch Plan Sheet source)
  - docs/planning/TRACKER.md            (OPS/DOC/QA + extra FEATs)
  - src/config/seams.ts
  - git status / recent log             (refresh meta banner)

Output:
  ~/.cursor/projects/.../canvases/project-canvas-opportunities.canvas.tsx

Usage:
  python3 scripts/refresh-launch-canvas.py
"""

from __future__ import annotations

import json
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LP_PATH = ROOT / "docs/planning/launch-plan-data.json"
TRACKER_PATH = ROOT / "docs/planning/TRACKER.md"
SEAMS_PATH = ROOT / "src/config/seams.ts"
UI_FRAGMENT = Path(__file__).resolve().parent / "_launch-canvas-ui.tsx.fragment"
CANVAS_OUT = Path.home() / (
    ".cursor/projects/Users-someshbhardwaj-Desktop-Contentment-Website-2026"
    "/canvases/project-canvas-opportunities.canvas.tsx"
)

ENG_DECISIONS = [
    ["DECISION-001", "Analytics stack", "GA4 + PostHog + Clarity", "Resolved"],
    ["DECISION-002", "Cookie consent", "Osano + Consent Mode v2", "Resolved"],
    ["DECISION-003", "Transactional email", "SendGrid", "Resolved"],
    ["DECISION-004", "Rate limiting", "Upstash Redis", "Resolved"],
    ["DECISION-005", "Image optimization", "Astro Image", "Resolved"],
    ["DECISION-006", "Observability", "Slack + Sentry + Vercel + PostHog", "Resolved"],
    ["DECISION-007", "PostHog hosting", "PostHog Cloud", "Resolved"],
]


def esc(s: object, n: int = 110) -> str:
    t = str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
    if len(t) > n:
        t = t[: n - 1] + "…"
    return t


def rows_ts(name: str, matrix: list[list[str]]) -> str:
    lines = [f"const {name} = ["]
    for r in matrix:
        cells = ", ".join(f'"{esc(c)}"' for c in r)
        lines.append(f"  [{cells}],")
    lines.append("];")
    return "\n".join(lines)


def run(cmd: list[str]) -> str:
    try:
        return subprocess.check_output(cmd, cwd=ROOT, text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return ""


def parse_tracker_only(lp_ids: set[str]) -> list[dict]:
    rows: list[dict] = []
    text = TRACKER_PATH.read_text()
    for line in text.splitlines():
        if not (
            line.startswith("| FEAT-")
            or line.startswith("| OPS-")
            or line.startswith("| QA-")
            or line.startswith("| DOC-")
            or line.startswith("| —")
        ):
            continue
        parts = [p.strip() for p in line.split("|")][1:-1]
        tid = parts[0]
        title = parts[1]
        status = re.sub(r"^[🔵🟡🟠⏸️✅📅🚫]\s*", "", parts[5]).strip()
        if tid == "—":
            tid = "CXL-001" if "Plausible" in title else "CXL-002"
            if any(r["id"] == tid for r in rows):
                continue
        if tid in lp_ids:
            continue
        rows.append(
            {
                "id": tid,
                "title": title,
                "phase": parts[3],
                "priority": parts[4],
                "status": status,
                "owner": parts[7] if len(parts) > 7 else "—",
                "sprint": parts[9] if len(parts) > 9 else "—",
                "deps": parts[10] if len(parts) > 10 else "—",
                "note": (parts[11] if len(parts) > 11 else "Tracker only")[:120],
                "source": "tracker",
            }
        )
    return rows


def ticket_obj_ts(t: dict) -> str:
    return (
        "  {\n"
        f'    id: "{esc(t["id"], 40)}",\n'
        f'    title: "{esc(t["title"], 90)}",\n'
        f'    phase: "{esc(t["phase"], 20)}",\n'
        f'    priority: "{esc(t["priority"], 20)}",\n'
        f'    status: "{esc(t["status"], 20)}",\n'
        f'    owner: "{esc(t["owner"], 40)}",\n'
        f'    sprint: "{esc(t["sprint"], 40)}",\n'
        f'    deps: "{esc(t["deps"], 60)}",\n'
        f'    note: "{esc(t["note"], 120)}",\n'
        f'    source: "{t["source"]}",\n'
        "  }"
    )


def parse_seams(text: str) -> list[list[str]]:
    """Best-effort flat inventory from seams.ts object."""
    rows: list[list[str]] = []
    # top-level string keys
    for m in re.finditer(r"^\s{2}(\w+):\s*('([^']*)'|\"([^\"]*)\"),", text, re.M):
        key = m.group(1)
        val = m.group(3) if m.group(3) is not None else m.group(4)
        display = val if val else "(empty)"
        blocked = "—"
        if key == "donate":
            blocked = "D-02 / HC-030"
        elif key in ("join", "giveOneTime", "rsvp"):
            blocked = "HC-071"
        elif key == "waysToGive":
            blocked = "HC-071 / D-03"
        elif key == "schoolPlatform":
            blocked = "HC-005"
        rows.append([key, key, blocked, "—", display if display != "(empty)" else "(empty)"])

    # link.* 
    link = re.search(r"link:\s*\{([^}]+)\}", text, re.S)
    if link:
        for m in re.finditer(r"(\w+):\s*('([^']*)'|\"([^\"]*)\")", link.group(1)):
            key = f"link.{m.group(1)}"
            val = m.group(3) if m.group(3) is not None else m.group(4)
            display = val if val else "(empty)"
            rows.append(
                [
                    key,
                    m.group(1).title(),
                    "HC-005 / D-07" if not val else "wired",
                    "Design/Comms",
                    display[:80] if display != "(empty)" else "(empty)",
                ]
            )

    schools = re.search(r"schools:\s*\{([^}]+)\}", text, re.S)
    if schools:
        for m in re.finditer(r"(\w+):\s*('([^']*)'|\"([^\"]*)\")", schools.group(1)):
            key = f"schools.{m.group(1)}"
            val = m.group(3) if m.group(3) is not None else m.group(4)
            rows.append(
                [
                    key,
                    "Partner deck download" if m.group(1) == "deck" else m.group(1),
                    "HC-005",
                    "Kristina",
                    val if val else "(empty)",
                ]
            )
    return rows


def main() -> None:
    lp = json.loads(LP_PATH.read_text())
    now = datetime.now(timezone.utc).astimezone()
    stamp = now.strftime("%Y-%m-%d %H:%M %Z")

    branch = run(["git", "branch", "--show-current"]) or "?"
    dirty = run(["git", "status", "--porcelain"])
    dirty_n = len([l for l in dirty.splitlines() if l.strip()])
    recent = run(["git", "log", "-5", "--oneline"])
    recent_one = recent.splitlines()[0] if recent else "—"

    # Launch tickets
    launch: list[dict] = []
    for r in lp["tickets"][1:]:
        launch.append(
            {
                "id": r[0],
                "title": r[1],
                "phase": r[2],
                "priority": r[3],
                "status": r[4],
                "owner": r[5],
                "sprint": r[6],
                "deps": r[7],
                "note": r[8] or "—",
                "source": "launch-plan",
            }
        )
    lp_ids = {t["id"] for t in launch}
    tracker_only = parse_tracker_only(lp_ids)

    # HC open
    hc_open = [r for r in lp["handoffChecklist"][1:] if r[5] == "Open"]
    pri = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    hc_open.sort(key=lambda r: (pri.get(r[6], 9), r[0]))
    hc_rows = [[r[0], r[1], r[2], r[4], r[6], r[7] or "—"] for r in hc_open]
    hc_status = Counter(r[5] for r in lp["handoffChecklist"][1:])
    hc_total = len(lp["handoffChecklist"]) - 1
    hc_crit = sum(1 for r in hc_rows if r[4] == "Critical")

    ext = [[r[0], r[1], r[2], r[3], r[4]] for r in lp["externalBlockers"][1:]]
    ints = [[r[0], r[1], r[6], r[5], r[4], r[7]] for r in lp["integrations"][1:]]
    pages = [[r[0], r[1], r[2], r[4], r[5], r[6], r[8]] for r in lp["pages"][1:]]
    phase2 = [[r[0], r[1], r[2], r[3]] for r in lp["phase2Deferred"][1:]]
    design = [[r[0], r[1], r[2], r[3]] for r in lp["designNotes"][1:]]
    decs = [[r[0], r[1], r[4], r[6] or "—", r[5], r[3]] for r in lp["decisions"][1:]]

    seams_text = SEAMS_PATH.read_text() if SEAMS_PATH.exists() else ""
    seams = parse_seams(seams_text) if seams_text else []
    empty_seams = sum(1 for r in seams if r[4] == "(empty)")

    timeline = [[r[0], r[1], r[2], r[4]] for r in lp["timeline"][1:]]

    meta_version = lp.get("meta", {}).get("version", "?")
    open_decs = sum(1 for r in decs if r[2] == "Open")

    header = f'''import {{
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
}} from "cursor/canvas";

type Ticket = {{
  id: string;
  title: string;
  phase: string;
  priority: string;
  status: string;
  owner: string;
  sprint: string;
  deps: string;
  note: string;
  source: "launch-plan" | "tracker";
}};

/** Auto-generated by scripts/refresh-launch-canvas.py — do not hand-edit data blocks. */
const REFRESH_META = {{
  stampedAt: "{esc(stamp, 40)}",
  branch: "{esc(branch, 60)}",
  dirtyFiles: {dirty_n},
  latestCommit: "{esc(recent_one, 80)}",
  launchPlanVersion: "{esc(meta_version, 20)}",
  sheetNote: "Sheet live tabs (Tickets/Decisions/HC) may diverge until JSON is synced from GitHub or reseeded",
}};

const LAUNCH_TICKETS: Ticket[] = [
{",\n".join(ticket_obj_ts(t) for t in launch)}
];

const TRACKER_ONLY: Ticket[] = [
{",\n".join(ticket_obj_ts(t) for t in tracker_only) if tracker_only else ""}
];

const ALL_TICKETS: Ticket[] = [...LAUNCH_TICKETS, ...TRACKER_ONLY];

{rows_ts("HC_OPEN", hc_rows)}

{rows_ts("EXTERNAL_BLOCKERS_FULL", ext)}

{rows_ts("INTEGRATIONS", ints)}

{rows_ts("PAGES_ALL", pages)}

{rows_ts("PHASE2_DEFERRED", phase2)}

{rows_ts("DESIGN_NOTES", design)}

{rows_ts("DECISIONS_ALL", decs)}

{rows_ts("ENG_DECISIONS", ENG_DECISIONS)}

{rows_ts("SEAMS_INVENTORY", seams)}

{rows_ts("TIMELINE", timeline)}

const HC_STATUS_COUNTS = [
  {{ label: "Confirmed", value: {hc_status.get("Confirmed", 0)} }},
  {{ label: "Open", value: {hc_status.get("Open", 0)} }},
  {{ label: "Ready", value: {hc_status.get("Ready", 0)} }},
];

const COVERAGE = {{
  tickets: {len(launch) + len(tracker_only)},
  launchTickets: {len(launch)},
  trackerOnly: {len(tracker_only)},
  hcTotal: {hc_total},
  hcOpen: {len(hc_rows)},
  hcCriticalOpen: {hc_crit},
  blockers: {len(ext)},
  integrations: {len(ints)},
  pages: {len(pages)},
  decisions: {len(decs)},
  openDecisions: {open_decs},
  designNotes: {len(design)},
  phase2: {len(phase2)},
  seams: {len(seams)},
  emptySeams: {empty_seams},
}};

function statusTone(
  status: string,
): "success" | "danger" | "warning" | "info" | "neutral" {{
  if (status === "Done" || status === "Ready") return "success";
  if (status === "Blocked") return "danger";
  if (status === "In Progress" || status === "In sprint") return "info";
  if (status === "Cancelled" || status === "Paused") return "neutral";
  if (status === "Scheduled") return "neutral";
  return "neutral";
}}

function pillTone(
  status: string,
): "success" | "warning" | "info" | "neutral" | "deleted" {{
  if (status === "Done" || status === "Ready") return "success";
  if (status === "Blocked") return "deleted";
  if (status === "In Progress" || status === "In sprint") return "info";
  if (status === "Cancelled" || status === "Paused") return "neutral";
  return "neutral";
}}

function ticketRows(tickets: Ticket[]) {{
  return tickets.map((t) => [
    t.id,
    t.title,
    t.phase,
    t.priority,
    <Pill size="sm" tone={{pillTone(t.status)}}>
      {{t.status}}
    </Pill>,
    t.owner,
    t.sprint,
    t.deps,
    t.note,
  ]);
}}

function ticketTones(tickets: Ticket[]) {{
  return tickets.map((t) => statusTone(t.status));
}}

function boardRows(tickets: Ticket[]) {{
  return tickets.map((t) => [t.id, t.title, t.sprint, t.note]);
}}
'''

    # UI fragment — patch in refresh banner + coverage footer if needed
    ui = UI_FRAGMENT.read_text()
    # Inject refresh callout after H1 stack if not present
    banner = '''
      <Callout tone="info" title={`Refreshed ${REFRESH_META.stampedAt}`}>
        {REFRESH_META.branch} · {REFRESH_META.dirtyFiles} dirty files · {REFRESH_META.latestCommit}
        · LP {REFRESH_META.launchPlanVersion}. {REFRESH_META.sheetNote}.
      </Callout>
'''
    if "REFRESH_META" not in ui:
        ui = ui.replace(
            """        <Text tone="secondary">
          Merged from Launch Plan sheet JSON, TRACKER.md, HANDOFF-CHECKLIST, seams.ts,
          and engineering DECISIONS. Use the view filter to jump sections.
        </Text>
      </Stack>""",
            """        <Text tone="secondary">
          Merged from Launch Plan sheet JSON, TRACKER.md, HANDOFF-CHECKLIST, seams.ts,
          and engineering DECISIONS. Use the view filter to jump sections.
        </Text>
      </Stack>
"""
            + banner,
        )

    # Prefer COVERAGE constants in footer if present in ui - replace hardcoded footer
    ui = re.sub(
        r"<Text size=\"small\" tone=\"tertiary\">\s*Coverage:[\s\S]*?</Text>",
        """<Text size="small" tone="tertiary">
        Coverage: tickets {COVERAGE.tickets} · HC open {COVERAGE.hcOpen}/{COVERAGE.hcTotal}
        ({COVERAGE.hcCriticalOpen} critical) · blockers {COVERAGE.blockers} ·
        integrations {COVERAGE.integrations} · pages {COVERAGE.pages} ·
        decisions {COVERAGE.decisions} ({COVERAGE.openDecisions} open) ·
        design notes {COVERAGE.designNotes} · phase2 {COVERAGE.phase2} ·
        seams {COVERAGE.seams} ({COVERAGE.emptySeams} empty) · {REFRESH_META.stampedAt}
      </Text>""",
        ui,
        count=1,
    )

    # Fix stats that hardcode 57 / emptySeams length - use COVERAGE where simple
    ui = ui.replace('<Stat value="57" label="Handoff checklist rows" />', 
                    '<Stat value={String(COVERAGE.hcTotal)} label="Handoff checklist rows" />')
    ui = ui.replace(
        "<Text size=\"small\" tone=\"tertiary\">57 total · 26 open · 11 critical open</Text>",
        "<Text size=\"small\" tone=\"tertiary\">{COVERAGE.hcTotal} total · {COVERAGE.hcOpen} open · {COVERAGE.hcCriticalOpen} critical open</Text>",
    )

    out = header + "\n" + ui
    CANVAS_OUT.parent.mkdir(parents=True, exist_ok=True)
    CANVAS_OUT.write_text(out)

    summary = {
        "canvas": str(CANVAS_OUT),
        "stampedAt": stamp,
        "tickets": len(launch) + len(tracker_only),
        "launchTickets": len(launch),
        "trackerOnly": len(tracker_only),
        "hcOpen": len(hc_rows),
        "hcCriticalOpen": hc_crit,
        "blockers": len(ext),
        "integrations": len(ints),
        "pages": len(pages),
        "emptySeams": empty_seams,
        "openDecisions": open_decs,
        "dirtyFiles": dirty_n,
        "branch": branch,
        "latestCommit": recent_one,
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
