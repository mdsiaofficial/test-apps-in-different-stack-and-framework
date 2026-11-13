import { Elysia } from 'elysia';
import { pool } from '../db';

export const statsRoutes = new Elysia({ prefix: '/api/stats' })
  .get('/summary', async ({ set }) => {
    try {
      const r = await pool.query(
        "SELECT (SELECT COUNT(*)::int FROM users) AS users, (SELECT COUNT(*)::int FROM products) AS products, (SELECT COUNT(*)::int FROM orders) AS orders, COALESCE((SELECT SUM(total) FROM orders),0)::float8 AS revenue"
      );
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  });