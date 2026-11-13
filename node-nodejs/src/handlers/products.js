const { pool } = require('../db');
const { sendJson } = require('../utils/response');
const { parseId } = require('../utils/parseId');

async function list(req, res) {
  try {
    const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id');
    sendJson(res, 200, r.rows);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function get(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  try {
    const r = await pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id=$1', [id]);
    if (r.rows.length === 0) return sendJson(res, 404, { error: 'not found' });
    sendJson(res, 200, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function create(req, res) {
  const { name, price, category_id } = req.body || {};
  const categoryId = category_id === undefined ? null : category_id;
  try {
    const r = await pool.query(
      'INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING id, name, price::float8 AS price, category_id, created_at',
      [name, price, categoryId]
    );
    sendJson(res, 201, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  const { name, price, category_id } = req.body || {};
  const categoryId = category_id === undefined ? null : category_id;
  try {
    const r = await pool.query(
      'UPDATE products SET name=$1, price=$2, category_id=$3 WHERE id=$4 RETURNING id, name, price::float8 AS price, category_id, created_at',
      [name, price, categoryId, id]
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
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    sendJson(res, 200, { deleted: true });
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { list, get, create, update, remove };
