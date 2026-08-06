#!/usr/bin/env python3
"""Regenerate LaunchPlanSheet.gs embedded data from launch-plan-data.json."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "docs/planning/launch-plan-data.json"
OUT_FILE = Path(__file__).resolve().parent / "LaunchPlanSheet.gs"

BEGIN = "// BEGIN_EMBEDDED_DATA"
END = "// END_EMBEDDED_DATA"

BLOCK_RE = re.compile(
    re.escape(BEGIN) + r".*?" + re.escape(END),
    re.DOTALL,
)


# Tables whose first column is an ID and which must read in ascending order on the Sheet.
ID_TABLES = ("tickets", "handoffChecklist", "decisions", "reviewFeedback")
ID_RE = re.compile(r"([A-Z]+)-(\d+)")


def _id_key(row_id: str):
    """Natural sort: prefix alphabetically, then number NUMERICALLY.

    Plain string sort is wrong here -- it puts HC-100 before HC-20, and would order
    FEAT-1000 before FEAT-2. The number has to be compared as an int.
    """
    m = ID_RE.match(row_id)
    return (m.group(1), int(m.group(2))) if m else (row_id, 0)


def sort_id_tables(data: dict) -> list[str]:
    """Sort ID-keyed tables ascending, in place. Returns a report of what moved.

    Why this lives in the generator rather than being a one-off tidy: rows get APPENDED
    when they are created (HC-027/028/042/043/055-058 were, and by 6 Aug 2026 the Handoff
    Checklist read 001-068, then 027, 028, 042... which is unusable on the Sheet). Sorting
    here means the order can never drift again, whoever adds the next row and however they
    add it. Self-healing rather than a rule someone has to remember.
    """
    report = []
    for key in ID_TABLES:
        table = data.get(key)
        if not table or len(table) < 3:
            continue
        header, rows = table[0], table[1:]
        before = [r[0] for r in rows]
        if len(set(before)) != len(before):
            dupes = sorted({x for x in before if before.count(x) > 1})
            raise SystemExit(f"ERROR: duplicate ids in {key}: {dupes} -- refusing to write.")
        rows.sort(key=lambda r: _id_key(r[0]))
        after = [r[0] for r in rows]
        # Guard: sorting must only REORDER. Never gain, lose or mutate a row.
        if sorted(before) != sorted(after) or len(before) != len(after):
            raise SystemExit(f"ERROR: {key} row set changed while sorting -- refusing to write.")
        if before != after:
            data[key] = [header] + rows
            report.append(f"{key}: reordered ({sum(a != b for a, b in zip(before, after))} rows moved)")
    return report


def main() -> int:
    if not OUT_FILE.exists():
        print("Run initial generation first; LaunchPlanSheet.gs must exist.")
        return 1

    data = json.loads(DATA_FILE.read_text())

    # Normalise row order BEFORE embedding, and persist it back to the source so the JSON
    # and the Sheet always agree. ensure_ascii=False keeps em dashes readable in diffs --
    # a stray ensure_ascii=True once turned a two-line edit into a 554-line diff.
    if moved := sort_id_tables(data):
        DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
        for line in moved:
            print(f"  sorted {line}")
    # json.dumps output is valid as a JS object/array literal for our data.
    embedded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    block = (
        f"{BEGIN}\n"
        f"const EMBEDDED_DATA = {embedded};\n"
        f"{END}"
    )

    original = OUT_FILE.read_text()
    # Replacement MUST be a callable. Passing `block` as a plain string makes
    # re.subn expand backslash escapes in it, so every "\n" inside the JSON
    # (backslash + n) became a real newline and split the JS literal across
    # lines — invalid JavaScript, silently. That broke EMBEDDED_DATA the first
    # time a note contained a line break (4 Aug 2026); "\\" and "\g" would
    # corrupt it too. A lambda disables escape processing entirely.
    updated, count = BLOCK_RE.subn(lambda _match: block, original, count=1)
    if count != 1:
        print("Could not find BEGIN_EMBEDDED_DATA / END_EMBEDDED_DATA markers.")
        return 1

    # Guard: the embedded literal must stay on ONE line and round-trip as JSON.
    # EMBEDDED_DATA is the Sheet's offline fallback, so a corrupt literal only
    # surfaces when GitHub is unreachable — exactly when it is needed most.
    if "\n" in embedded:
        print("ERROR: embedded literal contains raw newlines — refusing to write.")
        return 1
    try:
        json.loads(embedded)
    except ValueError as exc:
        print(f"ERROR: embedded literal is not valid JSON ({exc}) — refusing to write.")
        return 1

    OUT_FILE.write_text(updated)
    print(f"Updated EMBEDDED_DATA in {OUT_FILE}")
    print(f"  version={data.get('meta', {}).get('version')} keys={len(data)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
