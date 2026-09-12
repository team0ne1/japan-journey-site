import { DurableObject } from 'cloudflare:workers';
import {
  generateRegistrationOptions, verifyRegistrationResponse,
  generateAuthenticationOptions, verifyAuthenticationResponse,
  type RegistrationResponseJSON, type AuthenticationResponseJSON,
  type AuthenticatorTransport,
} from '@simplewebauthn/server';
import { bytes, encode, decode, token, validToken, digest, mac, checkMac, sameSecret, seal, unseal, normalizeAnswer } from './crypto';
import { Comments, CommentError } from './comments';

const DAY = 86_400_000;
export const SESSION_AGE = 30 * DAY;
const INVITE_AGE = 7 * DAY;
const FRESH_AGE = 5 * 60_000;
const MAX_FAILURES = 5;
type Member = { id: string; name: string; question: string; answerMac: string; inviteHash?: string; generation: number };
type Invite = { memberId: string; generation: number; status: 'active' | 'used' | 'revoked'; failures: number; expires: number; pending?: string };
type Session = { userId: string; role: 'leader' | 'member'; expires: number; verifiedAt: number; created: number };
type Passkey = { id: string; publicKey: string; counter: number; transports?: AuthenticatorTransport[]; name: string; created: number };
type Challenge = { challenge: string; kind: 'setup' | 'register' | 'login'; sessionHash: string; setupHash?: string; name?: string };
type Context = { sessionHash: string; ipHash: string };
export type Result = { status: number; data: Record<string, unknown>; sessionToken?: string; clearSession?: boolean };
class AuthError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
const fail = (status: number, code: string, message: string): never => { throw new AuthError(status, code, message); };
function field(body: Record<string, unknown>, key: string, max = 120): string {
  const value = body[key];
  if (typeof value !== 'string' || !value.trim() || value.length > max) return fail(400, 'INVALID_INPUT', '请检查填写的内容。');
  return value.trim();
}
const ok = (data: Record<string, unknown> = {}): Result => ({ status: 200, data });

