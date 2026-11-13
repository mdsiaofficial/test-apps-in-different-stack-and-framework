import { sql } from "../db";
import { json, serverError } from "../utils/response";

export async function summary(): Promise<Response> {
  try {
    const [row] = await sql`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS users,
        (SELECT COUNT(*)::int FROM products) AS products,
        (SELECT COUNT(*)::int FROM orders) AS orders,
        COALESCE((SELECT SUM(total) FROM orders), 0)::float8 AS revenue
    `;
    return json(row);
  } catch (e) {
    return serverError(e);
  }
}
