#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

CONTENT_DIR="${CONTENT_DIR:-$REPO_DIR/content}"
STATE_FILE="${STATE_FILE:-$REPO_DIR/.build-state}"

for env_file in /etc/site-deploy.env "$HOME/.config/site-deploy.env"; do
  if [ -f "$env_file" ]; then
    set -a
    . "$env_file"
    set +a
  fi
done

CF_PAGES_PROJECT="${CF_PAGES_PROJECT:-jamesjarvis-io}"
NTFY_TOPIC="${NTFY_TOPIC:-}"

force=false
deploy=true
for arg in "$@"; do
  case "$arg" in
    --force) force=true ;;
    --no-deploy) deploy=false ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

notify_failure() {
  local stage="$1"
  echo "build-deploy: FAILED during $stage" >&2
  if [ -n "$NTFY_TOPIC" ]; then
    curl -fsS -H "Title: jamesjarvis.io build failed" \
      -d "Failed during $stage on $(hostname)" \
      "https://ntfy.sh/$NTFY_TOPIC" >/dev/null || true
  fi
}

stage="startup"
trap 'notify_failure "$stage"' ERR

if command -v mise >/dev/null 2>&1; then
  eval "$(mise env -s bash)"
fi

stat_line() {
  if stat -c '%n %Y %s' "$REPO_DIR" >/dev/null 2>&1; then
    xargs -0 stat -c '%n %Y %s'
  else
    xargs -0 stat -f '%N %m %z'
  fi
}

current_state() {
  git rev-parse HEAD
  git status --porcelain
  find "$CONTENT_DIR" -type f ! -name '.DS_Store' -print0 | stat_line | sort
}

if [ ! -d "$CONTENT_DIR" ]; then
  stage="content check"
  echo "build-deploy: no content directory at $CONTENT_DIR" >&2
  notify_failure "$stage"
  exit 1
fi

state="$(current_state | shasum -a 256 | cut -d' ' -f1)"

if [ "$force" = false ] && [ -f "$STATE_FILE" ] && [ "$state" = "$(cat "$STATE_FILE")" ]; then
  echo "build-deploy: no changes since last successful build"
  exit 0
fi

stage="hugo build"
hugo --minify --gc

stage="post build"
bash scripts/post_build.sh

if [ "$deploy" = true ]; then
  stage="cloudflare deploy"
  if command -v bunx >/dev/null 2>&1; then
    runner=(bunx wrangler@4)
  else
    runner=(npx --yes wrangler@4)
  fi
  wrangler_dir="${XDG_CACHE_HOME:-$HOME/.cache}/jamesjarvis.io-wrangler"
  mkdir -p "$wrangler_dir"
  ( cd "$wrangler_dir" && "${runner[@]}" pages deploy "$REPO_DIR/public" \
      --project-name "$CF_PAGES_PROJECT" \
      --branch main \
      --commit-dirty=true )
fi

echo "$state" > "$STATE_FILE"
echo "build-deploy: done"
