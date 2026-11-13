const { pool } = require('../db');

function parseId(param) {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

async function ordersRoutes(fastify) {
  fastify.get('/', async () => {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id');
    return r.rows;
  });

  fastify.get('/:id', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id=$1', [id]);
    if (r.rows.length === 0) {
      reply.code(404);
      return { error: 'not found' };
    }
    return r.rows[0];
  });

  fastify.post('/', async (req, reply) => {
    const { user_id, status, total } = req.body || {};
    const userId = user_id === undefined ? null : user_id;
    const r = await pool.query(
      'INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, user_id, status, total::float8 AS total, created_at',
      [userId, status, total]
    );
    reply.code(201);
    return r.rows[0];
  });

  fastify.get('/:id/items', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    const r = await pool.query(
      'SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id=$1 ORDER BY id',
      [id]
    );
    return r.rows;
  });
}

module.exports = ordersRoutes;