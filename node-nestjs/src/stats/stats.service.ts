import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class StatsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async summary() {
    const r = await this.pool.query(
      "SELECT (SELECT COUNT(*)::int FROM users) AS users, (SELECT COUNT(*)::int FROM products) AS products, (SELECT COUNT(*)::int FROM orders) AS orders, COALESCE((SELECT SUM(total) FROM orders),0)::float8 AS revenue",
    );
    return r.rows[0];
  }
}