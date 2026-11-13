# Running the applications

This repo contains 15 backend apps sharing one PostgreSQL database. Each app
implements the same 20 endpoints (see `ROUTES.md`) and listens on its own port.

| App | Folder | Port |
|-----|--------|------|
| Go + Gin | `go-gin` | 8001 |
| Go + Echo | `go-echo` | 8002 |
| Go + Fiber | `go-fiber` | 8003 |
| Rust + Axum | `rust-axum` | 8004 |
| Rust + Actix Web | `rust-actix` | 8005 |
| Java + Spring Boot | `java-springboot` | 8006 |
| C# + .NET 11 | `csharp-dotnet` | 8007 |
| Node + plain `http` | `node-nodejs` | 8008 |
| Node + Fastify | `node-fastify` | 8009 |
| Node + NestJS | `node-nestjs` | 8010 |
| Node + Express | `node-expressjs` | 8011 |
| Bun + Hono | `bun-honojs` | 8012 |
| Bun + Elysia | `bun-elysiajs` | 8013 |
| Python + FastAPI | `python-fastapi` | 8014 |
| Python + Django | `python-django` | 8015 |

Every app reads `DATABASE_URL` (default
`postgres://app:app@localhost:5432/appdb`) and `PORT` (defaults above).

---

## 1. Start the database

From the repo root:

```bash
docker compose up -d
docker compose ps
```

Wait for `shared-postgres` to become `healthy`. The tables and seed rows are
created from `db/init.sql` the first time the volume is initialised.

To wipe and re-seed the database (destructive):

```bash
docker compose down -v
docker compose up -d
```

---

## 2. Install dependencies (first run only)

`run-all.sh` does not install packages. Run the relevant commands once:

```bash
# Go
(cd go-gin   && go mod download)
(cd go-echo  && go mod download)
(cd go-fiber && go mod download)

# Rust (downloads crates; first build still compiles)
(cd rust-axum  && cargo fetch)
(cd rust-actix && cargo fetch)

# Java (downloads Maven deps)
(cd java-springboot && mvn -q compile)

# .NET
(cd csharp-dotnet && dotnet restore)

# Node
(cd node-nodejs    && npm install)
(cd node-fastify   && npm install)
(cd node-nestjs    && npm install && npm run build)
(cd node-expressjs && npm install)

# Bun
(cd bun-honojs   && bun install)
(cd bun-elysiajs && bun install)

# Python (use `python`, not `python3`)
(cd python-fastapi && python -m pip install -r requirements.txt)
(cd python-django  && python -m pip install -r requirements.txt)
```

---

## 3. Run everything at once

From the repo root:

```bash
chmod +x run-all.sh stop-all.sh   # once
./run-all.sh
```

The script:

1. checks that ports 8001–8015 are free,
2. starts Postgres with `docker compose up -d` and waits for readiness,
3. starts all 15 apps in the background,
4. streams nothing to the terminal — each app logs to `.run/logs/<app>.log`.

Press **Ctrl+C** in that terminal to stop all apps. You can also stop them from
another terminal:

```bash
./stop-all.sh
```

Both scripts only stop the apps; Postgres keeps running. First startup can take
a few minutes because Rust, Java and .NET compile; follow progress with:

```bash
tail -f .run/logs/springboot.log
tail -f .run/logs/axum.log
```

PIDs are recorded in `.run/pids` (ignored by git).

---

## 4. Run applications separately

Every app is independent — start only the ones you need. Use one terminal per
app (or `nohup`/tmux).

```bash
# Go
(cd go-gin   && go run ./cmd/server)      # 8001
(cd go-echo  && go run .)                 # 8002
(cd go-fiber && go run ./cmd/api)         # 8003

# Rust
(cd rust-axum  && cargo run)              # 8004
(cd rust-actix && cargo run)              # 8005

# Java
(cd java-springboot && mvn spring-boot:run)   # 8006

# C#
(cd csharp-dotnet && dotnet run)          # 8007

# Node
(cd node-nodejs    && npm start)          # 8008
(cd node-fastify   && npm start)          # 8009
(cd node-nestjs    && npm start)          # 8010 (run `npm run build` first)
(cd node-expressjs && npm start)          # 8011

# Bun
(cd bun-honojs   && bun start)            # 8012
(cd bun-elysiajs && bun start)            # 8013

# Python (use `python`, not `python3`)
(cd python-fastapi && python -m app.main) # 8014
(cd python-django  && ./run.sh)           # 8015
```

To run an app on a different port, override `PORT`:

```bash
(cd node-expressjs && PORT=9100 npm start)
(cd go-gin && PORT=9101 go run ./cmd/server)
(cd python-django && PORT=9102 ./run.sh)
```

Point an app at another database with `DATABASE_URL`:

```bash
DATABASE_URL=postgres://app:app@localhost:5432/appdb npm start
```

Stop an app with **Ctrl+C** in its terminal.

---

## 5. Check that it works

Single app:

```bash
curl http://localhost:8001/health
curl http://localhost:8001/api/users
curl "http://localhost:8001/api/search?q=laptop"
curl http://localhost:8001/api/stats/summary
```

All ports at once:

```bash
for p in $(seq 8001 8015); do
  printf '%s: ' "$p"
  curl -s --max-time 2 "http://localhost:$p/health" || echo "not running"
  echo
done
```

Expected: each running app answers `{"status":"ok"}` (Spring Boot returns
`{"status":"ok"}` as well). The full endpoint contract is in `ROUTES.md`.

---

## 6. Stop everything

```bash
./stop-all.sh          # all apps started by run-all.sh
docker compose down    # Postgres (keeps data)
```

`docker compose down -v` also deletes the database volume.

---

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `run-all.sh` exits with "port … already in use" | Stop whatever holds that port (`ss -ltn`), or start that app manually with `PORT=<free port>`. |
| NestJS cannot bind 8010 | Something else is using 8010; run it separately with `PORT=8090 npm start` or free the port. |
| `ECONNREFUSED 127.0.0.1:5432` | Postgres is not up: `docker compose up -d` and wait for `healthy`. |
| Python `ModuleNotFoundError` | Install with `python -m pip install -r requirements.txt` inside that app folder. |
| `python3` is not the right version | Use `python` (3.15) as shown above — `python3` is 3.8 on this machine. |
| `./run.sh: Permission denied` | `chmod +x python-django/run.sh`. |
| Spring Boot / Rust take long on first start | Normal — they compile first. Watch `.run/logs/<app>.log`. |
| Empty lists after a fresh DB | Ensure the volume was initialised with `db/init.sql`; reset with `docker compose down -v && docker compose up -d`. |
