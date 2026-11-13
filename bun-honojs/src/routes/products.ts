import { Hono } from 'hono';
import { pool } from '../db';

const app = new Hono();

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

app.get('/', async (c) => {
  try {
    const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id');
    return c.json(r.rows);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (id === null) return c.json({ error: 'invalid id' }, 400);
  try {
    const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id=$1', [id]);
    if (r.rows.length === 0) return c.json({ error: 'not found' }, 404);
    return c.json(r.rows[0]);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as any;
  const { name, price, category_id } = body || {};
  const categoryId = category_id === undefined ? null : category_id;
  try {
    const r = await pool.query(
      'INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING id, name, price::float8 AS price, category_id, created_at',
      [name, price, categoryId]
    );
    return c.json(r.rows[0], 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.put('/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (id === null) return c.json({ error: 'invalid id' }, 400);
  const body = (await c.req.json().catch(() => ({}))) as any;
  const { name, price, category_id } = body || {};
  const categoryId = category_id === undefined ? null : category_id;
  try {
    const r = await pool.query(
      'UPDATE products SET name=$1, price=$2, category_id=$3 WHERE id=$4 RETURNING id, name, price::float8 AS price, category_id, created_at',
      [name, price, categoryId, id]
    );
    if (r.rows.length === 0) return c.json({ error: 'not found' }, 404);
    return c.json(r.rows[0]);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.delete('/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (id === null) return c.json({ error: 'invalid id' }, 400);
  try {
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    return c.json({ deleted: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
