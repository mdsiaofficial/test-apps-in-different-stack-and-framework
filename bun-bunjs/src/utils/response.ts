export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function notFound(): Response {
  return json({ error: "not found" }, 404);
}

import { BadRequest } from "./body";

export function serverError(error: unknown): Response {
  const message = error instanceof Error ? error.message : "internal error";
  console.error(error);
  return json({ error: message }, 500);
}

/** Maps a thrown error to its HTTP response: bad JSON is 400, everything else 500. */
export function errorResponse(error: unknown): Response {
  if (error instanceof BadRequest) return json({ error: error.message }, 400);
  return serverError(error);
}
