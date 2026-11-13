const { pool } = require('../db');
const { sendJson } = require('../utils/response');

async function search(req, res) {
  const q = req.query.q != null ? String(req.query.q) : '';
  try {
    const r = await pool.query(
      'SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id',
      ['%' + q + '%']
    );
    sendJson(res, 200, r.rows);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { search };
