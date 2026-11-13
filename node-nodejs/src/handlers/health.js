const { sendJson } = require('../utils/response');

async function get(req, res) {
  sendJson(res, 200, { status: 'ok' });
}

module.exports = { get };
