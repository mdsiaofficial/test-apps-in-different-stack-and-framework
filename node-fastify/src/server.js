require('dotenv').config();

const { buildApp } = require('./app');
const { pool } = require('./db');

const PORT = Number(process.env.PORT) || 8009;

async function main() {
  const app = await buildApp();
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`node-fastify listening on port ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  const shutdown = async () => {
    await app.close().catch(() => {});
    await pool.end().catch(() => {});
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main();