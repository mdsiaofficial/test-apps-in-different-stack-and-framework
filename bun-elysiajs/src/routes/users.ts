import { Elysia, t } from 'elysia';
import { pool } from '../db';

function parseId(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

export const usersRoutes = new Elysia({ prefix: '/api/users' })
  .get('/', async ({ set }) => {
    try {
      const r = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
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
      const r = await pool.query('SELECT id, name, email, created_at FROM users WHERE id=$1', [id]);
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
    const { name, email } = body as any;
    try {
      const r = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name, email, created_at',
        [name, email]
      );
      set.status = 201;
      return r.rows[0];
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({ name: t.String(), email: t.String() }),
  })
  .put('/:id', async ({ params, body, set }) => {
    const id = parseId(params.id);
    if (id === null) {
      set.status = 400;
      return { error: 'invalid id' };
    }
    const { name, email } = body as any;
    try {
      const r = await pool.query(
        'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at',
        [name, email, id]
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
    body: t.Object({ name: t.String(), email: t.String() }),
  })
  .delete('/:id', async ({ params, set }) => {
    const id = parseId(params.id);
    if (id === null) {
      set.status = 400;
      return { error: 'invalid id' };
    }
    try {
      await pool.query('DELETE FROM users WHERE id=$1', [id]);
      return { deleted: true };
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  });