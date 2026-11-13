const http = require('http');
const { URL } = require('url');
const { pool } = require('./db');
const router = require('./router');

const PORT = Number(process.env.PORT) || 8008;

const server = http.createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch (e) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'invalid url' }));
    return;
  }

  req.pathname = url.pathname;
  req.query = Object.fromEntries(url.searchParams);

  const method = req.method.toUpperCase();
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    let body = '';
    req.setEncoding('utf8');
    try {
      for await (const chunk of req) body += chunk;
    } catch (e) {
      if (!res.headersSent) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'read error' }));
      }
      return;
    }
    if (body.trim() === '') {
      req.body = {};
    } else {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'invalid json' }));
        return;
      }
    }
  } else {
    req.body = {};
  }
  req.method = method;

  try {
    await router.handle(req, res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: e.message || 'internal error' }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`node-nodejs listening on port ${PORT}`);
});

const shutdown = async () => {
  server.close(() => process.exit(0));
  await pool.end().catch(() => {});
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
