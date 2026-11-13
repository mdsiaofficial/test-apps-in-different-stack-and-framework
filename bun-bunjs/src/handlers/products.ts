import { sql } from "../db";
import { readBody, type Params } from "../utils/body";
import { parseId } from "../utils/parseId";
import { errorResponse, json, notFound, serverError } from "../utils/response";

// DECIMAL comes back as a string from PostgreSQL; cast so responses match the
// numeric shape every other app returns.
const COLUMNS = "id, name, price::float8 AS price, category_id, created_at";

export async function list(): Promise<Response> {
  try {
    const rows = await sql`SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id`;
    return json(rows);
  } catch (e) {
    return serverError(e);
  }
}

export async function get(_req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    const [row] = await sql`SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id = ${id}`;
    return row ? json(row) : notFound();
  } catch (e) {
    return serverError(e);
  }
}

export async function create(req: Request): Promise<Response> {
  try {
    const body = await readBody(req);
    const [row] = await sql`
      INSERT INTO products (name, price, category_id)
      VALUES (${body.name ?? null}, ${body.price ?? null}, ${body.category_id ?? null})
      RETURNING ${sql.unsafe(COLUMNS)}
    `;
    return json(row, 201);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function update(req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    const body = await readBody(req);
    const [row] = await sql`
      UPDATE products
      SET name = ${body.name ?? null},
          price = ${body.price ?? null},
          category_id = ${body.category_id ?? null}
      WHERE id = ${id}
      RETURNING ${sql.unsafe(COLUMNS)}
    `;
    return row ? json(row) : notFound();
  } catch (e) {
    return errorResponse(e);
  }
}

export async function remove(_req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    return json({ deleted: true });
  } catch (e) {
    return serverError(e);
  }
}
