const { pool } = require('../db');
const { sendJson } = require('../utils/response');
const { parseId } = require('../utils/parseId');

async function list(req, res) {
  try {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id');
    sendJson(res, 200, r.rows);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function get(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  try {
    const r = await pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id=$1', [id]);
    if (r.rows.length === 0) return sendJson(res, 404, { error: 'not found' });
    sendJson(res, 200, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
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
    sendJson(res, 201, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function listItems(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  try {
    const r = await pool.query(
      'SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id=$1 ORDER BY id',
      [id]
    );
    sendJson(res, 200, r.rows);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { list, get, create, listItems };
