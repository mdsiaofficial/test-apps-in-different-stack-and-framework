import { sql } from "../db";
import { readBody, type Params } from "../utils/body";
import { parseId } from "../utils/parseId";
import { errorResponse, json, notFound, serverError } from "../utils/response";

const COLUMNS = "id, user_id, status, total::float8 AS total, created_at";

export async function list(): Promise<Response> {
  try {
    const rows = await sql`SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id`;
    return json(rows);
  } catch (e) {
    return serverError(e);
  }
}

export async function get(_req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    const [row] = await sql`SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id = ${id}`;
    return row ? json(row) : notFound();
  } catch (e) {
    return serverError(e);
  }
}

export async function create(req: Request): Promise<Response> {
  try {
    const body = await readBody(req);
    const [row] = await sql`
      INSERT INTO orders (user_id, status, total)
      VALUES (${body.user_id ?? null}, ${body.status ?? null}, ${body.total ?? null})
      RETURNING ${sql.unsafe(COLUMNS)}
    `;
    return json(row, 201);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function listItems(_req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    const rows = await sql`
      SELECT id, order_id, product_id, quantity, price::float8 AS price
      FROM order_items
      WHERE order_id = ${id}
      ORDER BY id
    `;
    return json(rows);
  } catch (e) {
    return serverError(e);
  }
}
