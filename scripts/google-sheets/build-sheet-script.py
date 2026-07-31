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
    updated, count = BLOCK_RE.subn(block, original, count=1)
    if count != 1:
        print("Could not find BEGIN_EMBEDDED_DATA / END_EMBEDDED_DATA markers.")
        return 1

    OUT_FILE.write_text(updated)
    print(f"Updated EMBEDDED_DATA in {OUT_FILE}")
    print(f"  version={data.get('meta', {}).get('version')} keys={len(data)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
