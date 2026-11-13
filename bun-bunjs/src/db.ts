import { SQL } from "bun";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://app:app@localhost:5432/appdb";

// Bun ships its own PostgreSQL client: no `pg` dependency, no build step.
export const sql = new SQL(DATABASE_URL);
