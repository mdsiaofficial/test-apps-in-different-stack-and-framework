const { pool } = require('../db');

function parseId(param) {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

async function list(req, res) {
  try {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function get(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'invalid id' });
  try {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id=$1', [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  const { user_id, status, total } = req.body || {};
  const userId = user_id === undefined ? null : user_id;
  try {
    const r = await pool.query(
      'INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, user_id, status, total::float8 AS total, created_at',
      [userId, status, total]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function listItems(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'invalid id' });
  try {
    const r = await pool.query(
      'SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id=$1 ORDER BY id',
      [id]
    );
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { list, get, create, listItems };
