import { beforeEach, describe, expect, it } from 'vitest';
import { env, exports } from 'cloudflare:workers';
import { reset, evictDurableObject, runInDurableObject } from 'cloudflare:test';
import { authenticator } from './passkey-fixture';
const origin = 'https://trip.example.test';
const stub = () => env.TRIP_AUTH.getByName(env.TRIP_ID);
async function post(path, body, cookie = '', headers = {}) {
  const response = await exports.default.fetch(origin + path, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: cookie, ...headers }, body: JSON.stringify(body) });
  return { status: response.status, data: await response.json(), cookie: response.headers.get('Set-Cookie')?.split(';')[0] ?? '' };
}
async function get(path, cookie = '') {
  const response = await exports.default.fetch(origin + path, { headers: { Cookie: cookie } });
  return { status: response.status, data: await response.json() };
}
async function family() {
  const key = await authenticator();
  const options = await post('/api/setup/options', { setupSecret: 'B'.repeat(43) });
  const leader = (await post('/api/setup/verify', { challengeId: options.data.challengeId, response: await key.register(options.data.options) })).cookie;
  const members = [];
  for (const name of ['旅伴甲', '旅伴乙']) {
    const result = await post('/api/admin/member/create', { name, question: '生日', answer: '03-08' }, leader);
    const invite = await post('/api/admin/invite/claim', { memberId: result.data.id }, leader);
    const token = new URLSearchParams(new URL(invite.data.url).hash.slice(1)).get('token');
    const session = await post('/api/invite/verify', { token, answer: '03-08' });
    members.push({ cookie: session.cookie, id: result.data.id });
  }
  return { leader, a: members[0], b: members[1] };
}
const create = (cookie, extra = {}) => post('/api/comments/create', { target: 'd1-dotonbori', body: '这里多留半小时怎么样？', requestId: crypto.randomUUID(), ...extra }, cookie);
beforeEach(async () => { await reset(); });
describe('shared itinerary suggestions', () => {
  it('requires a current trip session for all reads and writes and rejects cross-site writes', async () => {
    expect((await get('/api/comments')).status).toBe(401);
    expect((await get('/api/comments/summary')).status).toBe(401);
    expect((await create('')).status).toBe(401);
    const { a, leader } = await family();
    expect((await post('/api/comments/create', { target: 'd1-dotonbori', body: 'test', requestId: crypto.randomUUID() }, a.cookie, { Origin: 'https://other.example' })).status).toBe(403);
    await post('/api/admin/member/revoke', { memberId: a.id }, leader);
    expect((await create(a.cookie)).status).toBe(401);
    expect((await get('/api/comments', a.cookie)).status).toBe(401);
  });
  it('makes every member and leader comment visible to all members, with server-derived authorship', async () => {
    const { a, b, leader } = await family();
    const one = await create(a.cookie, { name: '领队', role: 'leader', author: 'forged' });
    expect(one.status).toBe(200);
    expect(one.data.comment).toMatchObject({ name: '旅伴甲', role: 'member', canDelete: true });
    await create(leader, { body: '可以，我会调整时间。' });
    for (const cookie of [a.cookie, b.cookie, leader]) {
      const all = await get('/api/comments', cookie);
      expect(all.status).toBe(200); expect(all.data.comments).toHaveLength(2);
      expect(new Set(all.data.comments.map(c => c.name))).toEqual(new Set(['领队', '旅伴甲']));
      expect(all.data.comments.some(c => c.author)).toBe(false);
    }
    expect((await get('/api/comments', b.cookie)).data.comments[1].canDelete).toBe(false);
  });
  it('isolates distinct days, repeat visits, and A/B routes while preserving shared-day threads', async () => {
    const { a } = await family();
    for (const target of ['d1-osaka', 'd1-osaka-2', 'd2-osaka', 'd6-arima-hotel', 'd6-b-nara']) expect((await create(a.cookie, { target })).status).toBe(200);
    for (const target of ['d1-osaka', 'd1-osaka-2', 'd2-osaka', 'd6-arima-hotel', 'd6-b-nara']) expect((await get('/api/comments?target=' + target, a.cookie)).data.comments).toHaveLength(1);
    const shared = (await get('/api/comments?target=d1-osaka', a.cookie)).data.comments[0];
    expect(shared.context.plan).toBe('shared');
    expect((await get('/api/comments/summary', a.cookie)).data.counts).toHaveLength(5);
    for (const body of [{ target: 'unknown' }, { target: '__proto__' }, { body: '' }, { body: 'x'.repeat(1001) }, { requestId: 'short' }]) expect((await create(a.cookie, body)).status).toBe(400);
    const unsafe = "<img src=x onerror=alert(1)> '); DROP TABLE comments; --";
    expect((await create(a.cookie, { body: unsafe })).data.comment.body).toBe(unsafe);
    expect((await get('/api/comments', a.cookie)).data.comments).toHaveLength(6);
  });
  it('deduplicates simultaneous retries, persists through eviction, and prevents deleted comments from reappearing', async () => {
    const { a } = await family(); const requestId = crypto.randomUUID();
    const results = await Promise.all(Array.from({ length: 12 }, () => create(a.cookie, { requestId })));
    expect(results.every(r => r.status === 200)).toBe(true);
    expect(new Set(results.map(r => r.data.comment.id)).size).toBe(1);
    await evictDurableObject(stub());
    const list = await get('/api/comments', a.cookie); expect(list.data.comments).toHaveLength(1);
    expect((await create(a.cookie, { requestId })).data.comment.id).toBe(list.data.comments[0].id);
    expect((await create(a.cookie, { requestId, body: '不同内容' })).status).toBe(409);
    await post('/api/comments/delete', { id: list.data.comments[0].id }, a.cookie);
    expect((await create(a.cookie, { requestId })).status).toBe(409);
    expect((await get('/api/comments', a.cookie)).data.comments).toHaveLength(0);
  });
  it('allows self-deletion and leader moderation; treatment status is visible to everyone', async () => {
    const { a, b, leader } = await family(); const id = (await create(a.cookie)).data.comment.id;
    expect((await post('/api/comments/delete', { id }, b.cookie)).status).toBe(403);
    expect((await post('/api/comments/resolve', { id, resolved: true }, a.cookie)).status).toBe(403);
    expect((await post('/api/comments/resolve', { id, resolved: true }, leader)).status).toBe(200);
    expect((await get('/api/comments', b.cookie)).data.comments[0].resolved).toBe(true);
    expect((await get('/api/comments?status=open', b.cookie)).data.comments).toHaveLength(0);
    expect((await get('/api/comments/summary', b.cookie)).data.counts[0]).toMatchObject({ total: 1, open: 0 });
    await post('/api/comments/resolve', { id, resolved: false }, leader);
    expect((await get('/api/comments?status=open', a.cookie)).data.comments).toHaveLength(1);
    expect((await post('/api/comments/delete', { id }, leader)).status).toBe(200);
  });
  it('bounds write frequency durably per member without blocking other members or auth', async () => {
    const { a, b } = await family();
    const results = await Promise.all(Array.from({ length: 35 }, () => create(a.cookie)));
    expect(results.filter(r => r.status === 200)).toHaveLength(30);
    expect(results.filter(r => r.status === 429)).toHaveLength(5);
    await evictDurableObject(stub());
    expect((await create(a.cookie)).status).toBe(429);
    expect((await create(b.cookie)).status).toBe(200);
    expect((await get('/api/session', a.cookie)).status).toBe(200);
    await runInDurableObject(stub(), (_, state) => state.storage.sql.exec('UPDATE comment_rates SET until=0'));
    expect((await create(a.cookie)).status).toBe(200);
  });
  it('paginates newest first without hiding older suggestions or duplicating IDs across pages', async () => {
    const { a, b } = await family();
    for (let i = 0; i < 18; i++) { await create(a.cookie); await create(b.cookie); }
    const first = (await get('/api/comments', a.cookie)).data;
    expect(first.comments).toHaveLength(30); expect(first.next).not.toBeNull();
    const next = (await get('/api/comments?before=' + first.next, a.cookie)).data;
    expect(next.comments).toHaveLength(6); expect(next.next).toBeNull();
    expect(new Set([...first.comments, ...next.comments].map(c => c.id)).size).toBe(36);
    expect((await get('/api/comments?before=abc', a.cookie)).status).toBe(400);
    expect((await get('/api/comments?status=other', a.cookie)).status).toBe(400);
  });
});
