import { describe, it, expect, beforeEach } from 'vitest';
import { env, exports } from 'cloudflare:workers';
import { reset, runInDurableObject, evictDurableObject } from 'cloudflare:test';
import { authenticator } from './passkey-fixture';
import worker from '../src/worker';
import { TripAuth } from '../src/auth';
const origin='https://trip.example.test';
const stub=()=>env.TRIP_AUTH.getByName(env.TRIP_ID);
async function post(path,body={},cookie='',extra={}) {
  const response=await exports.default.fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...(cookie?{Cookie:cookie}:{}),...extra},body:JSON.stringify(body)});
  return {status:response.status,data:await response.json(),cookie:response.headers.get('Set-Cookie')?.split(';')[0]??'',headers:response.headers};
}
async function get(path,cookie='') { return exports.default.fetch(origin+path,{redirect:'manual',headers:cookie?{Cookie:cookie}:{}}); }
async function setup() {
  const key=await authenticator();
  const challenge=await post('/api/setup/options',{setupSecret:'B'.repeat(43)});
  expect(challenge.status).toBe(200);
  const result=await post('/api/setup/verify',{challengeId:challenge.data.challengeId,response:await key.register(challenge.data.options)});
  expect(result.status,JSON.stringify(result.data)).toBe(200);
  return {key,cookie:result.cookie};
}
async function member(cookie) {
  const created=await post('/api/admin/member/create',{name:'旅伴一',question:'生日 MM-DD',answer:'03-08'},cookie);
  expect(created.status).toBe(200);
  const claimed=await post('/api/admin/invite/claim',{memberId:created.data.id},cookie);
  expect(claimed.status).toBe(200);
  return {id:created.data.id,token:new URLSearchParams(new URL(claimed.data.url).hash.slice(1)).get('token')};
}
async function records(prefix) { return runInDurableObject(stub(),(_,state)=>state.storage.sql.exec('SELECT key,value,expires FROM records WHERE key LIKE ?',prefix+'%').toArray()); }
beforeEach(async()=>{await reset();});
describe('private itinerary and invitations',()=>{
  it('returns signed-in members and leaders from old invite/login links to their own itinerary without reusing an invite',async()=>{
    const {cookie:leader}=await setup();const m=await member(leader);
    const signed=await post('/api/invite/verify',{token:m.token,answer:'03-08'});
    for(const [cookie,name,role] of [[signed.cookie,'旅伴一','member'],[leader,'领队','leader']]) {
      for(const path of ['/invite#token='+m.token,'/invite','/login']) {
        const response=await get(path,cookie);
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe(origin+'/#');
        expect(response.headers.get('Cache-Control')).toBe('private, no-store');
        expect(response.headers.get('Set-Cookie')).toBeNull();
      }
      expect((await get('/',cookie)).status).toBe(200);
      expect((await (await get('/api/session',cookie)).json()).user).toMatchObject({name,role});
      // Recovery/setup is deliberately still reachable by a signed-in leader.
      expect((await get('/setup',cookie)).status).toBe(200);
    }
    expect((await post('/api/invite/verify',{token:m.token,answer:'03-08'})).status).toBe(410);
    expect((await records('session:'))).toHaveLength(2);
  });
  it('does not auto-enter with missing, expired, revoked or logged-out browser sessions',async()=>{
    const {cookie:leader}=await setup();const m=await member(leader);
    const signed=await post('/api/invite/verify',{token:m.token,answer:'03-08'});
    async function denied(cookie) {
      expect((await get('/',cookie)).status).toBe(302);
      expect((await get('/',cookie)).headers.get('Location')).toBe(origin+'/login');
      expect((await get('/invite',cookie)).status).toBe(200);
      expect((await get('/login',cookie)).status).toBe(200);
      expect((await (await get('/api/session',cookie)).json()).user).toBeNull();
    }
    await denied('');
    await post('/api/admin/member/revoke',{memberId:m.id},leader);
    await denied(signed.cookie);
    const other=await member(leader);
    const otherSession=await post('/api/invite/verify',{token:other.token,answer:'03-08'});
    await post('/api/logout',{},otherSession.cookie);
    await denied(otherSession.cookie);
    await runInDurableObject(stub(),(_,state)=>state.storage.sql.exec("UPDATE records SET expires=1 WHERE key LIKE 'session:%'"));
    await denied(leader);
  });
  it('blocks every itinerary payload before authentication; public login stays available',async()=>{
    for(const path of ['/data.js','/app.js','/itinerary.md','/hours-guide.md','/vendor/leaflet.js','/%64ata.js','/auth.html','/index.html/'])expect((await get(path)).status,path).toBe(401);
    expect((await get('/')).status).toBe(302);
    expect((await get('/login')).status).toBe(200);
    expect((await get('/auth.js')).status).toBe(200);
    expect((await exports.default.fetch(origin+'/data.js',{method:'HEAD'})).status).toBe(401);
  });
  it('requires correct bootstrap secret, actual verified Passkey, and a single leader claim',async()=>{
    expect((await post('/api/setup/options',{setupSecret:'wrong'})).status).toBe(403);
    const key=await authenticator();const c=await post('/api/setup/options',{setupSecret:'B'.repeat(43)});
    expect((await post('/api/setup/verify',{challengeId:c.data.challengeId,response:await key.register(c.data.options,{uv:false})})).status).toBe(400);
    const {cookie}=await setup();
    expect((await post('/api/setup/options',{setupSecret:'B'.repeat(43)})).status).toBe(409);
    expect((await get('/',cookie)).status).toBe(200);
    const session=await (await get('/api/session',cookie)).json();expect(session.user.role).toBe('leader');
  });
  it('exchanges an invitation once for a separate 30-day secure cookie, with no frontend token storage',async()=>{
    const {cookie}=await setup();const m=await member(cookie);
    const info=await post('/api/invite/info',{token:m.token});expect(info.data.remaining).toBe(5);
    const result=await post('/api/invite/verify',{token:m.token,answer:' ０３-０８ '});
    expect(result.status).toBe(200);expect(result.headers.get('Set-Cookie')).toContain('Max-Age=2592000');
    for(const flag of ['HttpOnly','Secure','SameSite=Lax','Path=/'])expect(result.headers.get('Set-Cookie')).toContain(flag);
    expect(result.cookie).not.toContain(m.token);expect(result.data.sessionToken).toBeUndefined();
    expect((await post('/api/invite/verify',{token:m.token,answer:'03-08'})).status).toBe(410);
    expect((await get('/data.js',result.cookie)).status).toBe(200);
    expect((await post('/api/admin/invite/rotate',{memberId:m.id},result.cookie)).status).toBe(403);
  });
  it('invalid tokens cannot increment a member counter or leak question/name',async()=>{
    const {cookie}=await setup();await member(cookie);
    const invalid=await post('/api/invite/info',{token:'x'.repeat(43)});expect(invalid.status).toBe(410);expect(invalid.data.name).toBeUndefined();
    await post('/api/invite/verify',{token:'x'.repeat(43),answer:'03-08'});
    const list=await (await get('/api/admin/members',cookie)).json();expect(list.members[0].failures).toBe(0);expect(list.members[0].generation).toBe(1);
  });
  it('20 concurrent wrong answers allow only five failures and exactly one replacement, even after eviction',async()=>{
    const {cookie}=await setup();const m=await member(cookie);
    const results=await Promise.all(Array.from({length:20},()=>post('/api/invite/verify',{token:m.token,answer:'wrong'})));
    expect(results.filter(r=>r.status===401)).toHaveLength(4);
    expect(results.filter(r=>r.data.code==='INVITE_LOCKED')).toHaveLength(1);
    for(const r of results){expect(r.data.url).toBeUndefined();expect(r.data.token).toBeUndefined();}
    await evictDurableObject(stub());
    await post('/api/invite/verify',{token:m.token,answer:'03-08'});
    const list=await (await get('/api/admin/members',cookie)).json();expect(list.members[0]).toMatchObject({generation:2,failures:0,pending:true});
    const invites=(await records('invite:')).map(x=>JSON.parse(x.value));expect(invites).toHaveLength(2);expect(invites.find(i=>i.status==='revoked').failures).toBe(5);
    const claimed=await post('/api/admin/invite/claim',{memberId:m.id},cookie);expect(claimed.status).toBe(200);expect(claimed.data.url).not.toContain(m.token);
    expect((await post('/api/admin/invite/claim',{memberId:m.id},cookie)).status).toBe(409);
  });
  it('two simultaneous correct answers produce only one session',async()=>{
    const {cookie}=await setup();const m=await member(cookie);
    const results=await Promise.all([post('/api/invite/verify',{token:m.token,answer:'03-08'}),post('/api/invite/verify',{token:m.token,answer:'03-08'})]);
    expect(results.map(x=>x.status).sort()).toEqual([200,410]);
    expect((await records('session:')).filter(x=>JSON.parse(x.value).role==='member')).toHaveLength(1);
  });
  it('revocation invalidates all member sessions and any outstanding invitation',async()=>{
    const {cookie}=await setup();const m=await member(cookie);
    const session=await post('/api/invite/verify',{token:m.token,answer:'03-08'});
    await post('/api/admin/invite/rotate',{memberId:m.id},cookie);
    const link=await post('/api/admin/invite/claim',{memberId:m.id},cookie);
    expect((await post('/api/admin/member/revoke',{memberId:m.id},cookie)).status).toBe(200);
    expect((await get('/data.js',session.cookie)).status).toBe(401);
    expect((await post('/api/invite/info',{token:new URLSearchParams(new URL(link.data.url).hash.slice(1)).get('token')})).status).toBe(410);
  });
  it('expires sessions on the server and enforces fresh Passkey verification for management',async()=>{
    const {cookie,key}=await setup();
    await runInDurableObject(stub(),(_,state)=>state.storage.sql.exec("UPDATE records SET value=json_set(value,'$.verifiedAt',0) WHERE key LIKE 'session:%'"));
    expect((await post('/api/admin/member/create',{name:'a',question:'q',answer:'a'},cookie)).data.code).toBe('STEP_UP');
    const options=await post('/api/passkey/options',{},cookie);const verified=await post('/api/passkey/verify',{challengeId:options.data.challengeId,response:await key.authenticate(options.data.options)},cookie);
    expect(verified.status,JSON.stringify(verified.data)).toBe(200);expect(verified.cookie).not.toBe(cookie);
    expect((await get('/data.js',cookie)).status).toBe(401);
    expect((await post('/api/admin/member/create',{name:'a',question:'q',answer:'a'},verified.cookie)).status).toBe(200);
    await runInDurableObject(stub(),(_,state)=>state.storage.sql.exec("UPDATE records SET expires=1 WHERE key LIKE 'session:%'"));
    expect((await get('/data.js',verified.cookie)).status).toBe(401);
  });
  it('rejects wrong origin, RP ID, missing UV, and replayed Passkey challenge',async()=>{
    const {key}=await setup();
    for(const bad of [{origin:'https://attacker.example'},{rpID:'attacker.example'},{uv:false}]){
      const c=await post('/api/passkey/options');const response=await key.authenticate(c.data.options,bad);
      const body={challengeId:c.data.challengeId,response};expect((await post('/api/passkey/verify',body)).status).toBe(400);expect((await post('/api/passkey/verify',body)).status).toBe(400);
    }
  });
  it('protects mutations from cross-origin requests and refuses alternate deployment aliases',async()=>{
    expect((await post('/api/setup/options',{setupSecret:'B'.repeat(43)},'',{Origin:'https://evil.example'})).status).toBe(403);
    expect((await post('/api/setup/options',{},'',{'Content-Type':'text/plain'})).status).toBe(415);
    expect((await exports.default.fetch('https://other.workers.dev/login')).status).toBe(421);
    const response=await get('/login');expect(response.headers.get('Cache-Control')).toContain('no-store');expect(response.headers.get('Referrer-Policy')).toBe('no-referrer');
  });
  it('cannot reset the administrator with a member answer or a setup secret while recovery is disabled',async()=>{
    await setup();expect((await post('/api/setup/recover',{setupSecret:'B'.repeat(43)})).data.code).toBe('RECOVERY_DISABLED');
  });
  it('keeps only hashes and encrypted pending invitations in persistent storage',async()=>{
    const {cookie}=await setup();const m=await member(cookie);const rows=JSON.stringify(await records(''));
    expect(rows).not.toContain(m.token);expect(rows).not.toContain('03-08');expect(rows).not.toContain(cookie.split('=')[1]);
  });
  it('adds a backup Passkey, protects the last key, and revokes leader sessions on key deletion',async()=>{
    const {cookie,key}=await setup();
    expect((await post('/api/admin/passkey/delete',{id:key.id},cookie)).data.code).toBe('LAST_KEY');
    const backup=await authenticator();const c=await post('/api/admin/passkey/options',{name:'备用密钥'},cookie);
    expect((await post('/api/admin/passkey/verify',{challengeId:c.data.challengeId,response:await backup.register(c.data.options)},cookie)).status).toBe(200);
    expect((await post('/api/admin/passkey/delete',{id:key.id},cookie)).data.code).toBe('STEP_UP');
    const login=await post('/api/passkey/options',{},cookie);const authenticated=await post('/api/passkey/verify',{challengeId:login.data.challengeId,response:await backup.authenticate(login.data.options)},cookie);
    expect(authenticated.status).toBe(200);
    expect((await post('/api/admin/passkey/delete',{id:key.id},authenticated.cookie)).status).toBe(200);
    expect((await get('/data.js',authenticated.cookie)).status).toBe(401);
    expect((await records('passkey:')).map(row=>JSON.parse(row.value).id)).toEqual([backup.id]);
  });
  it('logout invalidates the session and expires the browser cookie',async()=>{
    const {cookie}=await setup();const result=await post('/api/logout',{},cookie);
    expect(result.status).toBe(200);expect(result.headers.get('Set-Cookie')).toContain('Max-Age=0');
    expect((await get('/data.js',cookie)).status).toBe(401);
  });
  it('expired invitations and challenges cannot authenticate',async()=>{
    const {cookie,key}=await setup();const m=await member(cookie);const c=await post('/api/passkey/options');
    await runInDurableObject(stub(),(_,state)=>state.storage.sql.exec("UPDATE records SET expires=1 WHERE key LIKE 'invite:%' OR key LIKE 'challenge:%'"));
    expect((await post('/api/invite/verify',{token:m.token,answer:'03-08'})).status).toBe(410);
    expect((await post('/api/passkey/verify',{challengeId:c.data.challengeId,response:await key.authenticate(c.data.options)})).data.code).toBe('CHALLENGE_INVALID');
  });
  it('rate limits attempts in persistent storage independently of cookies',async()=>{
    await post('/api/invite/info',{token:'x'.repeat(43)});
    await runInDurableObject(stub(),(_,state)=>state.storage.sql.exec("UPDATE records SET value=json_set(value,'$.count',90) WHERE key LIKE 'rate:ip:%'"));
    const result=await post('/api/invite/info',{token:'y'.repeat(43)},'new-cookie=anything');expect(result.status).toBe(429);expect(result.headers.get('Retry-After')).toBe('600');
  });
  it('fails closed if origin or secrets are not configured',async()=>{
    const response=await worker.fetch(new Request(origin+'/data.js'),{...env,AUTH_SECRET:undefined});
    expect(response.status).toBe(503);expect(await response.text()).not.toContain('PLACES');
  });
  it('only one simultaneous bootstrap verification can establish the leader',async()=>{
    const a=await authenticator(),b=await authenticator();
    const ca=await post('/api/setup/options',{setupSecret:'B'.repeat(43)}),cb=await post('/api/setup/options',{setupSecret:'B'.repeat(43)});
    const ra=await a.register(ca.data.options),rb=await b.register(cb.data.options);
    const results=await Promise.all([post('/api/setup/verify',{challengeId:ca.data.challengeId,response:ra}),post('/api/setup/verify',{challengeId:cb.data.challengeId,response:rb})]);
    expect(results.filter(r=>r.status===200)).toHaveLength(1);expect((await records('passkey:'))).toHaveLength(1);
  });
  it('a newly rotated invitation retains the amended answer and does not revoke existing sessions',async()=>{
    const {cookie}=await setup();const m=await member(cookie);const session=await post('/api/invite/verify',{token:m.token,answer:'03-08'});
    expect((await post('/api/admin/invite/rotate',{memberId:m.id,question:'生日 MM-DD',answer:'04-09'},cookie)).status).toBe(200);
    expect((await get('/data.js',session.cookie)).status).toBe(200);
    const claimed=await post('/api/admin/invite/claim',{memberId:m.id},cookie);const next=new URLSearchParams(new URL(claimed.data.url).hash.slice(1)).get('token');
    expect((await post('/api/invite/verify',{token:next,answer:'03-08'})).status).toBe(401);
    expect((await post('/api/invite/verify',{token:next,answer:'04-09'})).status).toBe(200);
  });
  it('operator-enabled recovery with a new secret resets only the leader and cannot repeat',async()=>{
    const {cookie}=await setup();const m=await member(cookie);const memberLogin=await post('/api/invite/verify',{token:m.token,answer:'03-08'});
    await runInDurableObject(stub(),async(_,state)=>{
      // Model a deliberate operator configuration update, using the same SQLite
      // storage but a newly supplied deployment secret and recovery switch.
      const recovery=new TripAuth(state,{...env,ADMIN_RECOVERY_ENABLED:'true',SETUP_SECRET:'C'.repeat(43)});
      const context={sessionHash:'',ipHash:'recovery-test'};
      const invoke=async(path,body)=>JSON.parse(await recovery.execute(path,JSON.stringify(body),context));
      expect((await invoke('/api/setup/recover',{setupSecret:'B'.repeat(43)})).status).toBe(403);
      expect((await invoke('/api/setup/recover',{setupSecret:'C'.repeat(43)})).status).toBe(200);
      expect((await invoke('/api/setup/recover',{setupSecret:'C'.repeat(43)})).data.code).toBe('SECRET_USED');
      const replacement=await authenticator();const options=await invoke('/api/setup/options',{setupSecret:'C'.repeat(43)});
      expect(options.status).toBe(200);
      const registered=await invoke('/api/setup/verify',{challengeId:options.data.challengeId,response:await replacement.register(options.data.options)});
      expect(registered.status).toBe(200);
    });
    expect((await get('/data.js',cookie)).status).toBe(401);
    expect((await get('/data.js',memberLogin.cookie)).status).toBe(200);
    expect((await records('passkey:'))).toHaveLength(1);
  });
});
