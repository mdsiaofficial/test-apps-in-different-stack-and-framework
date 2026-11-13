const { pool } = require('../db');

async function searchRoutes(fastify) {
  fastify.get('/search', async (req) => {
    const q = req.query.q != null ? String(req.query.q) : '';
    const r = await pool.query(
      'SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id',
      ['%' + q + '%']
    );
    return r.rows;
  });
}

module.exports = searchRoutes;