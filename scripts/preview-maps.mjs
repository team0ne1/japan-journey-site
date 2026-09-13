import browserSync from 'browser-sync';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';

const project = fileURLToPath(new URL('../', import.meta.url));
const allowedHosts = new Set(['localhost:8790', '127.0.0.1:8790']);
const bs = browserSync.create();

// Only the local map settings endpoint needs custom handling. BrowserSync owns
// static file serving, file watching, CSS injection, and browser reconnection.
async function previewSettings(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'strict-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  const json = (status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : JSON.stringify(value));
  };
  if (!allowedHosts.has(req.headers.host) || req.headers['sec-fetch-site'] === 'cross-site') return json(403, { error: '仅允许本机预览。' });
  if (!['GET', 'HEAD'].includes(req.method)) return json(405, { error: '本地地图预览不提供写入功能。' });
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/maps-config') {
      let local = {};
      try { local = parseEnv(await readFile(resolve(project, '.dev.vars'), 'utf8')); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      const apiKey = (local.GOOGLE_MAPS_BROWSER_KEY || process.env.GOOGLE_MAPS_BROWSER_KEY || '').trim();
      const mapId = (local.GOOGLE_MAPS_MAP_ID || process.env.GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID').trim();
      return apiKey ? json(200, { apiKey, mapId }) : json(503, { error: '请在 .dev.vars 配置 Google Maps 浏览器金钥。' });
    }
    if (url.pathname.startsWith('/api/')) return json(503, { error: '此入口仅预览地图和行程；完整功能请使用 npm run dev。' });
    next();
  } catch { json(500, { error: '暂时无法读取本地预览配置。' }); }
}

bs.init({
  server: { baseDir: resolve(project, 'dist'), directory: false },
  middleware: [previewSettings],
  files: [resolve(project, 'dist/**/*'), resolve(project, '.dev.vars')],
  watchOptions: { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 } },
  port: 8790,
  listen: '127.0.0.1',
  localOnly: true,
  online: false,
  open: false,
  ui: false,
  ghostMode: false,
  notify: true,
  injectChanges: true,
  reloadDebounce: 200,
  reloadOnRestart: true,
}, error => { if (error) { console.error('Local preview failed to start.'); process.exitCode = 1; } });
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { bs.exit(); process.exit(0); });
