import { sql } from "../db";
import { json, serverError } from "../utils/response";

export async function search(req: Request): Promise<Response> {
  const term = new URL(req.url).searchParams.get("q") ?? "";
  try {
    const rows = await sql`
      SELECT id, name, price::float8 AS price, category_id, created_at
      FROM products
      WHERE name ILIKE ${"%" + term + "%"}
      ORDER BY id
    `;
    return json(rows);
  } catch (e) {
    return serverError(e);
  }
}
