#!/usr/bin/env bash
# Start the shared Postgres container and all 15 apps.
# Each app logs to .run/logs/<app>.log. Press Ctrl+C to stop everything.
set -euo pipefail
set -m
cd "$(dirname "$0")"

RUN_DIR=".run"
LOG_DIR="$RUN_DIR/logs"
PID_FILE="$RUN_DIR/pids"
PORTS=(8001 8002 8003 8004 8005 8006 8007 8008 8009 8010 8011 8012 8013 8014 8015)

mkdir -p "$LOG_DIR"
: >"$PID_FILE"

conflicts=0
for port in "${PORTS[@]}"; do
  if ss -ltn 2>/dev/null | grep -q ":$port "; then
    echo "ERROR: port $port is already in use; stop that process first." >&2
    conflicts=1
  fi
done
if [ "$conflicts" -ne 0 ]; then
  echo "Aborting before starting any app." >&2
  exit 1
fi

echo "Starting Postgres..."
docker compose up -d
printf 'Waiting for Postgres'
for _ in $(seq 1 60); do
  if docker exec shared-postgres pg_isready -U app -d appdb >/dev/null 2>&1; then
    break
  fi
  printf '.'
  sleep 1
done
echo

echo
echo "Starting apps:"
start() {
  name="$1"
  port="$2"
  dir="$3"
  shift 3
  (cd "$dir" && exec env PORT="$port" "$@") >"$LOG_DIR/$name.log" 2>&1 &
  echo "$! $name $port" >>"$PID_FILE"
  printf '  %-12s http://localhost:%s\n' "$name" "$port"
}

start gin        8001 go-gin          go run ./cmd/server
start echo       8002 go-echo         go run .
start fiber      8003 go-fiber        go run ./cmd/api
start axum       8004 rust-axum       cargo run
start actix      8005 rust-actix      cargo run
start springboot 8006 java-springboot mvn -q spring-boot:run
start dotnet     8007 csharp-dotnet   dotnet run --no-launch-profile
start nodejs     8008 node-nodejs     node src/server.js
start fastify    8009 node-fastify    node src/server.js
start nestjs     8010 node-nestjs     node dist/main.js
start expressjs  8011 node-expressjs  node src/server.js
start hono       8012 bun-honojs      bun run src/index.ts
start elysia     8013 bun-elysiajs    bun run src/index.ts
start fastapi    8014 python-fastapi  python -m app.main
start django     8015 python-django   ./run.sh

stop_all() {
  echo
  echo "Stopping apps..."
  while read -r pid name port; do
    kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
    echo "  stopped $name ($port)"
  done <"$PID_FILE"
  rm -f "$PID_FILE"
}
trap 'stop_all; exit 0' INT TERM

echo
echo "Logs:  .run/logs/<app>.log"
echo "Stop:  ./stop-all.sh  (or Ctrl+C in this terminal)"
echo

wait
