import { Elysia, t } from 'elysia';
import { pool } from '../db';

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

export const ordersRoutes = new Elysia({ prefix: '/api/orders' })
  .get('/', async ({ set }) => {
    try {
      const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id');
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
      const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id=$1', [id]);
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
    const { user_id, status, total } = body as any;
    const userId = user_id === undefined ? null : user_id;
    try {
      const r = await pool.query(
        'INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, user_id, status, total::float8 AS total, created_at',
        [userId, status, total]
      );
      set.status = 201;
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({ user_id: t.Number(), status: t.String(), total: t.Number() }),
  })
  .get('/:id/items', async ({ params, set }) => {
    const id = parseId(params.id);
    if (id === null) {
      set.status = 400;
      return { error: 'invalid id' };
    }
    try {
      const r = await pool.query(
        'SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id=$1 ORDER BY id',
        [id]
      );
      return r.rows;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  });