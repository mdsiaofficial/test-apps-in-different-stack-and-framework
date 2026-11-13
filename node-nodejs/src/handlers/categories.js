const { pool } = require('../db');
const { sendJson } = require('../utils/response');
const { parseId } = require('../utils/parseId');

async function list(req, res) {
  try {
    const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories ORDER BY id");
    sendJson(res, 200, r.rows);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function get(req, res) {
  const id = parseId(req.params.id);
  if (id === null) return sendJson(res, 400, { error: 'invalid id' });
  try {
    const r = await pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories WHERE id=$1", [id]);
    if (r.rows.length === 0) return sendJson(res, 404, { error: 'not found' });
    sendJson(res, 200, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

async function create(req, res) {
  const { name, description } = req.body || {};
  try {
    const r = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id, name, COALESCE(description,'') AS description",
      [name, description]
    );
    sendJson(res, 201, r.rows[0]);
  } catch (e) {
    sendJson(res, 500, { error: e.message });
  }
}

module.exports = { list, get, create };
