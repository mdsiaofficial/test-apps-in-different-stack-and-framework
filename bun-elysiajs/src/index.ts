import { Elysia } from 'elysia';
import { usersRoutes } from './routes/users';
import { categoriesRoutes } from './routes/categories';
import { productsRoutes } from './routes/products';
import { ordersRoutes } from './routes/orders';
import { statsRoutes } from './routes/stats';
import { searchRoutes } from './routes/search';
import { pool } from './db';

const app = new Elysia()
  .get('/health', () => ({ status: 'ok' }))
  .use(usersRoutes)
  .use(categoriesRoutes)
  .use(productsRoutes)
  .use(ordersRoutes)
  .use(statsRoutes)
  .use(searchRoutes);

const port = Number(process.env.PORT) || 8014;

app.listen(port);

const shutdown = async () => {
  await pool.end().catch(() => {});
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`bun-elysiajs listening on port ${port}`);

export default app;