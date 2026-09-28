type User = { id: string; name: string; role: string };
type Item = { id: number; title: string; notes: string; places: string; author: string; name: string; created: number; request: string; purchased: number };
export class ShoppingError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
const fail = (status: number, message: string): never => { throw new ShoppingError(status, message); };
function text(value: unknown, max: number, label: string, optional = false): string {
  if (optional && value === undefined) return '';
  if (typeof value !== 'string' || value.length > max || (!optional && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return fail(400, `请填写${label}（最多 ${max} 字）。`);
  return value.trim();
}
export class Shopping {
  constructor(private storage: DurableObjectStorage) {
    storage.sql.exec(`CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, notes TEXT NOT NULL,
      places TEXT NOT NULL, author TEXT NOT NULL, name TEXT NOT NULL,
      created INTEGER NOT NULL, request TEXT NOT NULL, purchased INTEGER NOT NULL DEFAULT 0,
      UNIQUE(author, request)
    );
    CREATE TABLE IF NOT EXISTS shopping_rates (author TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);`);
  }
  execute(path: string, body: Record<string, unknown>, user: User): Record<string, unknown> {
    const sql = this.storage.sql;
    if (path === '/api/shopping') {
      const rows = sql.exec<Item>('SELECT * FROM shopping_items ORDER BY purchased ASC,id DESC').toArray();
      return { items: rows.map(({ id, title, notes, places, name, created, purchased }) => ({ id, title, notes, placeIds: JSON.parse(places), name, created, purchased: Boolean(purchased) })) };
    }
    if (path === '/api/shopping/status') {
      if (typeof body.id !== 'number' || !Number.isSafeInteger(body.id) || body.id < 1 || typeof body.purchased !== 'boolean') return fail(400, '购物项状态不正确。');
      const row = sql.exec<{ id: number }>('UPDATE shopping_items SET purchased=? WHERE id=? RETURNING id', Number(body.purchased), body.id).toArray()[0];
      if (!row) return fail(404, '找不到这个购物项。');
      return { id: row.id, purchased: body.purchased };
    }
    if (path !== '/api/shopping/create') return fail(404, '找不到此操作。');
    const title = text(body.title, 120, '想买的东西'), notes = text(body.notes, 500, '备注', true);
    const request = text(body.requestId, 64, '提交标识');
    if (!/^[a-zA-Z0-9_-]{16,64}$/.test(request)) return fail(400, '提交标识不正确，请重新提交。');
    const placeIds = body.placeIds ?? [];
    // Persist only Google place IDs. Names, addresses and hours are fetched live.
    if (!Array.isArray(placeIds) || placeIds.length > 8 || placeIds.some(id => typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,255}$/.test(id)) || new Set(placeIds).size !== placeIds.length) return fail(400, '请从搜索结果选择店铺，每件商品最多 8 家，不能重复。');
    const places = JSON.stringify(placeIds);
    return this.storage.transactionSync(() => {
      const old = sql.exec<Item>('SELECT * FROM shopping_items WHERE author=? AND request=?', user.id, request).toArray()[0];
      if (old) {
        if (old.title !== title || old.notes !== notes || old.places !== places) return fail(409, '这次提交的内容已改变，请重新提交。');
        return { saved: true, id: old.id };
      }
      if (sql.exec<{ total: number }>('SELECT COUNT(*) AS total FROM shopping_items').one().total >= 500) return fail(409, '购物清单已达到 500 项上限，请联系领队。');
      const now = Date.now();
      sql.exec('DELETE FROM shopping_rates WHERE until<=?', now);
      const rate = sql.exec<{ count: number; until: number }>('SELECT count,until FROM shopping_rates WHERE author=?', user.id).toArray()[0] ?? { count: 0, until: now + 600000 };
      if (rate.count >= 30) return fail(429, '添加过于频繁，请在 10 分钟后重试。');
      sql.exec('INSERT INTO shopping_rates(author,count,until) VALUES(?,?,?) ON CONFLICT(author) DO UPDATE SET count=excluded.count,until=excluded.until', user.id, rate.count + 1, rate.until);
      const row = sql.exec<{ id: number }>('INSERT INTO shopping_items(title,notes,places,author,name,created,request) VALUES(?,?,?,?,?,?,?) RETURNING id', title, notes, places, user.id, user.name, now, request).one();
      return { saved: true, id: row.id };
    });
  }
}
