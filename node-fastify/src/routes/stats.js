const { pool } = require('../db');

async function statsRoutes(fastify) {
  fastify.get('/summary', async () => {
    const r = await pool.query(
      "SELECT (SELECT COUNT(*)::int FROM users) AS users, (SELECT COUNT(*)::int FROM products) AS products, (SELECT COUNT(*)::int FROM orders) AS orders, COALESCE((SELECT SUM(total) FROM orders),0)::float8 AS revenue"
    );
    return r.rows[0];
  });
}

module.exports = statsRoutes;