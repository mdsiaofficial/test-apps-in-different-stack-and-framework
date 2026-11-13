const { pool } = require('../db');

function parseId(param) {
  if (!/^\d+$/.test(param)) return null;
  return Number(param);
}

async function list(req, res) {
  try {
    const r = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function get(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'invalid id' });
  try {
    const r = await pool.query('SELECT id, name, email, created_at FROM users WHERE id=$1', [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  const { name, email } = req.body || {};
  try {
    const r = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name, email, created_at',
      [name, email]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'invalid id' });
  const { name, email } = req.body || {};
  try {
    const r = await pool.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'invalid id' });
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { list, get, create, update, remove };
