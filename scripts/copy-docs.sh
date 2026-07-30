#!/usr/bin/env bash
# Copy docs/briefs/*.html into <target>/docs/ (default site/docs/) for local
# preview and Netlify publish. Source of truth: docs/ — the target docs/ dir
# is gitignored build output either way.
# Usage: scripts/copy-docs.sh [target-dir]   (default: site/docs)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-site/docs}"

mkdir -p "$TARGET/tech-brief" "$TARGET/team-brief" "$TARGET/growth-brief" "$TARGET/automation-brief" "$TARGET/dev-timeline" "$TARGET/dev-timeline/classic"

cp docs/index.html      "$TARGET/index.html"
cp docs/drive-links.js  "$TARGET/drive-links.js"
cp docs/briefs/TECH-BRIEF.html       "$TARGET/tech-brief/index.html"
cp docs/briefs/TEAM-BRIEF.html       "$TARGET/team-brief/index.html"
cp docs/briefs/GROWTH-BRIEF.html     "$TARGET/growth-brief/index.html"
cp docs/briefs/AUTOMATION-BRIEF.html "$TARGET/automation-brief/index.html"
cp docs/briefs/dev-timelinev2.html   "$TARGET/dev-timeline/index.html"
cp docs/briefs/DEV-TIMELINE.html     "$TARGET/dev-timeline/classic/index.html"

echo "Copied docs → $TARGET/ (ready for local server or Netlify publish)"
