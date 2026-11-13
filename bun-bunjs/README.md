# bun-bunjs

Raw **Bun 1.4** HTTP server — `Bun.serve()` for routing, `Bun.SQL` for
PostgreSQL. No framework, no `node_modules` runtime dependency, no build step:
Bun executes the TypeScript sources directly.

## Structure

```
bun-bunjs/
├── package.json          # scripts + @types/bun for `bun run typecheck`
├── tsconfig.json         # bun types, strict, noEmit
└── src/
    ├── server.ts         # Bun.serve({ routes }), JSON 404, graceful shutdown
    ├── routes.ts         # path + method table, params filled by Bun
    ├── db.ts             # Bun.SQL connection (DATABASE_URL)
    ├── handlers/         # one file per resource
    │   ├── health.ts
    │   ├── users.ts
    │   ├── categories.ts
    │   ├── products.ts
    │   ├── orders.ts
    │   ├── stats.ts
    │   └── search.ts
    └── utils/
        ├── body.ts       # readBody() -> {}/400 on bad JSON
        ├── parseId.ts    # numeric :id validation
        └── response.ts   # json()/notFound()/serverError()
```

## Run

```bash
bun run src/server.ts     # http://localhost:8012
# or
bun start
```

`PORT` (default `8012`) and `DATABASE_URL`
(default `postgres://app:app@localhost:5432/appdb`) are the only configuration.

No `bun install` is required to start the app — `Bun.serve` and `Bun.SQL` are
built into the runtime. Install dev dependencies only if you want type checking:

```bash
bun install
bun run typecheck
```

## Endpoints

Same 20 routes as every other app — see `../ROUTES.md`.

```bash
curl http://localhost:8012/health
curl http://localhost:8012/api/products
curl "http://localhost:8012/api/search?q=laptop"
curl http://localhost:8012/api/stats/summary
```
