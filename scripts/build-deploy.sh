#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

CONTENT_DIR="${CONTENT_DIR:-$REPO_DIR/content}"
STATE_FILE="${STATE_FILE:-$REPO_DIR/.build-state}"
FAILURE_STATE_FILE="${FAILURE_STATE_FILE:-$REPO_DIR/.build-failure-state}"
RENOTIFY_AFTER="${RENOTIFY_AFTER:-172800}" # 2 days

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
pull=false
for arg in "$@"; do
  case "$arg" in
    --force) force=true ;;
    --no-deploy) deploy=false ;;
    --pull) pull=true ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

# Output of every stage is kept so a failure notification can say what went wrong.
LOG_FILE="$(mktemp)"
trap 'rm -f "$LOG_FILE"' EXIT

# The ERR trap is not inherited by functions, so hand the status back to the
# caller rather than letting set -e exit from in here without notifying.
run() {
  local status=0
  "$@" 2>&1 | tee -a "$LOG_FILE" || status=$?
  return "$status"
}

# The lines that look like the actual error, or failing that the end of the log.
# ntfy turns bodies over 4096 bytes into an attachment, so keep well under that;
# the cause is usually at the end of the line, so trim from the front.
failure_detail() {
  local detail
  detail="$(grep -a -E '^(ERROR|Error|error|fatal|✘)|\[ERROR\]' "$LOG_FILE" | tail -n 5 || true)"
  if [ -z "$detail" ]; then
    detail="$(grep -a -v -E '^(WARN|INFO) ' "$LOG_FILE" | tail -n 15 || true)"
  fi
  printf '%s\n' "$detail" \
    | sed -e $'s/\x1b\\[[0-9;]*m//g' -e "s|$REPO_DIR/||g" \
    | tail -c 3000
}

# Alert when a failure is new or different from the last one alerted, and again
# every RENOTIFY_AFTER seconds for as long as the same failure persists, rather
# than on every five-minute retry. The state file holds: fingerprint, time of
# first failure, time of last alert. A successful run removes it.
notify_failure() {
  local stage="$1" code="${2:-1}"
  echo "build-deploy: FAILED during $stage (exit $code)" >&2
  [ -n "$NTFY_TOPIC" ] || return 0

  local commit detail fingerprint now last_fp="" first="" last_alert=""
  commit="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
  detail="$(failure_detail)"
  # Digits are masked so timestamps, durations and pids don't make the same error look new.
  fingerprint="$(printf '%s\n%s\n' "$stage" "$detail" | sed -E 's/[0-9]+/#/g' | shasum -a 256 | cut -d' ' -f1)"
  now="$(date +%s)"
  if [ -f "$FAILURE_STATE_FILE" ]; then
    read -r last_fp first last_alert < "$FAILURE_STATE_FILE" || true
    case "$first$last_alert" in
      '' | *[!0-9]*) last_fp="" ;;
    esac
  fi

  local title="jamesjarvis.io build failed: $stage" since=""
  if [ "$fingerprint" = "$last_fp" ]; then
    if [ $((now - last_alert)) -lt "$RENOTIFY_AFTER" ]; then
      echo "build-deploy: same failure as the last alert, not notifying again" >&2
      return 0
    fi
    title="jamesjarvis.io build still failing: $stage"
    since=", failing for $(((now - first) / 86400)) days"
  else
    first="$now"
  fi

  # Only record the alert if it was delivered, so an outage that also takes out
  # ntfy.sh is retried on the next run.
  if curl -fsS -H "Title: $title" \
    --data-binary "Failed during $stage on $(hostname) (exit $code, commit $commit$since)

${detail:-No output captured. See: journalctl -u site-build -n 50}" \
    "https://ntfy.sh/$NTFY_TOPIC" >/dev/null; then
    echo "$fingerprint $first $now" > "$FAILURE_STATE_FILE"
  fi
}

stage="startup"
trap 'notify_failure "$stage" "$?"' ERR

if command -v mise >/dev/null 2>&1; then
  eval "$(mise env -s bash)"
fi

if [ "$pull" = true ]; then
  stage="git fetch"
  if [ -n "$(git status --porcelain)" ]; then
    echo "build-deploy: working tree has local changes, not pulling"
  else
    branch="$(git rev-parse --abbrev-ref HEAD)"
    run git fetch --depth 1 origin "$branch"
    run git reset --hard FETCH_HEAD
    echo "build-deploy: updated to $(git rev-parse --short HEAD)"
  fi
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
  echo "build-deploy: no content directory at $CONTENT_DIR" | tee -a "$LOG_FILE" >&2
  notify_failure "$stage"
  exit 1
fi

state="$(current_state | shasum -a 256 | cut -d' ' -f1)"

if [ "$force" = false ] && [ -f "$STATE_FILE" ] && [ "$state" = "$(cat "$STATE_FILE")" ]; then
  echo "build-deploy: no changes since last successful build"
  rm -f "$FAILURE_STATE_FILE"
  exit 0
fi

stage="hugo build"
run hugo --minify --gc

stage="post build"
run bash scripts/post_build.sh

if [ "$deploy" = true ]; then
  stage="cloudflare deploy"
  if command -v bunx >/dev/null 2>&1; then
    runner=(bunx wrangler@4)
  else
    runner=(npx --yes wrangler@4)
  fi
  wrangler_dir="${XDG_CACHE_HOME:-$HOME/.cache}/jamesjarvis.io-wrangler"
  mkdir -p "$wrangler_dir"
  deploy_pages() {
    ( cd "$wrangler_dir" && "${runner[@]}" pages deploy "$REPO_DIR/public" \
        --project-name "$CF_PAGES_PROJECT" \
        --branch main \
        --commit-dirty=true )
  }
  run deploy_pages
fi

echo "$state" > "$STATE_FILE"
rm -f "$FAILURE_STATE_FILE"
echo "build-deploy: done"
