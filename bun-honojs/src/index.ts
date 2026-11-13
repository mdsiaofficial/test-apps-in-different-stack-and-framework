import { Hono } from 'hono';
import usersRoutes from './routes/users';
import categoriesRoutes from './routes/categories';
import productsRoutes from './routes/products';
import ordersRoutes from './routes/orders';
import statsRoutes from './routes/stats';
import searchRoutes from './routes/search';
import { pool } from './db';

const app = new Hono();

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/api/users', usersRoutes);
app.route('/api/categories', categoriesRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/orders', ordersRoutes);
app.route('/api/stats', statsRoutes);
app.route('/api', searchRoutes);

app.notFound((c) => c.json({ error: 'not found' }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: (err as Error)?.message || 'internal error' }, 500);
});

const port = Number(process.env.PORT) || 8013;

const shutdown = async () => {
  await pool.end().catch(() => {});
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`bun-honojs listening on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
