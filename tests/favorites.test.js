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
// Independent reader to verify cell boundaries, quoting and multiline values.
function parseCsv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && c === ',') { row.push(cell); cell = ''; }
    else if (!quoted && c === '\r' && text[i + 1] === '\n') {
      row.push(cell); rows.push(row); row = []; cell = ''; i++;
    } else cell += c;
  }
  expect(quoted).toBe(false);expect(row).toEqual([]);expect(cell).toBe('');
  return rows;
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
const create = (cookie, extra = {}) => post('/api/favorites/create', { region: 'kyoto', title: '京都的小书店', hours: '11:00–19:00，周二休息', mapsUrl: 'https://maps.app.goo.gl/example', requestId: crypto.randomUUID(), ...extra }, cookie);
beforeEach(async () => { await reset(); });
describe('shared exploration favorites', () => {
  it('requires a live session for listing, adding and exporting; rejects cross-site writes', async () => {
    for (const path of ['/api/favorites', '/api/favorites/export']) expect((await get(path)).status).toBe(401);
    expect((await create('')).status).toBe(401);
    const { a, leader } = await family();
    expect((await post('/api/favorites/create', {}, a.cookie, { Origin: 'https://evil.example' })).status).toBe(403);
    await post('/api/admin/member/revoke', { memberId: a.id }, leader);
    expect((await create(a.cookie)).status).toBe(401);
    for (const path of ['/api/favorites', '/api/favorites/export']) expect((await get(path, a.cookie)).status).toBe(401);
  });
  it('shares all entries with members and leader and derives authorship on the server', async () => {
    const { a, b, leader } = await family();
    expect((await create(a.cookie, { name: 'fake', author: 'forged' })).status).toBe(200);
    expect((await create(b.cookie, { title: '唱片店', mapsUrl: 'https://www.google.com/maps/place/record-shop' })).status).toBe(200);
    expect((await create(leader, { title: '茶店', mapsUrl: 'https://goo.gl/maps/example2' })).status).toBe(200);
    for (const cookie of [a.cookie, b.cookie, leader]) {
      const list = await get('/api/favorites', cookie); expect(list.status).toBe(200); expect(list.data.favorites).toHaveLength(3);
      expect(list.data.favorites.map(f => f.name)).toEqual(['领队', '旅伴乙', '旅伴甲']);
      expect(list.data.favorites.some(f => 'author' in f || 'request' in f)).toBe(false);
    }
    await evictDurableObject(stub());
    expect((await get('/api/favorites', b.cookie)).data.favorites).toHaveLength(3);
  });
  it('deduplicates concurrent retries and rejects conflicting retries or the same map link', async () => {
    const { a, b } = await family(); const requestId = crypto.randomUUID();
    const results = await Promise.all(Array.from({ length: 8 }, () => create(a.cookie, { requestId })));
    expect(results.every(r => r.status === 200)).toBe(true);expect(new Set(results.map(r => r.data.id)).size).toBe(1);
    expect((await create(a.cookie, { requestId, title: 'changed' })).status).toBe(409);
    expect((await create(b.cookie)).status).toBe(409);
    expect((await get('/api/favorites', a.cookie)).data.favorites).toHaveLength(1);
  });
  it('validates required fields, length and Google Maps URLs without making outbound requests', async () => {
    const { a } = await family();
    for (const extra of [{ region: '' }, { region: 'invalid' }, { title: '' }, { hours: '' }, { title: 'a'.repeat(121) }, { hours: 'a'.repeat(501) }, { requestId: 'short' }]) expect((await create(a.cookie, extra)).status).toBe(400);
    for (const mapsUrl of ['javascript:alert(1)', 'http://maps.google.com/', 'https://google.com.evil.example/maps/test', 'https://maps.app.goo.gl@evil.example/a', 'https://user:pass@maps.google.com/a', 'https://google.com/search?q=test', 'https://maps.app.goo.gl:444/a', 'https://example.com/']) expect((await create(a.cookie, { mapsUrl })).status).toBe(400);
    for (const mapsUrl of ['https://www.google.com/maps/search/?api=1&query=大阪', 'https://maps.app.goo.gl/abc123', 'https://goo.gl/maps/xyz', 'https://www.google.co.jp/maps/place/京都', 'https://maps.google.com/?q=Uji']) expect((await create(a.cookie, { mapsUrl, hours: '待确认' })).status).toBe(200);
  });
  it('exports a complete UTF-8 CSV attachment with Chinese, quotes, commas and multiline hours', async () => {
    const { a, b } = await family();
    const title = '书店, "本与茶" <小店>', hours = '11:00–19:00\n周二休息, 节假日另定';
    await create(a.cookie, { title, hours });
    for (let i = 0; i < 35; i++) expect((await create(i % 2 ? a.cookie : b.cookie, { title: '店铺 ' + i, mapsUrl: 'https://maps.app.goo.gl/spot' + i })).status).toBe(200);
    const response = await exports.default.fetch(origin + '/api/favorites/export', { headers: { Cookie: b.cookie } });
    expect(response.status).toBe(200);expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="trip-favorites.csv"');expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(response.headers.get('Content-Type')).toBe('text/csv; charset=utf-8');
    const bytes = new Uint8Array(await response.arrayBuffer());expect([...bytes.slice(0, 3)]).toEqual([239, 187, 191]);
    const rows = parseCsv(new TextDecoder().decode(bytes));
    expect(rows).toHaveLength(37);expect(rows.every(row => row.length === 9)).toBe(true);
    expect(rows[0]).toEqual(['地区', '地点名称', '营业时间', 'Google 地图链接', '消息来源链接', '添加者', '感兴趣人数', '感兴趣成员', '消息来源标题']);
    expect(rows[1][1]).toBe('店铺 34');expect(rows[35][1]).toBe('店铺 0');
    expect(rows[36]).toEqual(['京都', title, hours, 'https://maps.app.goo.gl/example', '', '旅伴甲', '0', '', '']);
  });
  it('exports a header-only CSV for an empty collection', async () => {
    const { a } = await family();
    const response = await exports.default.fetch(origin + '/api/favorites/export', { headers: { Cookie: a.cookie } });
    expect(parseCsv(await response.text())).toEqual([['地区', '地点名称', '营业时间', 'Google 地图链接', '消息来源链接', '添加者', '感兴趣人数', '感兴趣成员', '消息来源标题']]);
  });
  it('neutralizes spreadsheet formulas in exported text without altering stored entries', async () => {
    const { a } = await family();
    const values = ['=HYPERLINK("https://example.com","click")', '+1+1', '-1+1', '@SUM(1,2)', '  \t=1+1'];
    for (const [i, title] of values.entries()) expect((await create(a.cookie, { title, hours: title, mapsUrl: 'https://maps.app.goo.gl/formula' + i })).status).toBe(200);
    // Names can predate this feature and contain leading whitespace.
    await runInDurableObject(stub(), (_, state) => state.storage.sql.exec("UPDATE favorites SET name=?", ' \t=1+1'));
    const response = await exports.default.fetch(origin + '/api/favorites/export', { headers: { Cookie: a.cookie } });
    const rows = parseCsv(await response.text()).slice(1);
    expect(rows.map(row => row[1])).toEqual([...values].reverse().map(value => "'" + value.trim()));
    expect(rows.every(row => row[2].startsWith("'") && row[5] === "' \t=1+1")).toBe(true);
    expect((await get('/api/favorites', a.cookie)).data.favorites.map(row => row.title)).toEqual([...values].reverse().map(value => value.trim()));
  });
  it('limits writes per member durably and allows another member to keep adding', async () => {
    const { a, b } = await family();
    for (let i = 0; i < 30; i++) expect((await create(a.cookie, { mapsUrl: 'https://maps.app.goo.gl/rate' + i })).status).toBe(200);
    await evictDurableObject(stub());expect((await create(a.cookie)).status).toBe(429);expect((await create(b.cookie)).status).toBe(200);
    await runInDurableObject(stub(), (_, state) => state.storage.sql.exec('UPDATE favorite_rates SET until=0'));
    expect((await create(a.cookie, { mapsUrl: 'https://maps.app.goo.gl/aftercooldown' })).status).toBe(200);
  });
  it('anonymizes removed members while preserving the shared collection and blocking their sessions', async () => {
    const { a, b, leader } = await family();await create(a.cookie);
    expect((await post('/api/admin/member/remove', { memberId: a.id }, leader)).status).toBe(200);
    expect((await get('/api/favorites', b.cookie)).data.favorites[0].name).toBe('已移除成员');
    expect((await get('/api/favorites', a.cookie)).status).toBe(401);expect((await create(a.cookie)).status).toBe(401);
  });
  it('groups by region in journey order, keeps newest entries first within each region, and exports matching groups', async () => {
    const { a } = await family();
    for (const [region, title] of [['kobe', '神户店'], ['osaka', '大阪旧店'], ['kyoto', '京都店'], ['osaka', '大阪新店'], ['wakayama', '和歌山店']]) {
      expect((await create(a.cookie, { region, title, mapsUrl: 'https://maps.app.goo.gl/' + encodeURIComponent(title) })).status).toBe(200);
    }
    await evictDurableObject(stub());
    const list = (await get('/api/favorites', a.cookie)).data.favorites;
    expect(list.map(f => f.title)).toEqual(['大阪新店', '大阪旧店', '京都店', '神户店', '和歌山店']);
    const response = await exports.default.fetch(origin + '/api/favorites/export', { headers: { Cookie: a.cookie } });
    const rows = parseCsv(await response.text()).slice(1);
    expect(rows.map(row => row[0])).toEqual(['大阪', '大阪', '京都', '神户／有马', '和歌山']);
    expect(rows.map(row => row[1])).toEqual(list.map(item => item.title));
  });
  it('preserves earlier entries without region data in the unassigned group after schema initialization', async () => {
    const { a } = await family();await create(a.cookie);
    await runInDurableObject(stub(), (_, state) => state.storage.sql.exec('ALTER TABLE favorites DROP COLUMN region'));
    await evictDurableObject(stub());
    const list = (await get('/api/favorites', a.cookie)).data.favorites;
    expect(list).toHaveLength(1);expect(list[0]).toMatchObject({ title: '京都的小书店', region: 'unassigned' });
  });

  it('accepts optional recommendation links, shares and exports them, and preserves absent sources', async () => {
    const { a, b } = await family();
    expect((await create(a.cookie)).status).toBe(200);
    const sources = ['https://www.bilibili.com/video/BVtest', 'https://www.xiaohongshu.com/explore/test?xsec_token=abc', 'https://www.dianping.com/shop/test', 'https://youtu.be/test', 'https://xhslink.com/test', 'http://example.com/recommendation'];
    for (const [i, sourceUrl] of sources.entries()) expect((await create(a.cookie, { mapsUrl: 'https://maps.app.goo.gl/source' + i, sourceUrl })).status).toBe(200);
    await evictDurableObject(stub());
    const list = (await get('/api/favorites', b.cookie)).data.favorites;
    expect(list.at(-1).sourceUrl).toBe('');expect(list.slice(0, -1).map(f => f.sourceUrl)).toEqual([...sources].reverse());
    const response = await exports.default.fetch(origin + '/api/favorites/export', { headers: { Cookie: b.cookie } });const rows = parseCsv(await response.text()).slice(1);
    expect(rows.map(row => row[4])).toEqual([...sources].reverse().concat(''));
    const requestId = crypto.randomUUID();expect((await create(a.cookie, { requestId, sourceUrl: sources[0], mapsUrl: 'https://maps.app.goo.gl/retrysource' })).status).toBe(200);
    expect((await create(a.cookie, { requestId, sourceUrl: sources[1], mapsUrl: 'https://maps.app.goo.gl/retrysource' })).status).toBe(409);
  });
  it('rejects unsafe source schemes or invalid values and migrates old entries with an empty source', async () => {
    const { a } = await family();
    for (const sourceUrl of ['javascript:alert(1)', 'data:text/html,test', 'file:///tmp/test', 'not a url', 'https://user:password@example.com/', 'x'.repeat(2049), 42]) expect((await create(a.cookie, { sourceUrl })).status).toBe(400);
    expect((await create(a.cookie, { sourceUrl: '   ' })).status).toBe(200);
    await runInDurableObject(stub(), (_, state) => state.storage.sql.exec('ALTER TABLE favorites DROP COLUMN sourceUrl'));
    await evictDurableObject(stub());
    const list = (await get('/api/favorites', a.cookie)).data.favorites;expect(list).toHaveLength(1);expect(list[0].sourceUrl).toBe('');
  });

  it('shares interest counts and names, counts each identity once, and supports cancellation and restart', async () => {
    const { a, b, leader } = await family();
    const id = (await create(a.cookie)).data.id;
    const other = (await create(b.cookie, { mapsUrl: 'https://maps.app.goo.gl/other' })).data.id;
    const vote = (cookie, interested) => post('/api/favorites/interest', { favoriteId: id, interested, name: 'forged', author: 'forged' }, cookie);
    expect((await get('/api/favorites', a.cookie)).data.favorites.every(row => row.interestCount === 0 && !row.interested)).toBe(true);
    const retries = await Promise.all(Array.from({ length: 8 }, () => vote(a.cookie, true)));
    expect(retries.every(r => r.status === 200 && r.data.interestCount === 1)).toBe(true);
    await Promise.all([vote(b.cookie, true), vote(leader, true)]);
    await evictDurableObject(stub());
    for (const cookie of [a.cookie, b.cookie, leader]) {
      const rows = (await get('/api/favorites', cookie)).data.favorites;
      expect(rows.map(row => row.id)).toEqual([other, id]);
      expect(rows[0].interestCount).toBe(0);
      expect(rows[1]).toMatchObject({ interested: true, interestCount: 3 });
      expect(rows[1].interestNames.sort()).toEqual(['旅伴乙', '旅伴甲', '领队'].sort());
    }
    const exported = await exports.default.fetch(origin + '/api/favorites/export', { headers: { Cookie: a.cookie } });
    const csv = parseCsv(await exported.text());expect(csv[2][6]).toBe('3');
    for (const name of ['旅伴甲', '旅伴乙', '领队']) expect(csv[2][7]).toContain(name);
    await Promise.all(Array.from({ length: 4 }, () => vote(a.cookie, false)));
    expect((await get('/api/favorites', a.cookie)).data.favorites[1]).toMatchObject({ interested: false, interestCount: 2 });
    expect((await get('/api/favorites', b.cookie)).data.favorites[1].interested).toBe(true);
    await post('/api/admin/member/remove', { memberId: b.id }, leader);
    const final = (await get('/api/favorites', leader)).data.favorites[1];
    expect(final.interestCount).toBe(1);expect(final.interestNames).toEqual(['领队']);
    expect((await vote(b.cookie, true)).status).toBe(401);
  });
  it('protects interest writes and rejects invalid or missing places', async () => {
    const { a, leader } = await family();const id = (await create(a.cookie)).data.id;
    const body = { favoriteId: id, interested: true };
    expect((await post('/api/favorites/interest', body)).status).toBe(401);
    expect((await post('/api/favorites/interest', body, a.cookie, { Origin: 'https://evil.example' })).status).toBe(403);
    for (const extra of [{ favoriteId: '1' }, { favoriteId: -1 }, { favoriteId: 1.5 }, { interested: 1 }, { interested: null }]) expect((await post('/api/favorites/interest', { ...body, ...extra }, a.cookie)).status).toBe(400);
    expect((await post('/api/favorites/interest', { ...body, favoriteId: 99999 }, a.cookie)).status).toBe(404);
    await post('/api/admin/member/revoke', { memberId: a.id }, leader);
    expect((await post('/api/favorites/interest', body, a.cookie)).status).toBe(401);
  });

});

