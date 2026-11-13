const { pool } = require('../db');
const { sendJson } = require('../utils/response');

async function summary(req, res) {
  try {
    const r = await pool.query(
      "SELECT (SELECT COUNT(*)::int FROM users) AS users, (SELECT COUNT(*)::int FROM products) AS products, (SELECT COUNT(*)::int FROM orders) AS orders, COALESCE((SELECT SUM(total) FROM orders),0)::float8 AS revenue"
    );
    sendJson(res, 200, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { summary };
