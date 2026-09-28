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
const create = (cookie, extra = {}) => post('/api/shopping/create', { title: '拍立得相纸', notes: 'mini 白边，2 盒', placeIds: [], requestId: crypto.randomUUID(), ...extra }, cookie);
beforeEach(async () => { await reset(); });
describe('shared shopping list', () => {
  it('requires active membership and same-origin writes', async () => {
    expect((await get('/api/shopping')).status).toBe(401);
    expect((await create('')).status).toBe(401);
    expect((await post('/api/shopping/status', { id: 1, purchased: true })).status).toBe(401);
    const { a, leader } = await family();
    expect((await post('/api/shopping/create', {}, a.cookie, { Origin: 'https://evil.example' })).status).toBe(403);
    await post('/api/admin/member/revoke', { memberId: a.id }, leader);
    expect((await get('/api/shopping', a.cookie)).status).toBe(401);
    expect((await create(a.cookie)).status).toBe(401);
  });
  it('shares optional or multiple locations, uses server identity and survives eviction', async () => {
    const { a, b, leader } = await family();
    expect((await create(a.cookie, { name: '伪造', author: 'leader', placeIds: undefined, notes: undefined })).status).toBe(200);
    expect((await create(b.cookie, { title: '胶卷', placeIds: ['ChIJ_shopA', 'ChIJ_shopB'] })).status).toBe(200);
    expect((await create(leader, { title: '茶叶' })).status).toBe(200);
    await evictDurableObject(stub());
    for (const cookie of [a.cookie, b.cookie, leader]) {
      const { data } = await get('/api/shopping', cookie);
      expect(data.items).toHaveLength(3);
      expect(data.items.map(item => item.name)).toEqual(['领队', '旅伴乙', '旅伴甲']);
      expect(data.items[1].placeIds).toEqual(['ChIJ_shopA', 'ChIJ_shopB']);
      expect(data.items[2].placeIds).toEqual([]);
      expect(data.items[2].notes).toBe('');
      expect(data.items.some(item => 'author' in item || 'request' in item || 'hours' in item)).toBe(false);
    }
  });
  it('deduplicates concurrent retries and rejects changed retries', async () => {
    const { a } = await family(); const requestId = crypto.randomUUID();
    const results = await Promise.all(Array.from({ length: 6 }, () => create(a.cookie, { requestId })));
    expect(results.every(r => r.status === 200)).toBe(true);
    expect(new Set(results.map(r => r.data.id)).size).toBe(1);
    for (const change of [{ title: '茶叶' }, { notes: '不同备注' }, { placeIds: ['ChIJ_new'] }]) expect((await create(a.cookie, { requestId, ...change })).status).toBe(409);
    expect((await get('/api/shopping', a.cookie)).data.items).toHaveLength(1);
  });
  it('validates titles, notes and place IDs, never accepting arbitrary URLs', async () => {
    const { a } = await family();
    for (const change of [{ title: '' }, { title: ' ' }, { title: 'a'.repeat(121) }, { notes: 'a'.repeat(501) }, { notes: {} }, { requestId: 'short' }, { placeIds: 'bad' }, { placeIds: ['javascript:alert(1)'] }, { placeIds: ['https://example.com'] }, { placeIds: [''] }, { placeIds: [null] }, { placeIds: ['x'.repeat(256)] }, { placeIds: ['same', 'same'] }, { placeIds: Array.from({ length: 9 }, (_, i) => 'place' + i) }]) expect((await create(a.cookie, change)).status).toBe(400);
    expect((await create(a.cookie, { placeIds: Array.from({ length: 8 }, (_, i) => 'place' + i) })).status).toBe(200);
  });
  it('lets every member set and undo purchase status idempotently', async () => {
    const { a, b, leader } = await family(); const { data: { id } } = await create(a.cookie);
    for (const cookie of [b.cookie, leader, a.cookie]) {
      expect((await post('/api/shopping/status', { id, purchased: true }, cookie)).status).toBe(200);
      expect((await get('/api/shopping', a.cookie)).data.items[0].purchased).toBe(true);
    }
    await evictDurableObject(stub());
    expect((await get('/api/shopping', b.cookie)).data.items[0].purchased).toBe(true);
    expect((await post('/api/shopping/status', { id, purchased: false }, b.cookie)).status).toBe(200);
    expect((await get('/api/shopping', a.cookie)).data.items[0].purchased).toBe(false);
    expect((await post('/api/shopping/status', { id, purchased: 'true' }, a.cookie)).status).toBe(400);
    expect((await post('/api/shopping/status', { id: 999, purchased: true }, a.cookie)).status).toBe(404);
  });
  it('preserves records but anonymizes removed members and denies further access', async () => {
    const { a, b, leader } = await family(); await create(a.cookie);
    expect((await post('/api/admin/member/remove', { memberId: a.id }, leader)).status).toBe(200);
    expect((await get('/api/shopping', b.cookie)).data.items[0].name).toBe('已移除成员');
    expect((await get('/api/shopping', a.cookie)).status).toBe(401);
    expect((await create(a.cookie)).status).toBe(401);
  });
  it('limits writes per member without charging retries or blocking other members', async () => {
    const { a, b } = await family(); const requestId = crypto.randomUUID();
    await create(a.cookie, { requestId });
    for (let i = 1; i < 30; i++) expect((await create(a.cookie)).status).toBe(200);
    expect((await create(a.cookie)).status).toBe(429);
    expect((await create(a.cookie, { requestId })).status).toBe(200);
    expect((await create(b.cookie)).status).toBe(200);
    await runInDurableObject(stub(), (_, state) => state.storage.sql.exec('UPDATE shopping_rates SET until=0'));
    expect((await create(a.cookie)).status).toBe(200);
  });
  it('serves the page and policy, protecting shopping assets and responses', async () => {
    const { a } = await family();
    const response = await exports.default.fetch(origin + '/', { headers: { Cookie: a.cookie } });
    expect(response.status).toBe(200); expect(await response.text()).toContain('id="shopping-panel"');
    expect((await exports.default.fetch(origin + '/shopping.js')).status).toBe(401);
    expect((await exports.default.fetch(origin + '/maps-terms.html')).status).toBe(200);
    const list = await exports.default.fetch(origin + '/api/shopping', { headers: { Cookie: a.cookie } });
    expect(list.headers.get('Cache-Control')).toContain('no-store');
  });
});
