function parseId(param) {
  if (typeof param !== 'string' || !/^\d+$/.test(param)) return null;
  return Number(param);
}

module.exports = { parseId };
