const { pool } = require('../db');

function parseId(param) {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

async function productsRoutes(fastify) {
  fastify.get('/', async () => {
    const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id');
    return r.rows;
  });

  fastify.get('/:id', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id=$1', [id]);
    if (r.rows.length === 0) {
      reply.code(404);
      return { error: 'not found' };
    }
    return r.rows[0];
  });

  fastify.post('/', async (req, reply) => {
    const { name, price, category_id } = req.body || {};
    const categoryId = category_id === undefined ? null : category_id;
    const r = await pool.query(
      'INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING id, name, price::float8 AS price, category_id, created_at',
      [name, price, categoryId]
    );
    reply.code(201);
    return r.rows[0];
  });

  fastify.put('/:id', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    const { name, price, category_id } = req.body || {};
    const categoryId = category_id === undefined ? null : category_id;
    const r = await pool.query(
      'UPDATE products SET name=$1, price=$2, category_id=$3 WHERE id=$4 RETURNING id, name, price::float8 AS price, category_id, created_at',
      [name, price, categoryId, id]
    );
    if (r.rows.length === 0) {
      reply.code(404);
      return { error: 'not found' };
    }
    return r.rows[0];
  });

  fastify.delete('/:id', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    return { deleted: true };
  });
}

module.exports = productsRoutes;