#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="${CONTENT_DIR:-/srv/site/repo/content}"
DEBOUNCE_SECONDS="${DEBOUNCE_SECONDS:-15}"
BUILD_UNIT="${BUILD_UNIT:-site-build.service}"

exec inotifywait -r -m -q \
  -e modify -e create -e delete -e move \
  --exclude '(/\.stfolder|/\.stversions|/\.syncthing\.|\.tmp$)' \
  --format '%w%f' "$CONTENT_DIR" |
while read -r _; do
  while read -r -t "$DEBOUNCE_SECONDS" _; do :; done
  echo "watch-content: content settled, triggering $BUILD_UNIT"
  systemctl start --no-block "$BUILD_UNIT"
done
