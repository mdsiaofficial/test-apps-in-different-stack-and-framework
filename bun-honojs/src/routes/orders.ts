import { Hono } from 'hono';
import { pool } from '../db';

const app = new Hono();

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

app.get('/', async (c) => {
  try {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id');
    return c.json(r.rows);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (id === null) return c.json({ error: 'invalid id' }, 400);
  try {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id=$1', [id]);
    if (r.rows.length === 0) return c.json({ error: 'not found' }, 404);
    return c.json(r.rows[0]);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as any;
  const { user_id, status, total } = body || {};
  const userId = user_id === undefined ? null : user_id;
  try {
    const r = await pool.query(
      'INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, user_id, status, total::float8 AS total, created_at',
      [userId, status, total]
    );
    return c.json(r.rows[0], 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/:id/items', async (c) => {
  const id = parseId(c.req.param('id'));
  if (id === null) return c.json({ error: 'invalid id' }, 400);
  try {
    const r = await pool.query(
      'SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id=$1 ORDER BY id',
      [id]
    );
    return c.json(r.rows);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
