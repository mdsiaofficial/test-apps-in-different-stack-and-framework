import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductsService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const r = await this.pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id');
    return r.rows;
  }

  async findOne(id: number) {
    const r = await this.pool.query('SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id=$1', [id]);
    if (r.rows.length === 0) throw new NotFoundException();
    return r.rows[0];
  }

  async create(dto: { name: string; price: number; category_id: number }) {
    const categoryId = dto.category_id === undefined ? null : dto.category_id;
    const r = await this.pool.query(
      'INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING id, name, price::float8 AS price, category_id, created_at',
      [dto.name, dto.price, categoryId],
    );
    return r.rows[0];
  }

  async update(id: number, dto: { name: string; price: number; category_id: number }) {
    const categoryId = dto.category_id === undefined ? null : dto.category_id;
    const r = await this.pool.query(
      'UPDATE products SET name=$1, price=$2, category_id=$3 WHERE id=$4 RETURNING id, name, price::float8 AS price, category_id, created_at',
      [dto.name, dto.price, categoryId, id],
    );
    if (r.rows.length === 0) throw new NotFoundException();
    return r.rows[0];
  }

  async remove(id: number) {
    await this.pool.query('DELETE FROM products WHERE id=$1', [id]);
    return { deleted: true };
  }
}