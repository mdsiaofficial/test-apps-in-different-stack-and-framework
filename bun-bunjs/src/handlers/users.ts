import { sql } from "../db";
import { readBody, type Params } from "../utils/body";
import { parseId } from "../utils/parseId";
import { errorResponse, json, notFound, serverError } from "../utils/response";

const COLUMNS = "id, name, email, created_at";

export async function list(): Promise<Response> {
  try {
    const rows = await sql`SELECT id, name, email, created_at FROM users ORDER BY id`;
    return json(rows);
  } catch (e) {
    return serverError(e);
  }
}

export async function get(req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    const [row] = await sql`SELECT id, name, email, created_at FROM users WHERE id = ${id}`;
    return row ? json(row) : notFound();
  } catch (e) {
    return serverError(e);
  }
}

export async function create(req: Request): Promise<Response> {
  try {
    const body = await readBody(req);
    const [row] = await sql`
      INSERT INTO users (name, email)
      VALUES (${body.name ?? null}, ${body.email ?? null})
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
      UPDATE users
      SET name = ${body.name ?? null}, email = ${body.email ?? null}
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
    await sql`DELETE FROM users WHERE id = ${id}`;
    return json({ deleted: true });
  } catch (e) {
    return serverError(e);
  }
}
