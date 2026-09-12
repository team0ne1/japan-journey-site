import { COMMENT_TARGETS, type CommentTarget } from './comment-targets';

type User = { id: string; name: string; role: string };
type Row = { id: number; target: string; author: string; name: string; role: string; body: string; created: number; resolved: number; deleted: number; request: string; context: string };
export class CommentError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
const fail = (status: number, message: string): never => { throw new CommentError(status, message); };
function string(value: unknown, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) return fail(400, `请填写有效内容（最多 ${max} 字）。`);
  return value.trim();
}

// Reuses the trip's existing SQLite database; it does not create another service.
export class Comments {
  constructor(private storage: DurableObjectStorage) {
    storage.sql.exec(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, target TEXT NOT NULL, author TEXT NOT NULL,
      name TEXT NOT NULL, role TEXT NOT NULL, body TEXT NOT NULL, created INTEGER NOT NULL,
      resolved INTEGER NOT NULL DEFAULT 0, deleted INTEGER NOT NULL DEFAULT 0,
      request TEXT NOT NULL, context TEXT NOT NULL, UNIQUE(author, request)
    );
    CREATE INDEX IF NOT EXISTS comment_thread ON comments(target, deleted, id);
    CREATE INDEX IF NOT EXISTS comment_review ON comments(deleted, resolved, id);
    CREATE TABLE IF NOT EXISTS comment_rates (author TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);`);
  }
  private present(row: Row, user: User) {
    return { id: row.id, target: row.target, name: row.name, role: row.role, body: row.body,
      created: row.created, resolved: Boolean(row.resolved), canDelete: user.id === row.author || user.role === 'leader',
      context: COMMENT_TARGETS[row.target] ?? JSON.parse(row.context) as CommentTarget,
      archived: !Object.hasOwn(COMMENT_TARGETS, row.target) };
  }
  execute(path: string, body: Record<string, unknown>, user: User): Record<string, unknown> {
    const sql = this.storage.sql;
    if (path === '/api/comments/summary') {
      const counts = sql.exec<{ target: string; total: number; open: number }>(
        'SELECT target,COUNT(*) AS total,SUM(1-resolved) AS open FROM comments WHERE deleted=0 GROUP BY target').toArray();
      return { counts, canResolve: user.role === 'leader' };
    }
    if (path === '/api/comments') {
      const target = body.target === undefined ? '' : string(body.target, 80);
      const before = body.before === undefined ? Number.MAX_SAFE_INTEGER : Number(body.before);
      if (!Number.isSafeInteger(before) || before <= 0 || (body.status !== undefined && !['all', 'open'].includes(String(body.status)))) fail(400, '分页参数不正确。');
      // All signed-in trip members can read every thread and the combined inbox.
      const rows = sql.exec<Row>(`SELECT * FROM comments WHERE deleted=0 AND id<?${target ? ' AND target=?' : ''}${body.status === 'open' ? ' AND resolved=0' : ''} ORDER BY id DESC LIMIT 31`, before, ...(target ? [target] : [])).toArray();
      return { comments: rows.slice(0, 30).map(row => this.present(row, user)), next: rows.length > 30 ? rows[29].id : null, canResolve: user.role === 'leader' };
    }
    if (!['/api/comments/create', '/api/comments/delete', '/api/comments/resolve'].includes(path)) return fail(404, '找不到此操作。');
    return this.storage.transactionSync(() => {
      const now = Date.now();
      if (path === '/api/comments/create') {
        const target = string(body.target, 80), content = string(body.body, 1000), request = string(body.requestId, 64);
        if (!/^[a-zA-Z0-9_-]{16,64}$/.test(request) || !Object.hasOwn(COMMENT_TARGETS, target)) fail(400, '行程节点或提交标识不正确，请刷新页面。');
        const previous = sql.exec<Row>('SELECT * FROM comments WHERE author=? AND request=?', user.id, request).toArray()[0];
        if (previous) {
          if (previous.target !== target || (!previous.deleted && previous.body !== content)) fail(409, '这次提交的内容已改变，请重新提交。');
          if (previous.deleted) fail(409, '这条评论已删除。');
          return { comment: this.present(previous, user) };
        }
        const count = sql.exec<{ total: number }>('SELECT COUNT(*) AS total FROM comments WHERE target=?', target).one().total;
        const total = sql.exec<{ total: number }>('SELECT COUNT(*) AS total FROM comments').one().total;
        if (count >= 500 || total >= 10000) fail(409, '评论存储已达到本次旅行的上限，请联系领队。');
        this.limit(user.id, now);
        const row = sql.exec<Row>('INSERT INTO comments(target,author,name,role,body,created,request,context) VALUES(?,?,?,?,?,?,?,?) RETURNING *',
          target, user.id, user.name, user.role, content, now, request, JSON.stringify(COMMENT_TARGETS[target])).one();
        return { comment: this.present(row, user) };
      }
      const id = body.id;
      if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) fail(400, '评论编号不正确。');
      const row = sql.exec<Row>('SELECT * FROM comments WHERE id=? AND deleted=0', id as number).toArray()[0];
      if (!row) return fail(404, '评论已不存在，请刷新列表。');
      if (path === '/api/comments/delete') {
        if (row.author !== user.id && user.role !== 'leader') fail(403, '只能删除自己的评论。');
        this.limit(user.id, now);
        // Keep a tombstone so a delayed retry cannot recreate a deleted comment.
        sql.exec("UPDATE comments SET deleted=1,body='' WHERE id=?", row.id);
      } else {
        if (user.role !== 'leader') fail(403, '只有领队可以标记处理状态。');
        if (typeof body.resolved !== 'boolean') fail(400, '处理状态不正确。');
        this.limit(user.id, now);
        sql.exec('UPDATE comments SET resolved=? WHERE id=?', body.resolved ? 1 : 0, row.id);
      }
      return { updated: true };
    });
  }
  private limit(author: string, now: number) {
    const sql = this.storage.sql;
    sql.exec('DELETE FROM comment_rates WHERE until<=?', now);
    const rate = sql.exec<{ count: number; until: number }>('SELECT count,until FROM comment_rates WHERE author=?', author).toArray()[0] ?? { count: 0, until: now + 600000 };
    if (rate.count >= 30) fail(429, '评论操作过于频繁，请在 10 分钟后重试。');
    sql.exec('INSERT INTO comment_rates(author,count,until) VALUES(?,?,?) ON CONFLICT(author) DO UPDATE SET count=excluded.count,until=excluded.until', author, rate.count + 1, rate.until);
  }
}
