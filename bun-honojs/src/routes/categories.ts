import { Hono } from 'hono';
import { pool } from '../db';

const app = new Hono();

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

app.get('/', async (c) => {
  try {
    const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories ORDER BY id");
    return c.json(r.rows);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (id === null) return c.json({ error: 'invalid id' }, 400);
  try {
    const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories WHERE id=$1", [id]);
    if (r.rows.length === 0) return c.json({ error: 'not found' }, 404);
    return c.json(r.rows[0]);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as any;
  const { name, description } = body || {};
  try {
    const r = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id, name, COALESCE(description,'') AS description",
      [name, description]
    );
    return c.json(r.rows[0], 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
