import { Elysia, t } from 'elysia';
import { pool } from '../db';

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

export const categoriesRoutes = new Elysia({ prefix: '/api/categories' })
  .get('/', async ({ set }) => {
    try {
      const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories ORDER BY id");
      return r.rows;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  })
  .get('/:id', async ({ params, set }) => {
    const id = parseId(params.id);
    if (id === null) {
      set.status = 400;
      return { error: 'invalid id' };
    }
    try {
      const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories WHERE id=$1", [id]);
      if (r.rows.length === 0) {
        set.status = 404;
        return { error: 'not found' };
      }
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  })
  .post('/', async ({ body, set }) => {
    const { name, description } = body as any;
    try {
      const r = await pool.query(
        "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id, name, COALESCE(description,'') AS description",
        [name, description]
      );
      set.status = 201;
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({ name: t.String(), description: t.String() }),
  });