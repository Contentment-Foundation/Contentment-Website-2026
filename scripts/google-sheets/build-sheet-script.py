#!/usr/bin/env python3
"""Regenerate LaunchPlanSheet.gs with embedded JSON from launch-plan-data.json."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "docs/planning/launch-plan-data.json"
OUT_FILE = Path(__file__).resolve().parent / "LaunchPlanSheet.gs"

# Matches a full single-quoted JS string literal, respecting backslash escapes,
# so it stops at the literal's real closing quote instead of the first ';'
# inside the string content (launch-plan-data.json text fields routinely
# contain literal semicolons, e.g. "Complexity; region-scroll covers v1").
EMBEDDED_JSON_RE = re.compile(r"const EMBEDDED_JSON = '(?:[^'\\]|\\.)*';", re.DOTALL)


def main():
    if not OUT_FILE.exists():
        print("Run initial generation first; LaunchPlanSheet.gs must exist.")
        return 1

    data = json.loads(DATA_FILE.read_text())
    embedded = json.dumps(data, separators=(",", ":"))
    new_declaration = "const EMBEDDED_JSON = " + repr(embedded) + ";"

    original = OUT_FILE.read_text()
    updated, count = EMBEDDED_JSON_RE.subn(new_declaration, original, count=1)
    if count != 1:
        print("Could not find an existing 'const EMBEDDED_JSON = ...;' statement to replace.")
        return 1

    OUT_FILE.write_text(updated)
    print(f"Updated embedded JSON in {OUT_FILE}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
