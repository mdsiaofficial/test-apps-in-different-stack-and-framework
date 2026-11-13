import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CategoriesService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const r = await this.pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories ORDER BY id");
    return r.rows;
  }

  async findOne(id: number) {
    const r = await this.pool.query("SELECT id, name, COALESCE(description,'') AS description FROM categories WHERE id=$1", [id]);
    if (r.rows.length === 0) throw new NotFoundException();
    return r.rows[0];
  }

  async create(dto: { name: string; description: string }) {
    const r = await this.pool.query(
      "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id, name, COALESCE(description,'') AS description",
      [dto.name, dto.description],
    );
    return r.rows[0];
  }
}