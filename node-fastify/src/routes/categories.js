const { pool } = require('../db');

function parseId(param) {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

async function categoriesRoutes(fastify) {
  fastify.get('/', async () => {
    const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories ORDER BY id");
    return r.rows;
  });

  fastify.get('/:id', async (req, reply) => {
    const id = parseId(req.params.id);
    if (id === null) {
      reply.code(400);
      return { error: 'invalid id' };
    }
    const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories WHERE id=$1", [id]);
    if (r.rows.length === 0) {
      reply.code(404);
      return { error: 'not found' };
    }
    return r.rows[0];
  });

  fastify.post('/', async (req, reply) => {
    const { name, description } = req.body || {};
    const r = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id, name, COALESCE(description,'') AS description",
      [name, description]
    );
    reply.code(201);
    return r.rows[0];
  });
}

module.exports = categoriesRoutes;