it('persists multiple sources and blank titles; preserves retry semantics and CSV alignment', async () => {
 const {a}=await family();const requestId=crypto.randomUUID();
 const sources=[{url:'https://www.youtube.com/watch?v=one',title:'京都, "小店"'},{url:'https://example.com/review',title:''}];
 expect((await create(a.cookie,{sources,requestId})).status).toBe(200);
 expect((await create(a.cookie,{sources,requestId})).status).toBe(200);
 expect((await create(a.cookie,{sources:[{...sources[0],title:'changed'}],requestId})).status).toBe(409);
 const list=await get('/api/favorites',a.cookie);expect(list.data.favorites[0].sources).toEqual(sources);
 const csv=await exports.default.fetch(origin+'/api/favorites/export',{headers:{Cookie:a.cookie}});
 const rows=parseCsv(await csv.text());expect(rows[1][4]).toBe(sources.map(s=>s.url).join('\n'));expect(rows[1][8]).toBe(sources.map(s=>s.title).join('\n'));
 expect((await create(a.cookie,{sources:Array(9).fill(sources[0])})).status).toBe(400);
 expect((await create(a.cookie,{sources:[{url:'javascript:alert(1)',title:''}]})).status).toBe(400);
});
it('preview requires authentication, same origin, and enforces its own rate limit',async()=>{
 expect((await post('/api/favorites/preview',{url:'https://example.com'})).status).toBe(401);
 const {a}=await family();
 expect((await post('/api/favorites/preview',{url:'https://example.com'},a.cookie,{Origin:'https://evil.example'})).status).toBe(403);
 for(let i=0;i<40;i++)expect((await post('/api/favorites/preview',{url:'http://127.0.0.1'},a.cookie)).data.title).toBe('');
 expect((await post('/api/favorites/preview',{url:'https://example.com'},a.cookie)).status).toBe(429);
});

