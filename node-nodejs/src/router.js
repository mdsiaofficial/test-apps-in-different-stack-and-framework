const health = require('./handlers/health');
const users = require('./handlers/users');
const categories = require('./handlers/categories');
const products = require('./handlers/products');
const orders = require('./handlers/orders');
const stats = require('./handlers/stats');
const search = require('./handlers/search');

const routes = [
  { method: 'GET', path: '/health', handler: health.get },

  { method: 'GET', path: '/api/users', handler: users.list },
  { method: 'GET', path: '/api/users/:id', handler: users.get },
  { method: 'POST', path: '/api/users', handler: users.create },
  { method: 'PUT', path: '/api/users/:id', handler: users.update },
  { method: 'DELETE', path: '/api/users/:id', handler: users.remove },

  { method: 'GET', path: '/api/categories', handler: categories.list },
  { method: 'GET', path: '/api/categories/:id', handler: categories.get },
  { method: 'POST', path: '/api/categories', handler: categories.create },

  { method: 'GET', path: '/api/products', handler: products.list },
  { method: 'GET', path: '/api/products/:id', handler: products.get },
  { method: 'POST', path: '/api/products', handler: products.create },
  { method: 'PUT', path: '/api/products/:id', handler: products.update },
  { method: 'DELETE', path: '/api/products/:id', handler: products.remove },

  { method: 'GET', path: '/api/orders', handler: orders.list },
  { method: 'GET', path: '/api/orders/:id', handler: orders.get },
  { method: 'POST', path: '/api/orders', handler: orders.create },
  { method: 'GET', path: '/api/orders/:id/items', handler: orders.listItems },

  { method: 'GET', path: '/api/stats/summary', handler: stats.summary },

  { method: 'GET', path: '/api/search', handler: search.search },
];

function matchRoute(method, pathname) {
  const reqSegments = pathname.split('/').filter(Boolean);
  for (const route of routes) {
    if (route.method !== method) continue;
    const routeSegments = route.path.split('/').filter(Boolean);
    if (routeSegments.length !== reqSegments.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < routeSegments.length; i++) {
      const rs = routeSegments[i];
      const qs = reqSegments[i];
      if (rs.startsWith(':')) {
        try {
          params[rs.slice(1)] = decodeURIComponent(qs);
        } catch (e) {
          ok = false;
          break;
        }
      } else if (rs !== qs) {
        ok = false;
        break;
      }
    }
    if (ok) return { handler: route.handler, params };
  }
  return null;
}

function handle(req, res) {
  const match = matchRoute(req.method, req.pathname || '/');
  if (!match) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'not found' }));
    return Promise.resolve();
  }
  req.params = match.params;
  return Promise.resolve(match.handler(req, res));
}

module.exports = { matchRoute, handle };
