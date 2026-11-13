import * as categories from "./handlers/categories";
import { health } from "./handlers/health";
import * as orders from "./handlers/orders";
import * as products from "./handlers/products";
import { search } from "./handlers/search";
import { summary } from "./handlers/stats";
import * as users from "./handlers/users";
import type { Params } from "./utils/body";

type Req = Request & { params: Params };

/**
 * Route table consumed by `Bun.serve({ routes })` — Bun matches the paths and
 * fills `req.params` itself, so no hand-written router is needed.
 */
export const routes = {
  "/health": {
    GET: () => health(),
  },

  "/api/users": {
    GET: () => users.list(),
    POST: (req: Request) => users.create(req),
  },
  "/api/users/:id": {
    GET: (req: Req) => users.get(req, req.params),
    PUT: (req: Req) => users.update(req, req.params),
    DELETE: (req: Req) => users.remove(req, req.params),
  },

  "/api/categories": {
    GET: () => categories.list(),
    POST: (req: Request) => categories.create(req),
  },
  "/api/categories/:id": {
    GET: (req: Req) => categories.get(req, req.params),
  },

  "/api/products": {
    GET: () => products.list(),
    POST: (req: Request) => products.create(req),
  },
  "/api/products/:id": {
    GET: (req: Req) => products.get(req, req.params),
    PUT: (req: Req) => products.update(req, req.params),
    DELETE: (req: Req) => products.remove(req, req.params),
  },

  "/api/orders": {
    GET: () => orders.list(),
    POST: (req: Request) => orders.create(req),
  },
  "/api/orders/:id": {
    GET: (req: Req) => orders.get(req, req.params),
  },
  "/api/orders/:id/items": {
    GET: (req: Req) => orders.listItems(req, req.params),
  },

  "/api/stats/summary": {
    GET: () => summary(),
  },

  "/api/search": {
    GET: (req: Request) => search(req),
  },
};
