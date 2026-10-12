// Read-only production checks; never creates a user, session, or comment.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin = 'https://trip.team0ne.work';
async function check() {
  const get = path => fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'Cache-Control': 'no-cache' } });
  const home = await get('/');
  assert.equal(home.status, 200, 'Anonymous homepage must be public');
  const html=await home.text();
  assert.ok(!html.includes('comments.js'));
  const publicData=await get('/journey-model.js');
  assert.equal(publicData.status,200);
  const published=await publicData.text();
  assert.equal(published,await readFile('.build/assets/journey-model.js','utf8'),'Live public data must match audited build');
  const login = await get('/login');
  assert.equal(login.status, 200, 'Login page must load');
  assert.match(await login.text(), /id="auth-content"/);
  const session = await get('/api/session');
  assert.equal(session.status, 200);
  const identity = await session.json();
  assert.equal(identity.user, null);
  assert.equal(identity.setupRequired, false, 'Existing leader setup must remain intact');
  for (const path of ['/api/favorites','/api/shopping','/api/comments']) {
    const response = await get(path);
    assert.equal(response.status, 401, path + ' must remain private');
    assert.match(response.headers.get('Cache-Control') ?? '', /no-store/);
  }
  const auth = await get('/auth.js');
  assert.equal(auth.status, 200);
  const hash = value => createHash('sha256').update(value).digest('hex');
  assert.equal(hash(await auth.text()), hash(await readFile('.build/assets/auth.js', 'utf8')), 'Live auth code must match this build');
  console.log('Live checks passed: public itinerary available, setup retained, member data and comments protected.');
}
for (let attempt = 1; ; attempt++) {
  try { await check(); break; }
  catch (error) {
    if (attempt === 4) throw error;
    console.log(`Waiting for deployment propagation (${attempt}/4): ${error.message}`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
