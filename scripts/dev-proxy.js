/**
 * Unified reverse proxy — serves all three frontend apps from a single origin.
 *
 * In development: proxies to dev servers on 3031/3032/3033.
 * In production:   proxies to production servers.
 *
 * All routes on one port → same origin → localStorage/cookies shared → auth works.
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = parseInt(process.env.PROXY_PORT || '3000', 10);

const MAIN = process.env.MAIN_URL || 'http://localhost:3031';
const DEJBAN = process.env.DEJBAN_URL || 'http://localhost:3032';
const AC = process.env.AC_URL || 'http://localhost:3033';

const path = require('path');
const app = express();

const isDev = process.env.NODE_ENV !== 'production';

// Serve static files from both main and AC public directories directly
// (faster than proxying, and avoids 404s for files unique to each app)
app.use(express.static(path.join(__dirname, '../apps/main/public')));
app.use(express.static(path.join(__dirname, '../apps/access-control/public')));

const acProxy = createProxyMiddleware({ target: AC, changeOrigin: true, ws: true });
const dejbanProxy = createProxyMiddleware({ target: DEJBAN, changeOrigin: true, ws: true });
const mainProxy = createProxyMiddleware({ target: MAIN, changeOrigin: true, ws: true });

// ---------- HTTP routing ----------
app.use((req, res, next) => {
  const p = req.path;

  // 1. Access control
  if (p.startsWith('/access-control')) {
    return acProxy(req, res, next);
  }

  // 2. Dejban
  if (p.startsWith('/dejban')) {
    return dejbanProxy(req, res, next);
  }

  // 3. Main app (Next.js) specific paths
  if (
    p.startsWith('/_next/') ||
    p.startsWith('/__nextjs/') ||
    p.startsWith('/home') ||
    p.startsWith('/auth') ||
    p.startsWith('/error') ||
    p === '/'
  ) {
    return mainProxy(req, res, next);
  }

  // 4. Vite dev server handles source files, HMR, and any other non-static paths
  if (isDev) {
    return acProxy(req, res, next);
  }

  // 5. Production fallback: main app
  return mainProxy(req, res, next);
});

// ---------- WebSocket upgrade handling (HMR) ----------
const server = app.listen(PORT, () => {
  console.log(`\n  Dev proxy running on http://localhost:${PORT}`);
  console.log(`  ────────────────────────────────────`);
  console.log(`  Main app:       http://localhost:${PORT}`);
  console.log(`  Access Control: http://localhost:${PORT}/access-control/`);
  console.log(`  Dejban:         http://localhost:${PORT}/dejban/`);
  console.log(`\n`);
});

server.on('upgrade', (req, socket, head) => {
  const path = req.url;

  // Next.js HMR WebSocket
  if (path.startsWith('/_next/webpack-hmr') || path.startsWith('/__nextjs')) {
    return mainProxy.upgrade(req, socket, head);
  }

  // Everything else: Vite HMR WebSocket (dev mode) or Next.js (production)
  if (isDev) {
    return acProxy.upgrade(req, socket, head);
  }
  return mainProxy.upgrade(req, socket, head);
});
