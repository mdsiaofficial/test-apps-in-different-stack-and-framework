export class BadRequest extends Error {}

/** Reads a JSON request body; empty bodies become `{}` and malformed JSON throws BadRequest. */
export async function readBody(req: Request): Promise<Record<string, unknown>> {
  const raw = await req.text();
  if (raw.trim() === "") return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new BadRequest("invalid json");
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new BadRequest("body must be a json object");
  }
  return parsed as Record<string, unknown>;
}

export type Params = Record<string, string | undefined>;
