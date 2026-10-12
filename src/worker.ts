import { PUBLIC_ASSETS } from './public-assets';
import { previewTitle } from './source-preview';
import { weatherResponse } from './weather';
import { digest, mac, validToken } from './crypto';
import { SESSION_AGE, type Result } from './auth';
export { TripAuth } from './auth';

const COOKIE = '__Host-trip_session';
const AUTH_PAGES = new Set(['/login', '/invite', '/setup']);
const READ_API = new Set(['/api/session', '/api/admin/members', '/api/comments', '/api/comments/summary', '/api/favorites', '/api/favorites/export', '/api/shopping']);
function secured(response: Response, mapNonce?: string): Response {
  const result = new Response(response.body, response);
  result.headers.set('Cache-Control', 'private, no-store');
  result.headers.set('Referrer-Policy', 'no-referrer');
  result.headers.set('X-Content-Type-Options', 'nosniff');
  result.headers.set('X-Frame-Options', 'DENY');
  result.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  result.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cyberjapandata.gsi.go.jp; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'");
  if (mapNonce) {
    // The public itinerary needs Google assets. Login/invitation
    // pages retain their original policy and never load the third-party SDK.
    result.headers.set('Referrer-Policy', 'strict-origin');
    result.headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self' 'nonce-${mapNonce}' 'strict-dynamic' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.googleusercontent.com; connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.google.com; font-src 'self' https://fonts.gstatic.com; frame-src https://*.google.com; worker-src blob:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'`);
  }
  result.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), publickey-credentials-get=(self), publickey-credentials-create=(self)');
  result.headers.set('Strict-Transport-Security', 'max-age=31536000');
  return result;
}
function json(data: unknown, status = 200) { return secured(Response.json(data, { status })); }
function cookie(raw: string, age: number) {
  return `${COOKIE}=${raw}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${age}`;
}
function configured(env: AppEnv): boolean {
  if (!validToken(env.AUTH_SECRET) || !env.APP_ORIGIN) return false;
  try {
    const url = new URL(env.APP_ORIGIN);
    return url.origin === env.APP_ORIGIN && !url.username && !url.password && (url.protocol === 'https:' || (url.protocol === 'http:' && url.hostname === 'localhost'));
  } catch { return false; }
}
async function readBody(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 65_536) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('object');
  return value as Record<string, unknown>;
}

export default {
  async fetch(request: Request, env: AppEnv): Promise<Response> {
    const url = new URL(request.url);
    if (!configured(env)) return json({ error: '网站尚未完成配置。请按部署说明设置正式地址和密钥。' }, 503);
    // Refuse workers.dev/preview aliases once a canonical custom origin is set.
    if (url.origin !== env.APP_ORIGIN) return json({ error: '请使用网站的正式访问地址。' }, 421);
    try {
      const stub = env.TRIP_AUTH.getByName(env.TRIP_ID);
      const raw = request.headers.get('Cookie')?.split(';').map(p => p.trim()).find(p => p.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
      const sessionHash = validToken(raw) ? await digest(raw) : '';
      if (url.pathname === '/api/maps-config') {
        if (request.method !== 'GET') return json({ error: '不支持此请求方式。' }, 405);
        // A browser-restricted Maps key is intentionally sent to the browser;
        // never use the server-only Routes API key here.
        if (!env.GOOGLE_MAPS_BROWSER_KEY?.trim() || !env.GOOGLE_MAPS_MAP_ID?.trim())
          return json({ error: 'Google 地图尚未启用。' }, 503);
        return json({ apiKey: env.GOOGLE_MAPS_BROWSER_KEY.trim(), mapId: env.GOOGLE_MAPS_MAP_ID.trim() });
      }
      if (url.pathname === '/api/weather') {
        if (request.method !== 'GET') return json({ error: '不支持此请求方式。' }, 405);
        return secured(await weatherResponse(url));
      }
      if (url.pathname.startsWith('/api/')) {
        const read = READ_API.has(url.pathname);
        if (request.method !== (read ? 'GET' : 'POST')) return json({ error: '不支持此请求方式。' }, 405);
        let body: Record<string, unknown> = {};
        if (url.pathname === '/api/comments') {
          for (const key of ['target', 'before', 'status']) if (url.searchParams.has(key)) body[key] = url.searchParams.get(key);
        }
        if (!read) {
          if (request.headers.get('Origin') !== env.APP_ORIGIN || request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({ error: '请求来源不正确。' }, 403);
          if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return json({ error: '需要 JSON 请求。' }, 415);
          try { body = await readBody(request); } catch { return json({ error: '请求格式不正确或内容过长。' }, 400); }
        }
        const ipHash = read ? '' : await mac(env.AUTH_SECRET!, 'ip:' + (request.headers.get('CF-Connecting-IP') ?? 'local'));
        const result = JSON.parse(await stub.execute(url.pathname, JSON.stringify(body), { sessionHash, ipHash })) as Result;
        if (url.pathname === '/api/favorites/preview' && result.status === 200) return json({ title: await previewTitle(body.url) });
        if (url.pathname === '/api/favorites/export' && result.status === 200) {
          return secured(new Response(String(result.data.csv), { headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="trip-favorites.csv"',
          } }));
        }
        const response = json(result.data, result.status);
        if (result.sessionToken) response.headers.set('Set-Cookie', cookie(result.sessionToken, SESSION_AGE / 1000));
        else if (result.clearSession) response.headers.set('Set-Cookie', cookie('', 0));
        if (result.status === 429) response.headers.set('Retry-After', '600');
        return response;
      }
      if (!['GET', 'HEAD'].includes(request.method)) return json({ error: '不支持此请求方式。' }, 405);
      let assetPath = url.pathname;
      if (AUTH_PAGES.has(assetPath)) {
        if (assetPath !== '/setup' && await stub.identity(sessionHash)) {
          // An invitation enrolls a browser once; subsequent visits use its
          // existing session. Explicitly clear the fragment so an invitation
          // token is not inherited by the redirect to the itinerary.
          return secured(Response.redirect(url.origin + '/#', 302));
        }
        assetPath = '/auth.html';
      }
      else if (assetPath === '/') assetPath = '/index.html';
      if (['/favorites.js','/favorites.css','/shopping.js','/shopping.css'].includes(assetPath) && !await stub.identity(sessionHash)) return json({ error: '成员资料需要登录。' }, 401);
      // Unknown paths fail closed, including private Markdown, backups and encoded aliases.
      if (!PUBLIC_ASSETS.has(assetPath)) return json({ error: '页面不存在。' }, 404);
      const assetURL = new URL(assetPath, url.origin);
      const response = await env.ASSETS.fetch(new Request(assetURL, { method: request.method }));
      if (assetPath === '/index.html' && response.ok) {
        const nonce = crypto.randomUUID().replaceAll('-', '');
        const rewritten = request.method === 'HEAD' ? response : new HTMLRewriter()
          .on('script', { element(element) { element.setAttribute('nonce', nonce); } })
          .transform(response);
        return secured(rewritten, nonce);
      }
      return secured(response);
    } catch {
      console.error(JSON.stringify({ event: 'request_failed' }));
      return json({ error: '暂时无法访问，请稍后重试。' }, 503);
    }
  },
} satisfies ExportedHandler<AppEnv>;
