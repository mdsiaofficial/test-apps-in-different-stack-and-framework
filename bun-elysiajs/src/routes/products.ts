import { Elysia, t } from 'elysia';
import { pool } from '../db';

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

export const productsRoutes = new Elysia({ prefix: '/api/products' })
  .get('/', async ({ set }) => {
    try {
      const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id');
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
      const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id=$1', [id]);
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
    const { name, price, category_id } = body as any;
    const categoryId = category_id === undefined ? null : category_id;
    try {
      const r = await pool.query(
        'INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING id, name, price::float8 AS price, category_id, created_at',
        [name, price, categoryId]
      );
      set.status = 201;
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({ name: t.String(), price: t.Number(), category_id: t.Number() }),
  })
  .put('/:id', async ({ params, body, set }) => {
    const id = parseId(params.id);
    if (id === null) {
      set.status = 400;
      return { error: 'invalid id' };
    }
    const { name, price, category_id } = body as any;
    const categoryId = category_id === undefined ? null : category_id;
    try {
      const r = await pool.query(
        'UPDATE products SET name=$1, price=$2, category_id=$3 WHERE id=$4 RETURNING id, name, price::float8 AS price, category_id, created_at',
        [name, price, categoryId, id]
      );
      if (r.rows.length === 0) {
        set.status = 404;
        return { error: 'not found' };
      }
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({ name: t.String(), price: t.Number(), category_id: t.Number() }),
  })
  .delete('/:id', async ({ params, set }) => {
    const id = parseId(params.id);
    if (id === null) {
      set.status = 400;
      return { error: 'invalid id' };
    }
    try {
      await pool.query('DELETE FROM products WHERE id=$1', [id]);
      return { deleted: true };
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  });