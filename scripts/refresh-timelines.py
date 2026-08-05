#!/usr/bin/env python3
"""Regenerate the data-bearing spans of the two timeline briefs from launch-plan-data.json.

WHY THIS EXISTS
    docs/briefs/DEV-TIMELINE.html and dev-timelinev2.html were the only team-facing
    artefacts NOT downstream of launch-plan-data.json. The Sheet (build-sheet-script.py)
    and the canvas (refresh-launch-canvas.py) resync on every planning edit; the timelines
    were hand-maintained, so they could only drift. On 4 Aug 2026 they were two days stale
    and still read "Blocked on live IDs (HC-076)" hours after the last of those credentials
    landed -- on the very page the team had been told to self-serve status from.
    This script makes that class of drift structurally impossible.

WHAT IT TOUCHES
    Only ID-keyed status spans and the "As of" stamp. Both files are hand-authored designs
    and stay that way: titles, owners, phase grouping, the Gantt, decision tables, chapter
    prose and every editorial row are re-emitted byte-for-byte.

CONTRACT
    meta.version in launch-plan-data.json drives the "As of" stamp. Bumping ticket statuses
    without bumping meta.version leaves the stamp unchanged -- that is correct, not a bug.

FAIL-CLOSED
    Every guard runs before any write. If the HTML has been restructured so a regex no
    longer matches the expected slot count, the script exits 2 and touches nothing rather
    than half-writing a file.

USAGE
    python3 scripts/refresh-timelines.py [--check] [--notes] [--strict-orphans] [--file A|B]
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LP_PATH = ROOT / "docs/planning/launch-plan-data.json"
FILE_A = ROOT / "docs/briefs/DEV-TIMELINE.html"      # table design
FILE_B = ROOT / "docs/briefs/dev-timelinev2.html"    # card design

EXPECTED_SLOTS = {"A": 25, "B": 25}
# 5-column decision rows in A's "Open Decisions" table. They carry <td class="id"> but are
# not ticket rows, so they legitimately fall outside ROW_A.
ALLOWED_UNMATCHED_A = {"D-02", "D-03"}
# Never %b -- that is locale-dependent and would silently emit e.g. "4 août 2026".
MONTHS = ("Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

# --- slot regexes -----------------------------------------------------------------------
# re.DOTALL must NOT be set on either: it is the only thing stopping a match from swallowing
# the following row/card whole.
ROW_A = re.compile(
    r'(<tr>\s*<td class="id">)([A-Z]+-\d+)(</td>\s*<td>)(.*?)(</td>\s*<td>)'
    r'<span class="tag tag-([a-z]+)">([^<]*)</span>(</td>\s*<td>)(.*?)(</td></tr>)'
)
# groups: 2 id · 4 title · 6 class suffix · 7 label · 9 note

CARD_B = re.compile(
    r'(<div class="task" data-status=")([a-z]+)("><span class="mark" style="--sc:var\(--)([a-z-]+)'
    r'(\)"></span><div class="main"><strong><span class="tid">)([A-Z]+-\d+)(</span>)(.*?)(</strong>)'
    r'(<div class="note">(.*?)</div>)?(</div><div class="owner">)(.*?)(</div><div class="st" style="--sc:var\(--)'
    r'([a-z-]+)(\)">)([^<]*)(</div></div>)'
)
# groups: 2 data-status · 4 mark var · 6 id · 8 title · 10 optional note block · 11 note
#         13 owner · 15 st var · 17 label

STAMP = re.compile(r"<strong>As of [^<]*</strong>")

# --- status mappings --------------------------------------------------------------------
# A writes groups 6 and 7 only. tag-approved / tag-decision / tag-signoff / tag-phase and the
# curated tag-done variants are never emitted on ticket rows -- those are editorial.
# Keys are the class SUFFIX only: ROW_A captures `tag-([a-z]+)`, so the literal "tag-" is
# outside the group. Storing "tag-done" here would make every comparison unequal and report
# all 25 rows as changed on every run.
STATUS_A = {
    "Done":        ("done",     "✓ Done"),
    "In Progress": ("progress", "● In progress"),
    "Blocked":     ("blocked",  "⚠ Blocked"),
    "Scheduled":   ("upcoming", "○ Upcoming"),
    "Open":        ("upcoming", "○ Upcoming"),
    "Paused":      ("upcoming", "○ Paused"),
}

# B writes groups 2, 4, 15, 17 (4 and 15 are always identical). data-status must stay inside
# the closed set statusRank() (dev-timelinev2.html:2087) and the #status-filters chips
# understand, so only {done, progress, upcoming, blocked} are ever emitted.
STATUS_B = {
    "Done":        ("done",     "s-done",  "Done"),
    "In Progress": ("progress", "s-prog",  "In progress"),
    "Blocked":     ("blocked",  "s-block", "Blocked"),
    "Scheduled":   ("upcoming", "s-up",    "Upcoming"),
    "Open":        ("upcoming", "s-up",    "Upcoming"),
    "Paused":      ("upcoming", "s-up",    "Paused"),
}

# (file, id, occurrence) -> (class_or_status, var_or_None, label, reason)
# A pin suppresses the write and ALWAYS prints, so it can never rot silently.
#
# The FEAT-071 pins ("✓ Moved to Phase 2" / "Deferred") were REMOVED on 5 Aug 2026.
# They existed because Kristina had moved Privacy/Terms out of Phase 1 launch scope,
# so the timeline deliberately overrode the JSON. That premise no longer holds:
# /privacy shipped 5 Aug and Somesh re-scoped the ticket to Phase 1 + 2 — Phase 1
# because a page declaring our cookies/analytics is a compliance requirement in the
# regions we serve, Phase 2 because it will keep evolving through review. With the
# JSON now saying Done, the pins would have forced the timeline to keep showing
# "Deferred" for a page that is live — the exact rot this mechanism exists to prevent.
PINS = {}

NOTE_LIMIT = {"A": 160, "B": 140}
# Which capture group holds the ticket id. They differ: in ROW_A the id is captured before
# the tag span (group 2, with group 6 being the CSS class suffix), while in CARD_B the id
# comes after the data-status and mark-var groups. Getting this wrong makes the reflow
# tripwire compare class names against ticket ids and fail closed on every row.
ID_GROUP = {"A": 2, "B": 6}


class Fail(Exception):
    """Guard violation. Always raised before any file is written."""


# --- note condensing (only used with --notes) -------------------------------------------
_MON = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec"
# The anchor is load-bearing. An unanchored date pattern picks the *deadline* out of
# FEAT-071's note and a mid-sentence date out of FEAT-070's.
_STAMP_RE = re.compile(
    rf"(?:(?<=^)|(?<=[.;])\s|(?<=·)\s)"
    rf"((?:\d{{1,2}}\s+(?:{_MON})|(?:{_MON})\s+\d{{1,2}})\b[^.;·]{{0,30}}?\s*(?:—|:)\s)"
)


def condense(note: str, limit: int) -> str | None:
    """Reduce a long JSON note to its most recent work-log entry, escaped for HTML."""
    t = re.sub(r"\s+", " ", note).strip()
    t = re.sub(r"\b(PLANNED|DONE|REMAINING)\s*:\s*", "", t)
    t = t.replace("•", "·")

    starts = [m.start(1) for m in _STAMP_RE.finditer(t)]
    seg = t[starts[-1]:] if starts else t

    # Keyword form on purpose: positional maxsplit is deprecated in Python 3.13.
    seg = re.split(r"(?<=[.!?])\s+(?=[A-Z(·])", seg, maxsplit=1)[0]
    seg = seg.strip(" ·—-")
    if not seg or seg in {"—", "-"}:
        return None

    if len(seg) > limit:
        cut = seg.rfind(" ", 0, limit - 1)
        seg = seg[:cut] if cut > 0.6 * limit else seg[: limit - 1]
        seg = seg.rstrip(" ,;:·—-") + "…"

    # Escape LAST, after truncation, so no entity can be cut in half. quote=False keeps
    # literal double quotes intact (A:777 contains: renamed from "Stories").
    # Mandatory: FEAT-100's note contains a literal <main>, which would otherwise inject
    # a real element mid-table.
    return html.escape(seg, quote=False)


# --- core -------------------------------------------------------------------------------
def load_tickets() -> tuple[dict[str, dict], str, Counter]:
    lp = json.loads(LP_PATH.read_text(encoding="utf-8"))
    hdr, rows = lp["tickets"][0], lp["tickets"][1:]
    try:
        i_id, i_title = hdr.index("ID"), hdr.index("Title")
        i_status, i_note = hdr.index("Status"), hdr.index("Blocker / Note")
    except ValueError as exc:
        raise Fail(f"launch-plan-data.json tickets header changed: {hdr} ({exc})") from exc

    tickets = {
        r[i_id]: {"title": r[i_title], "status": r[i_status], "note": r[i_note]}
        for r in rows
    }
    version = lp.get("meta", {}).get("version")
    if not version:
        raise Fail("launch-plan-data.json has no meta.version -- cannot stamp 'As of'")
    d = datetime.strptime(version, "%Y-%m-%d")
    return tickets, f"{d.day} {MONTHS[d.month - 1]} {d.year}", Counter(
        r[i_status] for r in rows
    )


def guard_slots(key: str, text: str, tickets: dict) -> list[str]:
    """G1-G5, G7. Returns the ordered slot ids. Raises Fail on any violation."""
    rx = ROW_A if key == "A" else CARD_B
    matches = list(rx.finditer(text))
    if len(matches) != EXPECTED_SLOTS[key]:
        raise Fail(
            f"file {key}: expected {EXPECTED_SLOTS[key]} ticket slots, regex matched "
            f"{len(matches)}. The HTML was restructured -- refusing to write."
        )

    ids = [m.group(ID_GROUP[key]) for m in matches]

    # G2/G3 -- the reflow tripwire. Every id-bearing cell must live inside a matched slot.
    if key == "A":
        cells = re.findall(r'<td class="id">([A-Z]+-\d+)</td>', text)
        stray = [c for c in cells if c not in ids and c not in ALLOWED_UNMATCHED_A]
        if stray:
            raise Fail(f"file A: id cells outside any matched row: {sorted(set(stray))}")
    else:
        tids = re.findall(r'<span class="tid">([A-Z]+-\d+)</span>', text)
        if len(tids) != len(ids):
            raise Fail(f"file B: {len(tids)} .tid spans but {len(ids)} matched cards")

    # G4
    if len(STAMP.findall(text)) != 1:
        raise Fail(f"file {key}: expected exactly 1 'As of' stamp, found "
                   f"{len(STAMP.findall(text))}")

    # G5 -- unknown id or unknown status is a hard error, never a silent default.
    for tid in ids:
        if tid not in tickets:
            raise Fail(f"file {key}: slot {tid} has no ticket in launch-plan-data.json")
        st = tickets[tid]["status"]
        if st not in STATUS_A:
            raise Fail(f"ticket {tid} has status {st!r}, which has no timeline mapping")

    # G7 -- a stale pin is a hard error, so pins cannot rot.
    for (pk, pid, pocc) in PINS:
        if pk != key:
            continue
        if [i for i, t in enumerate(ids) if t == pid][pocc: pocc + 1] == []:
            raise Fail(f"file {key}: PIN {pid}#{pocc} no longer resolves to a slot")
    return ids


def rewrite(key: str, text: str, tickets: dict, stamp: str, want_notes: bool):
    """Return (new_text, report_lines, n_status, n_pins, n_notes)."""
    seen: Counter = Counter()
    report: list[str] = []
    counts = {"status": 0, "pins": 0, "notes": 0}
    rx = ROW_A if key == "A" else CARD_B
    # Ids appearing in more than one slot (today FEAT-041 and FEAT-100, each twice, under
    # different phase headings with different hand-written titles). Status syncs to every
    # occurrence -- one ticket has one status -- but notes/titles stay frozen for them,
    # since the JSON has one note and the two slots deliberately say different things.
    dup_ids = {t for t, c in Counter(m.group(ID_GROUP[key]) for m in rx.finditer(text)).items() if c > 1}

    def fn(m: re.Match) -> str:
        g = list(m.groups())
        tid = m.group(ID_GROUP[key])
        occ = seen[tid]
        seen[tid] += 1
        tk = tickets[tid]
        pin = PINS.get((key, tid, occ))
        dup = tid in dup_ids
        tag = f"{tid:9} #{occ}"

        if key == "A":
            cur_cls, cur_lbl, cur_note = g[5], g[6], g[8]
            if pin:
                report.append(f"  {tag}  PINNED {cur_lbl!r} (JSON: {tk['status']}) "
                              f"-- {pin[3]}")
                counts["pins"] += 1
                new_cls, new_lbl = cur_cls, cur_lbl
            else:
                new_cls, new_lbl = STATUS_A[tk["status"]]
                if (new_cls, new_lbl) != (cur_cls, cur_lbl):
                    report.append(f"  {tag}  {cur_lbl!r} -> {new_lbl!r} ({tk['status']}"
                                  f"{', duplicate slot' if dup else ''})")
                    counts["status"] += 1
            new_note = cur_note
            if want_notes and not dup:
                cand = condense(tk["note"], NOTE_LIMIT["A"])
                if cand and cand != cur_note:
                    new_note = cand
                    counts["notes"] += 1
            elif want_notes and dup:
                report.append(f"  {tag}  note frozen (duplicate id -- {tid} has >1 slot)")
            # ROW_A keeps `<span class="tag tag-`, `">` and `</span>` OUTSIDE its capture
            # groups, so this row must be rebuilt explicitly. Joining m.groups() silently
            # drops those literals and destroys every tag span in the file.
            return (g[0] + g[1] + g[2] + g[3] + g[4]
                    + f'<span class="tag tag-{new_cls}">{new_lbl}</span>'
                    + g[7] + new_note + g[9])

        cur_ds, cur_var, cur_lbl, cur_note = g[1], g[3], g[16], g[10]
        if pin:
            report.append(f"  {tag}  PINNED {cur_lbl!r} (JSON: {tk['status']}) -- {pin[3]}")
            counts["pins"] += 1
            new_ds, new_var, new_lbl = cur_ds, cur_var, cur_lbl
        else:
            new_ds, new_var, new_lbl = STATUS_B[tk["status"]]
            if (new_ds, new_var, new_lbl) != (cur_ds, cur_var, cur_lbl):
                report.append(f"  {tag}  {cur_lbl!r} -> {new_lbl!r} ({tk['status']}"
                              f"{', duplicate slot' if dup else ''})")
                counts["status"] += 1
        g[1], g[3], g[14], g[16] = new_ds, new_var, new_var, new_lbl
        if want_notes and not dup:
            cand = condense(tk["note"], NOTE_LIMIT["B"])
            if cand and cand != (cur_note or ""):
                # Group 10 is optional, so a note-less card gains one here.
                g[9] = f'<div class="note">{cand}</div>'
                g[10] = cand
                counts["notes"] += 1
        # Group 10 is NESTED inside the optional group 9 (`(<div class="note">(.*?)</div>)?`),
        # so joining every group would emit the note text twice and wreck the card. Rebuild
        # explicitly, skipping the nested capture; g[9] is '' when the card has no note.
        return ("".join(g[0:9]) + (g[9] or "") + "".join(g[11:18]))

    new = rx.sub(fn, text)

    cur_stamp = STAMP.search(new)
    old_stamp_txt = cur_stamp.group(0)[len("<strong>As of "):-len("</strong>")]
    if old_stamp_txt != stamp:
        report.append(f"  As of: {old_stamp_txt!r} -> {stamp!r}")
    new = STAMP.sub(f"<strong>As of {stamp}</strong>", new)

    # G6 -- a >10% size swing means something went badly wrong.
    if abs(len(new) - len(text)) >= 0.10 * len(text):
        raise Fail(f"file {key}: output size changed by >=10% -- refusing to write")

    # G8, post-condition: the output must still parse as the same shape as the input.
    # This is the net that catches a reconstruction bug -- e.g. re-emitting a row by joining
    # m.groups() when the pattern keeps literals outside its groups, which silently strips
    # every tag span and leaves a file no future run can match. Caught exactly that once.
    if len((ROW_A if key == "A" else CARD_B).findall(new)) != EXPECTED_SLOTS[key]:
        raise Fail(f"file {key}: rewrite produced {len((ROW_A if key == 'A' else CARD_B).findall(new))} "
                   f"matchable slots, expected {EXPECTED_SLOTS[key]} -- refusing to write "
                   f"(the reconstruction dropped markup)")
    if len(STAMP.findall(new)) != 1:
        raise Fail(f"file {key}: rewrite left {len(STAMP.findall(new))} 'As of' stamps")
    return new, report, counts


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true",
                    help="compute everything, write nothing, exit 1 if anything would change")
    ap.add_argument("--notes", action="store_true",
                    help="also sync note cells (off by default: note cells carry markup "
                         "the JSON cannot reproduce)")
    ap.add_argument("--strict-orphans", action="store_true",
                    help="exit 1 if a JSON ticket has no timeline slot")
    ap.add_argument("--file", choices=["A", "B"], help="limit to one file")
    args = ap.parse_args()

    try:
        tickets, stamp, status_counts = load_tickets()
    except Fail as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    targets = [("A", FILE_A), ("B", FILE_B)]
    if args.file:
        targets = [t for t in targets if t[0] == args.file]

    total = Counter()
    would_change = False
    all_slot_ids: set[str] = set()

    # Guard EVERY file before writing ANY of them, so a failure in B cannot leave A half done.
    loaded = []
    for key, path in targets:
        text = path.read_text(encoding="utf-8")
        try:
            ids = guard_slots(key, text, tickets)
        except Fail as exc:
            print(f"ERROR: {exc}", file=sys.stderr)
            return 2
        all_slot_ids.update(ids)
        loaded.append((key, path, text))

    for key, path, text in loaded:
        try:
            new, report, counts = rewrite(key, text, tickets, stamp, args.notes)
        except Fail as exc:
            print(f"ERROR: {exc}", file=sys.stderr)
            return 2

        changed = new != text
        would_change = would_change or changed
        verb = "would write" if args.check else ("written" if changed else "unchanged")
        print(f"{path.relative_to(ROOT)} -- {EXPECTED_SLOTS[key]} slots, "
              f"{counts['status']} status writes, {counts['pins']} pin(s) held, "
              f"{counts['notes']} note writes [{verb}]")
        for line in report:
            print(line)

        if key == "A":
            print("  unmanaged: 'Where we stand today' date (line ~278), mastergantt "
                  "(362-728), D-02/D-03 rows, external-blockers table")
        else:
            print("  unmanaged: .pulse tiles (~1363-1375) and .ch-counts chapter chips "
                  "(~1793, 1889, 1923, 1949) -- these can contradict the synced cards")

        if changed and not args.check:
            path.write_text(new, encoding="utf-8")
        total.update(counts)

    orphans = sorted(set(tickets) - all_slot_ids)
    if orphans and not args.file:
        print(f"orphans (JSON tickets with no timeline slot, {len(orphans)}): "
              f"{', '.join(orphans)}")
        print("  not injected on purpose: every slot lives in a hand-authored phase "
              "container and the JSON offers no mapping to one")

    print(f"SUMMARY: {len(loaded)} file(s), {total['status']} status slots, "
          f"{total['pins']} pin(s) held, {total['notes']} note writes, "
          f"{len(orphans)} orphans | JSON: "
          + " ".join(f"{k}={v}" for k, v in sorted(status_counts.items())))

    if args.check and would_change:
        print("--check: timelines are STALE relative to launch-plan-data.json", file=sys.stderr)
        return 1
    if args.strict_orphans and orphans:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
