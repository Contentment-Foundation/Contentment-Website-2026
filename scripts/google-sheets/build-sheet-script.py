#!/usr/bin/env python3
"""Regenerate LaunchPlanSheet.gs with embedded JSON from launch-plan-data.json."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "docs/planning/launch-plan-data.json"
OUT_FILE = Path(__file__).resolve().parent / "LaunchPlanSheet.gs"

TEMPLATE_HEAD = (OUT_FILE.read_text().split("const EMBEDDED_JSON = ")[0] if OUT_FILE.exists() else None)

def main():
    data = json.loads(DATA_FILE.read_text())
    embedded = json.dumps(data, separators=(",", ":"))

    if TEMPLATE_HEAD is None:
        print("Run initial generation first; LaunchPlanSheet.gs must exist.")
        return 1

    tail = OUT_FILE.read_text().split("const EMBEDDED_JSON = ", 1)[1]
    tail = tail[tail.index(";") + 1 :]  # drop old JSON literal
    OUT_FILE.write_text(TEMPLATE_HEAD + "const EMBEDDED_JSON = " + repr(embedded) + ";" + tail)
    print(f"Updated embedded JSON in {OUT_FILE}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
