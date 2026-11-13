import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SearchService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async search(q: string) {
    const term = q != null ? String(q) : '';
    const r = await this.pool.query(
      'SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id',
      ['%' + term + '%'],
    );
    return r.rows;
  }
}