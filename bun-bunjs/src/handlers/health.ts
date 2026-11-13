import { json } from "../utils/response";

export function health(): Response {
  return json({ status: "ok" });
}
