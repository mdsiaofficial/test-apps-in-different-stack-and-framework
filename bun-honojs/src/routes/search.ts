import { Hono } from 'hono';
import { pool } from '../db';

const app = new Hono();

app.get('/search', async (c) => {
  const q = c.req.query('q') != null ? String(c.req.query('q')) : '';
  try {
    const r = await pool.query(
      'SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id',
      ['%' + q + '%']
    );
    return c.json(r.rows);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
