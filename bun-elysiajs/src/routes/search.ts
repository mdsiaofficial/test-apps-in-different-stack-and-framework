import { Elysia } from 'elysia';
import { pool } from '../db';

export const searchRoutes = new Elysia({ prefix: '/api' })
  .get('/search', async ({ query, set }) => {
    const q = query.q != null ? String(query.q) : '';
    try {
      const r = await pool.query(
        'SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id',
        ['%' + q + '%']
      );
      return r.rows;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  });