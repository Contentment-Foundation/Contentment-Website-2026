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


def main() -> int:
    if not OUT_FILE.exists():
        print("Run initial generation first; LaunchPlanSheet.gs must exist.")
        return 1

    data = json.loads(DATA_FILE.read_text())
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
