i want you to create backend application using all of these tech/framework in dedicated folders including 1 postgres database, 5 relational tables/models, and related standard folder structure for every tech/framework (this maybe different in each) in every application and providing 20 different types of routes but identical in each application, so i can overview and check learn and understand quickly. nb: all the language environments installed into this machine. nb: for python: there installed 2 env. "python" = python3.15 and "python3" = python3.8 use python instead of python3 and for postgres database use a docker compose with postgres:18-alpine image.

language - backend
--------------------

Go1.27 - gin

Go1.27 - echo

Go1.27 - fiber

Rust1.100.0 - axum

Rust1.100.0 - actix

Java25 - springboot

CSharp - dotnet11

Node26 - nodejs

Node26 - fastify

Node26 - nestjs

Node26 - expressjs

Bun1.4.4 - bunjs

Bun1.4.4 - honojs

Bun1.4.4 - elysiajs

Python3.15 - fastapi

Python3.15 - django

---

## Implementation map

All 16 apps are implemented. They share one PostgreSQL database (see
`docker-compose.yml` + `db/init.sql`) and expose the same 20 routes
documented in `ROUTES.md`.

Start the database first:

```bash
docker compose up -d
```

| # | Folder | Stack | Port | Run |
|---|--------|-------|------|-----|
| 1 | `go-gin` | Go 1.27 + Gin | 8001 | `cd go-gin && go run ./cmd/server` |
| 2 | `go-echo` | Go 1.27 + Echo | 8002 | `cd go-echo && go run .` |
| 3 | `go-fiber` | Go 1.27 + Fiber | 8003 | `cd go-fiber && go run ./cmd/api` |
| 4 | `rust-axum` | Rust 1.100 + Axum | 8004 | `cd rust-axum && cargo run` |
| 5 | `rust-actix` | Rust 1.100 + Actix Web | 8005 | `cd rust-actix && cargo run` |
| 6 | `java-springboot` | Java 25 + Spring Boot | 8006 | `cd java-springboot && mvn spring-boot:run` |
| 7 | `csharp-dotnet` | C# / .NET 11 | 8007 | `cd csharp-dotnet && dotnet run` |
| 8 | `node-nodejs` | Node 26 (http + pg) | 8008 | `cd node-nodejs && npm install && npm start` |
| 9 | `node-fastify` | Node 26 + Fastify | 8009 | `cd node-fastify && npm install && npm start` |
| 10 | `node-nestjs` | Node 26 + NestJS | 8010 | `cd node-nestjs && npm install && npm run build && npm start` |
| 11 | `node-expressjs` | Node 26 + Express | 8011 | `cd node-expressjs && npm install && npm start` |
| 12 | `bun-bunjs` | Bun 1.4.4 raw `Bun.serve` + `Bun.SQL` (TS) | 8012 | `cd bun-bunjs && bun run src/server.ts` |
| 13 | `bun-honojs` | Bun 1.4.4 + Hono | 8013 | `cd bun-honojs && bun install && bun start` |
| 14 | `bun-elysiajs` | Bun 1.4.4 + Elysia | 8014 | `cd bun-elysiajs && bun install && bun start` |
| 15 | `python-fastapi` | Python 3.15 + FastAPI | 8015 | `cd python-fastapi && python -m pip install -r requirements.txt && python -m app.main` |
| 16 | `python-django` | Python 3.15 + Django | 8016 | `cd python-django && python -m pip install -r requirements.txt && ./run.sh` |

Every app reads `DATABASE_URL` (default
`postgres://app:app@localhost:5432/appdb`) and `PORT`.

### Database tables

`users`, `categories`, `products`, `orders`, `order_items` — created and seeded
by `db/init.sql` when the Postgres container is first initialised.

### Quick check

Each app answers `GET /health` with `{"status":"ok"}` and implements the same
request/response shapes listed in `ROUTES.md`.

