#!/usr/bin/env bash
# Stop every app started by ./run-all.sh. Postgres is left running.
set -uo pipefail
cd "$(dirname "$0")"

PID_FILE=".run/pids"
if [ ! -f "$PID_FILE" ]; then
  echo "Nothing to stop (.run/pids not found)."
  exit 0
fi

while read -r pid name port; do
  if kill -0 "$pid" 2>/dev/null; then
    kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
    echo "stopped $name ($port)"
  else
    echo "$name ($port) was not running"
  fi
done <"$PID_FILE"
rm -f "$PID_FILE"
