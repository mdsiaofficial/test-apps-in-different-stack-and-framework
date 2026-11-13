const Fastify = require('fastify');

const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const statsRoutes = require('./routes/stats');
const searchRoutes = require('./routes/search');

async function buildApp() {
  const app = Fastify({ logger: false });

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(usersRoutes, { prefix: '/api/users' });
  await app.register(categoriesRoutes, { prefix: '/api/categories' });
  await app.register(productsRoutes, { prefix: '/api/products' });
  await app.register(ordersRoutes, { prefix: '/api/orders' });
  await app.register(statsRoutes, { prefix: '/api/stats' });
  await app.register(searchRoutes, { prefix: '/api' });

  app.setNotFoundHandler(async (req, reply) => {
    reply.code(404).send({ error: 'not found' });
  });

  app.setErrorHandler(async (err, req, reply) => {
    console.error(err);
    reply.code(err.statusCode || 500).send({ error: err.message || 'internal error' });
  });

  return app;
}

module.exports = { buildApp };