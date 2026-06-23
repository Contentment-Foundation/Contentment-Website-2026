#!/usr/bin/env bash
# Copy docs/*.html into site/docs/ for local preview and Netlify publish.
# Source of truth: docs/ — site/docs/ is gitignored build output.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p site/docs/tech-brief site/docs/team-brief site/docs/growth-brief site/docs/automation-brief

cp docs/index.html site/docs/index.html
cp docs/drive-links.js site/docs/drive-links.js
cp docs/TECH-BRIEF.html site/docs/tech-brief/index.html
cp docs/TEAM-BRIEF.html site/docs/team-brief/index.html
cp docs/GROWTH-BRIEF.html site/docs/growth-brief/index.html
cp docs/AUTOMATION-BRIEF.html site/docs/automation-brief/index.html

echo "Copied docs → site/docs/ (ready for local server or Netlify publish)"
