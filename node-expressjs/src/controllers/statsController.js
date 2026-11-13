const { pool } = require('../db');

async function summary(req, res) {
  try {
    const r = await pool.query(
      "SELECT (SELECT COUNT(*)::int FROM users) AS users, (SELECT COUNT(*)::int FROM products) AS products, (SELECT COUNT(*)::int FROM orders) AS orders, COALESCE((SELECT SUM(total) FROM orders),0)::float8 AS revenue"
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { summary };
