#!/usr/bin/env bash
set -euo pipefail

PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export PATH

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="${CONTENT_DIR:-$REPO_DIR/content}"
STAMP_FILE="${STAMP_FILE:-$REPO_DIR/.last-sync}"
MAX_SYNC_AGE_HOURS="${MAX_SYNC_AGE_HOURS:-24}"

for env_file in /etc/site-deploy.env "$HOME/.config/site-deploy.env"; do
  if [ -f "$env_file" ]; then
    set -a
    . "$env_file"
    set +a
  fi
done

: "${RESTIC_REPOSITORY:?RESTIC_REPOSITORY is not set}"

if [ -z "${RESTIC_PASSWORD:-}" ] && [ -z "${RESTIC_PASSWORD_COMMAND:-}" ] && [ -z "${RESTIC_PASSWORD_FILE:-}" ]; then
  echo "backup: set RESTIC_PASSWORD, RESTIC_PASSWORD_COMMAND or RESTIC_PASSWORD_FILE" >&2
  exit 1
fi

maintain=false
for arg in "$@"; do
  case "$arg" in
    --maintain) maintain=true ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

NTFY_TOPIC="${NTFY_TOPIC:-}"

notify() {
  echo "backup: $1" >&2
  if [ -n "$NTFY_TOPIC" ]; then
    curl -fsS -H "Title: jamesjarvis.io backup" -d "$1" "https://ntfy.sh/$NTFY_TOPIC" >/dev/null || true
  fi
}

trap 'notify "backup FAILED on $(hostname)"' ERR

[ -d "$CONTENT_DIR" ] || { notify "no content directory at $CONTENT_DIR"; exit 1; }

if [ -f "$STAMP_FILE" ]; then
  age_hours=$(( ( $(date +%s) - $(cat "$STAMP_FILE") ) / 3600 ))
  if [ "$age_hours" -gt "$MAX_SYNC_AGE_HOURS" ]; then
    notify "iCloud mirror is ${age_hours}h stale, backing it up anyway - check sync-icloud"
  fi
else
  notify "no sync stamp found, mirror freshness unknown"
fi

if [ "$maintain" = true ]; then
  restic forget \
    --tag jamesjarvis.io-content \
    --keep-daily 14 \
    --keep-weekly 8 \
    --keep-monthly 24 \
    --prune
  restic check --read-data-subset=1%
  echo "backup: maintenance done"
  exit 0
fi

restic backup "$CONTENT_DIR" \
  --tag jamesjarvis.io-content \
  --exclude '.DS_Store' \
  --exclude-caches

restic forget \
  --tag jamesjarvis.io-content \
  --keep-daily 14 \
  --keep-weekly 8 \
  --keep-monthly 24

echo "backup: done"
