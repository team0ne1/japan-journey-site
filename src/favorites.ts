import { FAVORITE_REGIONS } from './favorite-regions';

type User = { id: string; name: string; role: string };
type Favorite = { id: number; region: string; title: string; hours: string; mapsUrl: string; sourceUrl: string; sources: string; author: string; name: string; created: number; request: string };
type Interest = { favoriteId: number; author: string; name: string };
export class FavoriteError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
const fail = (status: number, message: string): never => { throw new FavoriteError(status, message); };
function field(value: unknown, max: number, label: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return fail(400, `请填写${label}（最多 ${max} 字）。`);
  return value.trim();
}
function mapsLink(value: unknown): string {
  const raw = field(value, 2048, 'Google 地图链接');
  let url: URL;
  try { url = new URL(raw); } catch { return fail(400, '请粘贴完整的 Google 地图链接。'); }
  const google = /^(?:www\.)?google\.(?:com|co\.jp|com\.hk|com\.tw|cn)$/.test(url.hostname) && /^\/maps(?:\/|$)/.test(url.pathname);
  const maps = ['maps.google.com', 'maps.google.co.jp'].includes(url.hostname);
  const short = url.hostname === 'maps.app.goo.gl' && url.pathname.length > 1 || url.hostname === 'goo.gl' && url.pathname.startsWith('/maps/');
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !(google || maps || short)) return fail(400, '请使用 Google 地图的 HTTPS 地点链接或“分享”短链接。');
  return url.href;
}
function sourceLink(value: unknown): string {
  if (value === undefined || value === null || typeof value === 'string' && !value.trim()) return '';
  const raw = field(value, 2048, '消息来源链接');
  let url: URL;
  try { url = new URL(raw); } catch { return fail(400, '请填写完整的消息来源链接，或留空。'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return fail(400, '消息来源需要是 HTTP 或 HTTPS 网页链接。');
  return url.href;
}
type Source = { url: string; title: string };
function sourceList(body: Record<string, unknown>): Source[] {
  if (body.sources === undefined) { const url = sourceLink(body.sourceUrl); return url ? [{ url, title: '' }] : []; }
  if (!Array.isArray(body.sources) || body.sources.length > 8) return fail(400, '最多添加8条消息来源。');
  return body.sources.map(item => {
    if (!item || typeof item !== 'object') return fail(400, '消息来源格式不正确。');
    const url = sourceLink(item.url);
    if (!url) return fail(400, '请填写来源链接。');
    const title = item.title === undefined || typeof item.title === 'string' && !item.title.trim() ? '' : field(item.title, 300, '来源标题');
    return { url, title };
  });
}
function storedSources(row: Pick<Favorite, 'sources' | 'sourceUrl'>): Source[] {
  return row.sources ? JSON.parse(row.sources) : row.sourceUrl ? [{ url: row.sourceUrl, title: '' }] : [];
}
function csvCell(value: string): string {
  // Treat user text as text when opened in a spreadsheet, never as a formula.
  const safe = /^[\s]*[=+@-]/u.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export class Favorites {
  constructor(private storage: DurableObjectStorage) {
    storage.sql.exec(`CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, hours TEXT NOT NULL,
      mapsUrl TEXT NOT NULL UNIQUE, author TEXT NOT NULL, name TEXT NOT NULL,
      created INTEGER NOT NULL, request TEXT NOT NULL, region TEXT NOT NULL DEFAULT 'unassigned', sourceUrl TEXT NOT NULL DEFAULT '', UNIQUE(author, request)
    );
    CREATE TABLE IF NOT EXISTS favorite_interests (
      favoriteId INTEGER NOT NULL REFERENCES favorites(id) ON DELETE CASCADE,
      author TEXT NOT NULL, name TEXT NOT NULL, PRIMARY KEY(favoriteId, author)
    );
    CREATE TABLE IF NOT EXISTS favorite_rates (author TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);`);
    // Preserve entries created before optional fields were added.
    const columns = storage.sql.exec<{ name: string }>('PRAGMA table_info(favorites)').toArray();
    if (!columns.some(column => column.name === 'region')) storage.sql.exec("ALTER TABLE favorites ADD COLUMN region TEXT NOT NULL DEFAULT 'unassigned'");
    if (!columns.some(column => column.name === 'sourceUrl')) storage.sql.exec("ALTER TABLE favorites ADD COLUMN sourceUrl TEXT NOT NULL DEFAULT ''");
    if (!columns.some(column => column.name === 'sources')) storage.sql.exec("ALTER TABLE favorites ADD COLUMN sources TEXT NOT NULL DEFAULT ''");
  }
  private previewLimit(user: User) {
    const key = 'preview:' + user.id, now = Date.now(), sql = this.storage.sql;
    sql.exec('DELETE FROM favorite_rates WHERE until<=?', now);
    const rate = sql.exec<{count:number;until:number}>('SELECT count,until FROM favorite_rates WHERE author=?', key).toArray()[0] ?? {count:0,until:now+600000};
    if (rate.count >= 40) return fail(429, '标题读取过于频繁，请稍后重试；也可以直接保存链接。');
    sql.exec('INSERT INTO favorite_rates(author,count,until) VALUES(?,?,?) ON CONFLICT(author) DO UPDATE SET count=excluded.count,until=excluded.until', key, rate.count+1, rate.until);
  }
  private interest(favoriteId: number, user: User, entries?: Interest[]) {
    const people = entries ?? this.storage.sql.exec<Interest>('SELECT * FROM favorite_interests WHERE favoriteId=? ORDER BY author', favoriteId).toArray();
    return { interested: people.some(person => person.author === user.id), interestCount: people.length, interestNames: people.map(person => person.name) };
  }
  execute(path: string, body: Record<string, unknown>, user: User): Record<string, unknown> {
    const sql = this.storage.sql;
    if (path === '/api/favorites/preview') { this.previewLimit(user); return { allowed: true }; }
    if (path === '/api/favorites' || path === '/api/favorites/export') {
      // The trip is capped at 500 entries, so one read/export includes every entry.
      const rows = sql.exec<Favorite>('SELECT * FROM favorites ORDER BY id DESC').toArray();
      rows.sort((a, b) => FAVORITE_REGIONS.findIndex(r => r.id === a.region) - FAVORITE_REGIONS.findIndex(r => r.id === b.region));
      const interests = sql.exec<Interest>('SELECT * FROM favorite_interests ORDER BY author').toArray();
      const states = new Map(rows.map(row => [row.id, this.interest(row.id, user, interests.filter(person => person.favoriteId === row.id))]));
      if (path === '/api/favorites') return { favorites: rows.map(({ id, region, title, hours, mapsUrl, sourceUrl, sources, name, created }) => ({ id, region, title, hours, mapsUrl, sourceUrl, sources: storedSources({sources, sourceUrl}), name, created, canDelete: user.role === 'leader', ...states.get(id) })) };
      const records = [
        ['地区', '地点名称', '营业时间', 'Google 地图链接', '消息来源链接', '添加者', '感兴趣人数', '感兴趣成员', '消息来源标题'],
        ...rows.map(row => [FAVORITE_REGIONS.find(region => region.id === row.region)?.name ?? '待分类', row.title, row.hours, row.mapsUrl, storedSources(row).map(s => s.url).join("\n"), row.name, String(states.get(row.id)!.interestCount), states.get(row.id)!.interestNames.join('、'), storedSources(row).map(s => s.title).join("\n")]),
      ];
      // UTF-8 BOM lets Excel recognize Chinese; quoted cells preserve multiline hours.
      return { csv: '\uFEFF' + records.map(record => record.map(csvCell).join(',')).join('\r\n') + '\r\n' };
    }
    if (path === '/api/favorites/delete') {
      if (user.role !== 'leader') return fail(403, '只有领队可以删除收藏地点。');
      const id = body.favoriteId;
      if (typeof id !== 'number' || !Number.isSafeInteger(id) || id < 1) return fail(400, '收藏地点编号不正确。');
      return this.storage.transactionSync(() => {
        // Explicitly remove interests too; retrying deletion is harmless.
        sql.exec('DELETE FROM favorite_interests WHERE favoriteId=?', id);
        sql.exec('DELETE FROM favorites WHERE id=?', id);
        return { deleted: true, favoriteId: id };
      });
    }
    if (path === '/api/favorites/interest') {
      const id = body.favoriteId;
      if (typeof id !== 'number' || !Number.isSafeInteger(id) || id < 1 || typeof body.interested !== 'boolean') return fail(400, '表态内容不正确，请刷新后重试。');
      return this.storage.transactionSync(() => {
        if (!sql.exec('SELECT id FROM favorites WHERE id=?', id).toArray().length) return fail(404, '找不到这个收藏地点。');
        // Set desired state, rather than toggle: retries cannot count twice or undo a vote.
        if (body.interested) sql.exec('INSERT INTO favorite_interests(favoriteId,author,name) VALUES(?,?,?) ON CONFLICT(favoriteId,author) DO UPDATE SET name=excluded.name', id, user.id, user.name);
        else sql.exec('DELETE FROM favorite_interests WHERE favoriteId=? AND author=?', id, user.id);
        return { favoriteId: id, ...this.interest(id, user) };
      });
    }
    if (path !== '/api/favorites/create') return fail(404, '找不到此操作。');
    const title = field(body.title, 120, '地点名称'), hours = field(body.hours, 500, '营业时间，未知可写“待确认”'), mapsUrl = mapsLink(body.mapsUrl), request = field(body.requestId, 64, '提交标识');
    const region = field(body.region, 32, '所属地区'), sources = sourceList(body), sourceUrl = sources[0]?.url ?? '';
    if (!FAVORITE_REGIONS.some(item => item.id === region)) return fail(400, '请选择列表中的地区。');
    if (!/^[a-zA-Z0-9_-]{16,64}$/.test(request)) return fail(400, '提交标识不正确，请重新提交。');
    return this.storage.transactionSync(() => {
      const old = sql.exec<Favorite>('SELECT * FROM favorites WHERE author=? AND request=?', user.id, request).toArray()[0];
      if (old) {
        if (JSON.stringify(storedSources(old)) !== JSON.stringify(sources) || old.region !== region || old.title !== title || old.hours !== hours || old.mapsUrl !== mapsUrl) return fail(409, '这次提交的内容已改变，请重新提交。');
        return { saved: true, id: old.id };
      }
      if (sql.exec('SELECT id FROM favorites WHERE mapsUrl=?', mapsUrl).toArray().length) return fail(409, '这个地图链接已经在收藏夹中，请先查看现有记录。');
      if (sql.exec<{ total: number }>('SELECT COUNT(*) AS total FROM favorites').one().total >= 500) return fail(409, '收藏夹已达到 500 个地点的上限，请联系领队。');
      const now = Date.now();
      sql.exec('DELETE FROM favorite_rates WHERE until<=?', now);
      const rate = sql.exec<{ count: number; until: number }>('SELECT count,until FROM favorite_rates WHERE author=?', user.id).toArray()[0] ?? { count: 0, until: now + 600000 };
      if (rate.count >= 30) return fail(429, '添加过于频繁，请在 10 分钟后重试。');
      sql.exec('INSERT INTO favorite_rates(author,count,until) VALUES(?,?,?) ON CONFLICT(author) DO UPDATE SET count=excluded.count,until=excluded.until', user.id, rate.count + 1, rate.until);
      const row = sql.exec<{ id: number }>('INSERT INTO favorites(title,hours,mapsUrl,author,name,created,request,region,sourceUrl,sources) VALUES(?,?,?,?,?,?,?,?,?,?) RETURNING id', title, hours, mapsUrl, user.id, user.name, now, request, region, sourceUrl, JSON.stringify(sources)).one();
      return { saved: true, id: row.id };
    });
  }
}
