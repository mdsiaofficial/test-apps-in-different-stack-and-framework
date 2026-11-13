import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const r = await this.pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    return r.rows;
  }

  async findOne(id: number) {
    const r = await this.pool.query('SELECT id, name, email, created_at FROM users WHERE id=$1', [id]);
    if (r.rows.length === 0) throw new NotFoundException();
    return r.rows[0];
  }

  async create(dto: { name: string; email: string }) {
    const r = await this.pool.query(
      'INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name, email, created_at',
      [dto.name, dto.email],
    );
    return r.rows[0];
  }

  async update(id: number, dto: { name: string; email: string }) {
    const r = await this.pool.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at',
      [dto.name, dto.email, id],
    );
    if (r.rows.length === 0) throw new NotFoundException();
    return r.rows[0];
  }

  async remove(id: number) {
    await this.pool.query('DELETE FROM users WHERE id=$1', [id]);
    return { deleted: true };
  }
}