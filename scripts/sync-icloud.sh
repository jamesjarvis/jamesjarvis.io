#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAULT="${CONTENT_VAULT:-$HOME/Library/Mobile Documents/com~apple~CloudDocs/jamesjarvis.io-content}"
MIRROR="${CONTENT_DIR:-$REPO_DIR/content}"
STUB_WAIT_SECONDS="${STUB_WAIT_SECONDS:-300}"

die() {
  echo "sync-icloud: $*" >&2
  exit 1
}

count_stubs() {
  find "$VAULT" -type f -name '*.icloud' | wc -l | tr -d ' '
}

[ -d "$VAULT" ] || die "vault not found at $VAULT"

if [ "$(count_stubs)" -gt 0 ]; then
  echo "sync-icloud: $(count_stubs) evicted files, requesting download"
  brctl download "$VAULT" || true

  deadline=$((SECONDS + STUB_WAIT_SECONDS))
  while [ "$(count_stubs)" -gt 0 ] && [ "$SECONDS" -lt "$deadline" ]; do
    sleep 10
  done

  remaining="$(count_stubs)"
  [ "$remaining" -eq 0 ] || die "aborting: $remaining files still evicted from iCloud, mirroring would publish empty files"
fi

mkdir -p "$MIRROR"
rsync -a --delete \
  --exclude '.obsidian' \
  --exclude '.DS_Store' \
  --exclude '.git' \
  --exclude '.stfolder' \
  --exclude '.stversions' \
  --exclude '.stignore' \
  "$VAULT/" "$MIRROR/"

date +%s > "$REPO_DIR/.last-sync"

echo "sync-icloud: mirrored $VAULT -> $MIRROR"
