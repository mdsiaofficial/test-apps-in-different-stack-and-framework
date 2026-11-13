import { Hono } from 'hono';
import { pool } from '../db';

const app = new Hono();

app.get('/summary', async (c) => {
  try {
    const r = await pool.query(
      "SELECT (SELECT COUNT(*)::int FROM users) AS users, (SELECT COUNT(*)::int FROM products) AS products, (SELECT COUNT(*)::int FROM orders) AS orders, COALESCE((SELECT SUM(total) FROM orders),0)::float8 AS revenue"
    );
    return c.json(r.rows[0]);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
