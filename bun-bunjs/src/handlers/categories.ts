import { sql } from "../db";
import { readBody, type Params } from "../utils/body";
import { parseId } from "../utils/parseId";
import { errorResponse, json, notFound, serverError } from "../utils/response";

const COLUMNS = "id, name, COALESCE(description, '') AS description";

export async function list(): Promise<Response> {
  try {
    const rows = await sql`SELECT id, name, COALESCE(description, '') AS description FROM categories ORDER BY id`;
    return json(rows);
  } catch (e) {
    return serverError(e);
  }
}

export async function get(_req: Request, params: Params): Promise<Response> {
  const id = parseId(params.id);
  if (id === null) return json({ error: "invalid id" }, 400);
  try {
    const [row] = await sql`SELECT id, name, COALESCE(description, '') AS description FROM categories WHERE id = ${id}`;
    return row ? json(row) : notFound();
  } catch (e) {
    return serverError(e);
  }
}

export async function create(req: Request): Promise<Response> {
  try {
    const body = await readBody(req);
    const [row] = await sql`
      INSERT INTO categories (name, description)
      VALUES (${body.name ?? null}, ${body.description ?? null})
      RETURNING ${sql.unsafe(COLUMNS)}
    `;
    return json(row, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
