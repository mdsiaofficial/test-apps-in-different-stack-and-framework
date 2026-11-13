export function parseId(param: string | undefined): number | null {
  if (typeof param !== "string" || !/^\d+$/.test(param)) return null;
  return Number(param);
}
