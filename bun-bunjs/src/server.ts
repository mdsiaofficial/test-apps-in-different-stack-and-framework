import { sql } from "./db";
import { routes } from "./routes";
import { json } from "./utils/response";

const PORT = Number(process.env.PORT) || 8012;

const server = Bun.serve({
  port: PORT,
  development: false,
  routes,
  // Anything not in the route table is a JSON 404, matching the other apps.
  fetch() {
    return json({ error: "not found" }, 404);
  },
  error(error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "internal error" }, 500);
  },
});

console.log(`bun-bunjs listening on port ${server.port}`);

let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  await server.stop();
  await sql.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