it('only leader can delete any favorite, including interests; retries are safe',async()=>{
 const {a,b,leader}=await family();const made=await create(a.cookie);const favoriteId=made.data.id;
 await post('/api/favorites/interest',{favoriteId,interested:true},b.cookie);
 expect((await get('/api/favorites',a.cookie)).data.favorites[0].canDelete).toBe(false);
 expect((await get('/api/favorites',leader)).data.favorites[0].canDelete).toBe(true);
 expect((await post('/api/favorites/delete',{favoriteId})).status).toBe(401);
 expect((await post('/api/favorites/delete',{favoriteId,role:'leader'},a.cookie)).status).toBe(403);
 expect((await post('/api/favorites/delete',{favoriteId},b.cookie)).status).toBe(403);
 expect((await post('/api/favorites/delete',{favoriteId},leader,{Origin:'https://evil.example'})).status).toBe(403);
 expect((await post('/api/favorites/delete',{favoriteId:-1},leader)).status).toBe(400);
 expect((await post('/api/favorites/delete',{favoriteId},leader)).status).toBe(200);
 expect((await post('/api/favorites/delete',{favoriteId},leader)).status).toBe(200);
 expect((await get('/api/favorites',a.cookie)).data.favorites).toEqual([]);
 await runInDurableObject(stub(),async(_instance,state)=>{
  expect(state.storage.sql.exec('SELECT * FROM favorite_interests WHERE favoriteId=?',favoriteId).toArray()).toEqual([]);
 });
 expect((await post('/api/favorites/interest',{favoriteId,interested:true},b.cookie)).status).toBe(404);
 const csv=await exports.default.fetch(origin+'/api/favorites/export',{headers:{Cookie:leader}});expect(parseCsv(await csv.text())).toHaveLength(1);
 expect((await create(a.cookie)).status).toBe(200);
});