// One coordination object per trip. Invitations, rotations, and sessions for this
// five-person trip share SQLite transactions; other trips get separate objects.
export class TripAuth extends DurableObject<AppEnv> {
  private comments: Comments;
  constructor(ctx: DurableObjectState, env: AppEnv) {
    super(ctx, env);
    this.ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS records (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires INTEGER NOT NULL DEFAULT 0)');
    this.ctx.storage.sql.exec('CREATE INDEX IF NOT EXISTS record_expiry ON records(expires)');
    this.comments = new Comments(this.ctx.storage);
  }
  private get<T>(key: string): T | undefined {
    const row = this.ctx.storage.sql.exec<{ value: string }>('SELECT value FROM records WHERE key=? AND (expires=0 OR expires>?)', key, Date.now()).toArray()[0];
    return row ? JSON.parse(row.value) as T : undefined;
  }
  private put(key: string, value: unknown, expires = 0): void {
    this.ctx.storage.sql.exec('INSERT INTO records(key,value,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, expires=excluded.expires', key, JSON.stringify(value), expires);
  }
  private del(key: string): void { this.ctx.storage.sql.exec('DELETE FROM records WHERE key=?', key); }
  private all<T>(prefix: string): T[] {
    return this.ctx.storage.sql.exec<{ value: string }>('SELECT value FROM records WHERE key LIKE ? AND (expires=0 OR expires>?) ORDER BY key', prefix + '%', Date.now()).toArray().map(x => JSON.parse(x.value) as T);
  }
  private removeSessions(userId: string) {
    this.ctx.storage.sql.exec("DELETE FROM records WHERE key LIKE 'session:%' AND json_extract(value, '$.userId')=?", userId);
  }
  private requireLeader(context: Context, fresh = false): Session {
    const session = this.get<Session>('session:' + context.sessionHash);
    if (!session || session.role !== 'leader') return fail(403, 'FORBIDDEN', '需要领队身份。');
    if (fresh && Date.now() - session.verifiedAt >= FRESH_AGE) return fail(403, 'STEP_UP', '请先用 Passkey 解锁管理操作。');
    return session;
  }
  async identity(sessionHash: string): Promise<{ name: string; role: string; expires: number; fresh: boolean } | null> {
    const session = this.get<Session>('session:' + sessionHash);
    if (!session) return null;
    const member = session.role === 'member' ? this.get<Member>('member:' + session.userId) : undefined;
    if (session.role === 'member' && !member) return null;
    return { name: member?.name ?? '领队', role: session.role, expires: session.expires, fresh: session.role === 'leader' && Date.now() - session.verifiedAt < FRESH_AGE };
  }
  private limit(ipHash: string) {
    const now = Date.now();
    this.ctx.storage.transactionSync(() => {
      // Both counters are durable, global for this trip, and cannot be reset by
      // changing cookies. IP counts are deliberately shared-network friendly.
      for (const [key, max] of [['rate:ip:' + ipHash, 90], ['rate:trip', 500]] as const) {
        const bucket = this.get<{ count: number; until: number }>(key) ?? { count: 0, until: now + 600_000 };
        if (bucket.count >= max) fail(429, 'RATE_LIMIT', '请求过于频繁，请在 10 分钟后重试。');
        bucket.count++;
        this.put(key, bucket, bucket.until);
      }
    });
    // Expired records are removed without a permanent recurring alarm.
    this.ctx.storage.sql.exec('DELETE FROM records WHERE expires>0 AND expires<=?', now);
  }
  private secret(): string {
    if (!validToken(this.env.AUTH_SECRET)) return fail(503, 'CONFIG_REQUIRED', '网站还在配置中。');
    return this.env.AUTH_SECRET;
  }
  private origin(): string { return this.env.APP_ORIGIN!; }
  private rpID(): string { return new URL(this.origin()).hostname; }
  private async candidate(memberId: string, generation: number) {
    const raw = token();
    const hash = await digest(raw);
    const invite: Invite = { memberId, generation, status: 'active', failures: 0, expires: Date.now() + INVITE_AGE, pending: await seal(this.secret(), raw, memberId) };
    return { hash, invite };
  }
  private replaceInvite(member: Member, next: Awaited<ReturnType<TripAuth['candidate']>>) {
    if (member.inviteHash) {
      const previous = this.get<Invite>('invite:' + member.inviteHash);
      if (previous) { previous.status = 'revoked'; delete previous.pending; this.put('invite:' + member.inviteHash, previous, previous.expires); }
    }
    member.inviteHash = next.hash;
    member.generation = next.invite.generation;
    this.put('member:' + member.id, member);
    this.put('invite:' + next.hash, next.invite, next.invite.expires);
  }
  private activeInvite(hash: string): { member: Member; invite: Invite } {
    const invite = this.get<Invite>('invite:' + hash);
    const member = invite ? this.get<Member>('member:' + invite.memberId) : undefined;
    if (!invite || !member || member.inviteHash !== hash || invite.status !== 'active' || invite.failures >= MAX_FAILURES) {
      return fail(410, 'INVITE_UNAVAILABLE', '邀请已失效或已使用，请联系领队获取新邀请。');
    }
    return { invite, member };
  }
  private async issueSession(userId: string, role: Session['role']) {
    const raw = token();
    const hash = await digest(raw);
    const now = Date.now();
    return { raw, hash, session: { userId, role, expires: now + SESSION_AGE, created: now, verifiedAt: role === 'leader' ? now : 0 } satisfies Session };
  }
  private storeSession(created: Awaited<ReturnType<TripAuth['issueSession']>>, previousHash: string): Result {
    if (previousHash) this.del('session:' + previousHash);
    this.put('session:' + created.hash, created.session, created.session.expires);
    return { ...ok({ authenticated: true }), sessionToken: created.raw };
  }
  private consumeChallenge(body: Record<string, unknown>, context: Context, kind: Challenge['kind']): Challenge {
    const id = field(body, 'challengeId');
    const challenge = this.get<Challenge>('challenge:' + id);
    if (!challenge || challenge.kind !== kind || challenge.sessionHash !== context.sessionHash) return fail(400, 'CHALLENGE_INVALID', '验证已过期，请重新开始。');
    this.del('challenge:' + id);
    return challenge;
  }
  private async registrationOptions(body: Record<string, unknown>, context: Context, setup: boolean): Promise<Result> {
    if (setup) {
      if (this.get('leader')) return fail(409, 'ALREADY_SETUP', '领队已完成绑定，请使用 Passkey 登录。');
      if (!validToken(this.env.SETUP_SECRET) || !await sameSecret(this.env.SETUP_SECRET, field(body, 'setupSecret'))) return fail(403, 'SETUP_DENIED', '初始化凭证不正确。');
    } else this.requireLeader(context, true);
    const keys = this.all<Passkey>('passkey:');
    if (keys.length >= 5) return fail(409, 'KEY_LIMIT', '最多保留 5 个 Passkey。');
    const options = await generateRegistrationOptions({ rpName: '关西七日 · 领队', rpID: this.rpID(), userName: 'trip-leader', userDisplayName: '行程领队', userID: bytes('leader:' + this.env.TRIP_ID), attestationType: 'none', supportedAlgorithmIDs: [-7, -257], authenticatorSelection: { residentKey: 'required', userVerification: 'required' }, excludeCredentials: keys.map(k => ({ id: k.id, transports: k.transports })) });
    const challengeId = token();
    this.put('challenge:' + challengeId, { challenge: options.challenge, kind: setup ? 'setup' : 'register', sessionHash: context.sessionHash, setupHash: setup ? await digest(this.env.SETUP_SECRET!) : undefined, name: typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '我的 Passkey' } satisfies Challenge, Date.now() + FRESH_AGE);
    return ok({ options, challengeId });
  }
  private async registrationVerify(body: Record<string, unknown>, context: Context, setup: boolean): Promise<Result> {
    if (!setup) this.requireLeader(context, true);
    const challenge = this.consumeChallenge(body, context, setup ? 'setup' : 'register');
    if (setup && (this.get('leader') || challenge.setupHash !== await digest(this.env.SETUP_SECRET ?? ''))) return fail(409, 'SETUP_DENIED', '初始化已失效。');
    const result = await verifyRegistrationResponse({ response: body.response as RegistrationResponseJSON, expectedChallenge: challenge.challenge, expectedOrigin: this.origin(), expectedRPID: this.rpID(), requireUserVerification: true });
    if (!result.verified || !result.registrationInfo) return fail(400, 'PASSKEY_FAILED', 'Passkey 验证失败，请重试。');
    const credential = result.registrationInfo.credential;
    const session = setup ? await this.issueSession('leader', 'leader') : undefined;
    return this.ctx.storage.transactionSync(() => {
      if (setup) { if (this.get('leader')) return fail(409, 'ALREADY_SETUP', '领队已绑定。'); }
      else this.requireLeader(context, true);
      if (this.all<Passkey>('passkey:').length >= 5 || this.get('passkey:' + credential.id)) return fail(409, 'KEY_EXISTS', '此凭证已存在或已达到数量上限。');
      const transports = credential.transports?.filter((v): v is AuthenticatorTransport => ['ble', 'hybrid', 'internal', 'nfc', 'usb', 'smart-card'].includes(v));
      this.put('passkey:' + credential.id, { id: credential.id, publicKey: encode(credential.publicKey), counter: credential.counter, transports, name: challenge.name || '我的 Passkey', created: Date.now() } satisfies Passkey);
      if (setup) {
        this.put('leader', { created: Date.now() });
        this.put('used-setup:' + challenge.setupHash, true);
        return this.storeSession(session!, context.sessionHash);
      }
      // Adding a key consumes the recent verification window.
      const current = this.requireLeader(context);
      current.verifiedAt = 0;
      this.put('session:' + context.sessionHash, current, current.expires);
      return ok();
    });
  }
  private async loginOptions(context: Context): Promise<Result> {
    const keys = this.all<Passkey>('passkey:');
    if (!keys.length) return fail(409, 'SETUP_REQUIRED', '领队尚未完成初始化。');
    const options = await generateAuthenticationOptions({ rpID: this.rpID(), userVerification: 'required', allowCredentials: keys.map(k => ({ id: k.id, transports: k.transports })) });
    const challengeId = token();
    this.put('challenge:' + challengeId, { challenge: options.challenge, kind: 'login', sessionHash: context.sessionHash } satisfies Challenge, Date.now() + FRESH_AGE);
    return ok({ options, challengeId });
  }
  private async loginVerify(body: Record<string, unknown>, context: Context): Promise<Result> {
    const challenge = this.consumeChallenge(body, context, 'login');
    const response = body.response as AuthenticationResponseJSON;
    const key = this.get<Passkey>('passkey:' + response?.id);
    if (!key) return fail(400, 'PASSKEY_FAILED', 'Passkey 验证失败。');
    const result = await verifyAuthenticationResponse({ response, expectedChallenge: challenge.challenge, expectedOrigin: this.origin(), expectedRPID: this.rpID(), requireUserVerification: true, credential: { id: key.id, publicKey: decode(key.publicKey), counter: key.counter, transports: key.transports } });
    if (!result.verified) return fail(400, 'PASSKEY_FAILED', 'Passkey 验证失败。');
    const session = await this.issueSession('leader', 'leader');
    return this.ctx.storage.transactionSync(() => {
      const current = this.get<Passkey>('passkey:' + key.id);
      if (!current || current.publicKey !== key.publicKey || current.counter !== key.counter) return fail(409, 'PASSKEY_CHANGED', '凭证已更改，请重新验证。');
      current.counter = result.authenticationInfo.newCounter;
      this.put('passkey:' + key.id, current);
      return this.storeSession(session, context.sessionHash);
    });
  }
  private async inviteInfo(body: Record<string, unknown>): Promise<Result> {
    if (!validToken(body.token)) return fail(410, 'INVITE_UNAVAILABLE', '邀请无效，请联系领队。');
    const { member, invite } = this.activeInvite(await digest(body.token));
    return ok({ name: member.name, question: member.question, remaining: MAX_FAILURES - invite.failures, expires: invite.expires });
  }
  private async inviteVerify(body: Record<string, unknown>, context: Context): Promise<Result> {
    if (!validToken(body.token)) return fail(410, 'INVITE_UNAVAILABLE', '邀请无效，请联系领队。');
    const answer = normalizeAnswer(field(body, 'answer', 200));
    const hash = await digest(body.token);
    const { member } = this.activeInvite(hash);
    const correct = await checkMac(this.secret(), 'answer:' + member.id + ':' + answer, member.answerMac);
    const replacement = correct ? undefined : await this.candidate(member.id, member.generation + 1);
    const session = correct ? await this.issueSession(member.id, 'member') : undefined;
    return this.ctx.storage.transactionSync(() => {
      // Re-read after crypto awaits. Exactly one concurrent request can consume
      // the invite or rotate its generation; old requests never affect the new one.
      const current = this.activeInvite(hash);
      if (current.member.answerMac !== member.answerMac) return fail(409, 'INVITE_CHANGED', '邀请已更新，请重新打开。');
      if (correct) {
        current.invite.status = 'used'; delete current.invite.pending;
        this.put('invite:' + hash, current.invite, current.invite.expires);
        return this.storeSession(session!, context.sessionHash);
      }
      current.invite.failures++;
      this.put('invite:' + hash, current.invite, current.invite.expires);
      if (current.invite.failures >= MAX_FAILURES) {
        this.replaceInvite(current.member, replacement!);
        // Never return the replacement token to this request.
        return { status: 410, data: { code: 'INVITE_LOCKED', error: '尝试次数已用完，邀请已失效。请联系领队领取新邀请。' } };
      }
      return { status: 401, data: { code: 'ANSWER_WRONG', error: '答案不正确。', remaining: MAX_FAILURES - current.invite.failures } };
    });
  }
  private members(context: Context): Result {
    this.requireLeader(context);
    const sessions = this.all<Session>('session:');
    return ok({ members: this.all<Member>('member:').map(m => {
      const i = m.inviteHash ? this.get<Invite>('invite:' + m.inviteHash) : undefined;
      return { id: m.id, name: m.name, question: m.question, generation: m.generation, inviteStatus: i?.status ?? 'expired', pending: Boolean(i?.pending), failures: i?.failures ?? 0, expires: i?.expires, sessions: sessions.filter(s => s.userId === m.id).length };
    }), passkeys: this.all<Passkey>('passkey:').map(k => ({ id: k.id, name: k.name, created: k.created })) });
  }
  private async createMember(body: Record<string, unknown>, context: Context): Promise<Result> {
    this.requireLeader(context, true);
    const id = token();
    const name = field(body, 'name', 40), question = field(body, 'question', 160), answer = normalizeAnswer(field(body, 'answer', 200));
    const member: Member = { id, name, question, answerMac: await mac(this.secret(), 'answer:' + id + ':' + answer), generation: 0 };
    const next = await this.candidate(id, 1);
    this.ctx.storage.transactionSync(() => {
      this.requireLeader(context, true);
      if (this.all('member:').length >= 5) return fail(409, 'MEMBER_LIMIT', '最多添加 5 位成员。');
      this.replaceInvite(member, next);
    });
    return ok({ id });
  }
  private async rotate(body: Record<string, unknown>, context: Context): Promise<Result> {
    this.requireLeader(context, true);
    const id = field(body, 'memberId');
    const member = this.get<Member>('member:' + id);
    if (!member) return fail(404, 'NOT_FOUND', '找不到此成员。');
    const answer = typeof body.answer === 'string' && body.answer.trim() ? normalizeAnswer(field(body, 'answer', 200)) : undefined;
    const answerMac = answer ? await mac(this.secret(), 'answer:' + id + ':' + answer) : undefined;
    const question = answer ? field(body, 'question', 160) : undefined;
    const next = await this.candidate(id, member.generation + 1);
    this.ctx.storage.transactionSync(() => {
      this.requireLeader(context, true);
      const current = this.get<Member>('member:' + id);
      if (!current || current.generation !== member.generation) return fail(409, 'INVITE_CHANGED', '邀请刚刚更新，请刷新后重试。');
      if (answerMac && question) { current.answerMac = answerMac; current.question = question; }
      this.replaceInvite(current, next);
    });
    return ok();
  }
  private async claim(body: Record<string, unknown>, context: Context): Promise<Result> {
    this.requireLeader(context, true);
    const id = field(body, 'memberId');
    const member = this.get<Member>('member:' + id);
    if (!member?.inviteHash) return fail(404, 'NOT_FOUND', '找不到邀请。');
    const { invite } = this.activeInvite(member.inviteHash);
    if (!invite.pending) return fail(409, 'ALREADY_CLAIMED', '此邀请已领取。若没有保存，请重新生成。');
    const raw = await unseal(this.secret(), invite.pending, id);
    return this.ctx.storage.transactionSync(() => {
      this.requireLeader(context, true);
      const current = this.activeInvite(member.inviteHash!);
      if (!current.invite.pending) return fail(409, 'ALREADY_CLAIMED', '此邀请已领取。');
      delete current.invite.pending;
      this.put('invite:' + member.inviteHash, current.invite, current.invite.expires);
      return ok({ url: this.origin() + '/invite#token=' + raw, expires: invite.expires });
    });
  }
  private revoke(body: Record<string, unknown>, context: Context): Result {
    this.requireLeader(context, true);
    const id = field(body, 'memberId');
    this.ctx.storage.transactionSync(() => {
      const member = this.get<Member>('member:' + id);
      if (!member) return fail(404, 'NOT_FOUND', '找不到此成员。');
      this.removeSessions(id);
      if (member.inviteHash) {
        const i = this.get<Invite>('invite:' + member.inviteHash);
        if (i) { i.status = 'revoked'; delete i.pending; this.put('invite:' + member.inviteHash, i, i.expires); }
      }
    });
    return ok();
  }
  private deletePasskey(body: Record<string, unknown>, context: Context): Result {
    this.requireLeader(context, true);
    const id = field(body, 'id', 1500);
    const keys = this.all<Passkey>('passkey:');
    if (keys.length <= 1) return fail(409, 'LAST_KEY', '请先添加备用 Passkey，不能删除最后一个。');
    if (!this.get('passkey:' + id)) return fail(404, 'NOT_FOUND', '找不到凭证。');
    this.ctx.storage.transactionSync(() => {
      this.del('passkey:' + id);
      this.removeSessions('leader');
    });
    return { ...ok(), clearSession: true };
  }
  private async recover(body: Record<string, unknown>): Promise<Result> {
    if (this.env.ADMIN_RECOVERY_ENABLED !== 'true') return fail(403, 'RECOVERY_DISABLED', '恢复入口未启用。');
    const supplied = field(body, 'setupSecret');
    if (!validToken(this.env.SETUP_SECRET) || !await sameSecret(this.env.SETUP_SECRET, supplied)) return fail(403, 'SETUP_DENIED', '恢复凭证不正确。');
    const hash = await digest(supplied);
    this.ctx.storage.transactionSync(() => {
      if (this.get('used-setup:' + hash)) return fail(409, 'SECRET_USED', '请在 Cloudflare 配置新的初始化凭证。');
      this.ctx.storage.sql.exec("DELETE FROM records WHERE key LIKE 'passkey:%' OR key LIKE 'challenge:%'");
      this.removeSessions('leader');
      this.del('leader');
      this.put('used-setup:' + hash, true);
    });
    return { ...ok({ setupRequired: true }), clearSession: true };
  }
  async execute(path: string, bodyJSON: string, context: Context): Promise<string> {
    return JSON.stringify(await this.dispatch(path, JSON.parse(bodyJSON) as Record<string, unknown>, context));
  }
  private async dispatch(path: string, body: Record<string, unknown>, context: Context): Promise<Result> {
    try {
      this.secret();
      if (path === '/api/session') return ok({ user: await this.identity(context.sessionHash), setupRequired: !this.get('leader') });
      if (path === '/api/admin/members') return this.members(context);
      if (path === '/api/comments' || path.startsWith('/api/comments/')) {
        const session = this.get<Session>('session:' + context.sessionHash);
        if (!session) return fail(401, 'LOGIN_REQUIRED', '登录已失效，请重新登录。');
        const member = session.role === 'member' ? this.get<Member>('member:' + session.userId) : undefined;
        if (session.role === 'member' && !member) return fail(401, 'LOGIN_REQUIRED', '登录已失效，请重新登录。');
        return ok(this.comments.execute(path, body, { id: session.userId, role: session.role, name: member?.name ?? '领队' }));
      }
      this.limit(context.ipHash);
      switch (path) {
        case '/api/setup/options': return await this.registrationOptions(body, context, true);
        case '/api/setup/verify': return await this.registrationVerify(body, context, true);
        case '/api/passkey/options': return await this.loginOptions(context);
        case '/api/passkey/verify': return await this.loginVerify(body, context);
        case '/api/admin/passkey/options': return await this.registrationOptions(body, context, false);
        case '/api/admin/passkey/verify': return await this.registrationVerify(body, context, false);
        case '/api/admin/passkey/delete': return this.deletePasskey(body, context);
        case '/api/invite/info': return await this.inviteInfo(body);
        case '/api/invite/verify': return await this.inviteVerify(body, context);
        case '/api/admin/member/create': return await this.createMember(body, context);
        case '/api/admin/invite/rotate': return await this.rotate(body, context);
        case '/api/admin/invite/claim': return await this.claim(body, context);
        case '/api/admin/member/revoke': return this.revoke(body, context);
        case '/api/setup/recover': return await this.recover(body);
        case '/api/logout': this.del('session:' + context.sessionHash); return { ...ok(), clearSession: true };
        default: return { status: 404, data: { error: '找不到此操作。' } };
      }
    } catch (error) {
      if (error instanceof CommentError) return { status: error.status, data: { code: 'COMMENT_ERROR', error: error.message } };
      if (error instanceof AuthError) return { status: error.status, data: { code: error.code, error: error.message } };
      // Authenticator parsing/signature failures are deliberately indistinguishable.
      if (path.endsWith('/verify')) return { status: 400, data: { code: 'VERIFICATION_FAILED', error: '验证失败，请重新开始。' } };
      console.error(JSON.stringify({ event: 'auth_operation_failed', operation: path }));
      return { status: 500, data: { code: 'SERVER_ERROR', error: '暂时无法完成，请稍后重试。' } };
    }
  }
}
