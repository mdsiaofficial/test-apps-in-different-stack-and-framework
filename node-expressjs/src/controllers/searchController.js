const { pool } = require('../db');

async function search(req, res) {
  const q = req.query.q != null ? String(req.query.q) : '';
  try {
    const r = await pool.query(
      'SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id',
      ['%' + q + '%']
    );
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { search };
