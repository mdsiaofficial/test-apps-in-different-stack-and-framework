const { pool } = require('../db');
const { sendJson } = require('../utils/response');
const { parseId } = require('../utils/parseId');

async function list(req, res) {
  try {
    const r = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    sendJson(res, 200, r.rows);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function get(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  try {
    const r = await pool.query('SELECT id, name, email, created_at FROM users WHERE id=$1', [id]);
    if (r.rows.length === 0) return sendJson(res, 404, { error: 'not found' });
    sendJson(res, 200, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function create(req, res) {
  const { name, email } = req.body || {};
  try {
    const r = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name, email, created_at',
      [name, email]
    );
    sendJson(res, 201, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  const { name, email } = req.body || {};
  try {
    const r = await pool.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    if (r.rows.length === 0) return sendJson(res, 404, { error: 'not found' });
    sendJson(res, 200, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    sendJson(res, 200, { deleted: true });
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { list, get, create, update, remove };
