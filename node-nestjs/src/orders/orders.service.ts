import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const r = await this.pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id');
    return r.rows;
  }

  async findOne(id: number) {
    const r = await this.pool.query('SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id=$1', [id]);
    if (r.rows.length === 0) throw new NotFoundException();
    return r.rows[0];
  }

  async create(dto: { user_id: number; status: string; total: number }) {
    const userId = dto.user_id === undefined ? null : dto.user_id;
    const r = await this.pool.query(
      'INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, user_id, status, total::float8 AS total, created_at',
      [userId, dto.status, dto.total],
    );
    return r.rows[0];
  }

  async listItems(orderId: number) {
    const r = await this.pool.query(
      'SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id=$1 ORDER BY id',
      [orderId],
    );
    return r.rows;
  }
}