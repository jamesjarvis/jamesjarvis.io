#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="${CONTENT_DIR:-$REPO_DIR/content}"

for env_file in /etc/site-deploy.env "$HOME/.config/site-deploy.env"; do
  if [ -f "$env_file" ]; then
    set -a
    . "$env_file"
    set +a
  fi
done

: "${RESTIC_REPOSITORY:?RESTIC_REPOSITORY is not set}"
: "${RESTIC_PASSWORD:?RESTIC_PASSWORD is not set}"

restic backup "$CONTENT_DIR" \
  --tag jamesjarvis.io-content \
  --exclude '.DS_Store' \
  --exclude '.obsidian'

restic forget \
  --tag jamesjarvis.io-content \
  --keep-daily 14 \
  --keep-weekly 8 \
  --keep-monthly 24 \
  --prune

restic check --read-data-subset=1%
