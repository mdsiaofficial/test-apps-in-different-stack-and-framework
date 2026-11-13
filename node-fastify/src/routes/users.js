const { pool } = require('../db');

function parseId(param) {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

async function usersRoutes(fastify) {
  fastify.get('/', async () => {
    const r = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    return r.rows;
  });

  fastify.get('/:id', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    const r = await pool.query('SELECT id, name, email, created_at FROM users WHERE id=$1', [id]);
    if (r.rows.length === 0) {
      reply.code(404);
      return { error: 'not found' };
    }
    return r.rows[0];
  });

  fastify.post('/', async (req, reply) => {
    const { name, email } = req.body || {};
    const r = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name, email, created_at',
      [name, email]
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
    const { name, email } = req.body || {};
    const r = await pool.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at',
      [name, email, id]
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
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    return { deleted: true };
  });
}

module.exports = usersRoutes;