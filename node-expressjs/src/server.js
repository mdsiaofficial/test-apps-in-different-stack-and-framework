require('dotenv').config();

const app = require('./app');
const { pool } = require('./db');

const PORT = process.env.PORT || 8011;

const server = app.listen(PORT, () => {
  console.log(`node-expressjs listening on port ${PORT}`);
});

const shutdown = async () => {
  await pool.end().catch(() => {});
  server.close(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
