import { startRegistration, startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser';

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date = value => value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '—';
let identity = null;
let invitationToken = new URLSearchParams(location.hash.slice(1)).get('token');
if (location.pathname === '/invite' && invitationToken) history.replaceState(null, '', '/invite');
async function api(path, body) {
  const response = await fetch(path, { method: body === undefined ? 'GET' : 'POST', headers: body === undefined ? undefined : { 'Content-Type':'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), credentials: 'same-origin', cache: 'no-store' });
  const data = await response.json();
  if (!response.ok) { const error = new Error(data.error || '暂时无法完成操作。'); error.code = data.code; error.remaining = data.remaining; throw error; }
  return data;
}
function message(text, error = false, id = 'auth-message') { const node = $(id); if (node) { node.textContent = text; node.classList.toggle('error', error); } }
async function busy(button, action, target = 'auth-message') {
  if (button.disabled) return;
  button.disabled = true; message('', false, target);
  try { await action(); } catch (error) {
    let text = error.message;
    if (error.name === 'NotAllowedError' || error.name === 'AbortError') text = '验证已取消或超时，可以重新尝试。';
    if (error.remaining !== undefined) text += ` 剩余 ${error.remaining} 次机会。`;
    message(text, true, target);
  } finally { button.disabled = false; }
}
async function loginPasskey() {
  if (!browserSupportsWebAuthn()) throw new Error('此浏览器暂不支持 Passkey，请用最新版 Safari、Chrome 或 Edge 打开正式 HTTPS 地址。');
  const { options, challengeId } = await api('/api/passkey/options', {});
  const response = await startAuthentication({ optionsJSON: options });
  await api('/api/passkey/verify', { challengeId, response });
  identity = (await api('/api/session')).user;
}
async function management(path, body) {
  try { return await api(path, body); }
  catch (error) { if (error.code !== 'STEP_UP') throw error; await loginPasskey(); return api(path, body); }
}
async function registerPasskey(setupSecret, name = '我的 Passkey') {
  if (!browserSupportsWebAuthn()) throw new Error('请使用支持 Passkey 的浏览器，并通过正式 HTTPS 地址访问。');
  const base = setupSecret ? '/api/setup' : '/api/admin/passkey';
  if (!setupSecret) await loginPasskey();
  const { options, challengeId } = await api(base + '/options', { setupSecret, name });
  const response = await startRegistration({ optionsJSON: options });
  await api(base + '/verify', { challengeId, response });
}
function enterTrip() { location.replace('/'); }
async function authPage() {
  const status = await api('/api/session');
  identity = status.user;
  const setup = location.pathname === '/setup';
  const invite = location.pathname === '/invite';
  if (identity && !setup) { invitationToken = null; return enterTrip(); }
  if (invite) {
    $('auth-title').textContent = '这是你的专属邀请';
    if (!invitationToken) { $('auth-content').textContent = '请重新打开领队发给你的完整邀请链接。'; return; }
    let info;
    try { info = await api('/api/invite/info', { token: invitationToken }); }
    catch (error) {
      if (error.code !== 'INVITE_UNAVAILABLE') throw error;
      invitationToken = null;
      $('auth-title').textContent = '邀请已使用或失效';
      $('auth-intro').textContent = '当前浏览器没有有效登录。若你之前已验证，请使用当时的同一个浏览器访问网站首页，登录有效时会自动进入。';
      $('auth-content').innerHTML = '<p class="panel-note">微信等应用内浏览器、Chrome 和 Safari 的登录信息可能不互通。更换浏览器、退出登录、清除网站数据或登录到期后，请联系领队获取新邀请。</p><a class="auth-button primary" href="/">前往网站首页</a>';
      return;
    }
    $('auth-intro').textContent = `${info.name}，回答下面的问题，就可以查看我们的行程。`;
    $('auth-content').innerHTML = `<form id="invite-form" class="auth-form"><label>${esc(info.question)}<input name="answer" autocomplete="off" maxlength="200" required autofocus></label><button class="auth-button primary" type="submit">进入我们的旅程</button></form><p class="panel-note">剩余 ${info.remaining} 次机会。填写前请核对答案格式。</p>`;
    $('invite-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; busy(form.querySelector('button'), async () => { await api('/api/invite/verify', { token: invitationToken, answer: new FormData(form).get('answer') }); invitationToken = null; form.reset(); enterTrip(); }); });
    return;
  }
  if (setup && status.setupRequired) {
    $('auth-title').textContent = '绑定领队的 Passkey';
    $('auth-intro').textContent = '输入部署时保存的初始化凭证，然后使用设备的面容、指纹或解锁码创建 Passkey。';
    $('auth-content').innerHTML = '<form id="setup-form" class="auth-form"><label>初始化凭证<input name="secret" type="password" autocomplete="off" required maxlength="100"></label><label>给这个 Passkey 起个名字<input name="name" value="我的日常 Passkey" required maxlength="60"></label><button class="auth-button primary">绑定并进入旅程</button></form>';
    $('setup-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; busy(form.querySelector('button'), async () => { const data = new FormData(form); await registerPasskey(data.get('secret'), data.get('name')); form.reset(); enterTrip(); }); });
    return;
  }
  $('auth-content').innerHTML = '<button id="leader-login" type="button" class="auth-button primary">我是领队 · 用 Passkey 登录</button><details class="auth-secondary"><summary>领队首次设置或恢复</summary><p><a href="/setup">首次绑定领队 Passkey</a></p><p>恢复仅在你已按部署说明启用恢复入口后可用。</p><form id="recovery-form" class="auth-form"><label>新的恢复凭证<input name="secret" type="password" autocomplete="off" required maxlength="100"></label><button class="auth-button danger">重置领队凭证</button></form></details>';
  $('leader-login').addEventListener('click', event => busy(event.currentTarget, async () => { await loginPasskey(); enterTrip(); }));
  $('recovery-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; busy(form.querySelector('button'), async () => { if (!confirm('这会使领队的全部 Passkey 和登录失效。继续恢复？')) return; await api('/api/setup/recover', { setupSecret: new FormData(form).get('secret') }); form.reset(); location.replace('/setup'); }); });
  if (status.setupRequired) $('auth-intro').textContent = '领队尚未完成首次绑定。成员请等待领队发送邀请。';
}
function clearInviteOutput() {
  $('invite-url').value = ''; $('invite-output').hidden = true; delete $('invite-output').dataset.member;
}
function showInvite(url, expires, memberId) {
  $('invite-output').dataset.member = memberId;
  $('invite-output').hidden = false;
  $('invite-url').value = url;
  $('invite-expiry').textContent = `有效期至 ${date(expires)}。请单独发送给对应成员；关闭面板后这里不再保留链接。`;
  $('invite-url').focus(); $('invite-url').select();
}
async function refreshMembers() {
  const { members, passkeys } = await api('/api/admin/members');
  const shownMember = $('invite-output').dataset.member;
  if (shownMember && !members.some(m => m.id === shownMember)) clearInviteOutput();
  $('member-list').innerHTML = members.length ? members.map(m => `<article class="member-card"><h3>${esc(m.name)}</h3><span class="member-status">${m.pending ? '有新邀请待领取' : ({active:'邀请已领取，待验证',used:'邀请已使用',revoked:'邀请已撤销',expired:'邀请已过期'})[m.inviteStatus]}</span><p>${m.sessions} 个浏览器已登录 · 此邀请失败 ${m.failures}/5 次 · 第 ${m.generation} 次邀请</p><p>${esc(m.question)}</p><div class="member-actions">${m.pending ? `<button class="auth-button primary" data-action="claim" data-member="${esc(m.id)}">领取邀请链接</button>` : ''}<button class="auth-button" data-action="rotate" data-member="${esc(m.id)}">重新邀请</button><button class="auth-button danger" data-action="revoke" data-member="${esc(m.id)}">撤销登录和邀请</button><button class="auth-button danger" data-action="remove" data-member="${esc(m.id)}" data-name="${esc(m.name)}">移除成员</button></div><details><summary>修改问答并重发</summary><form class="auth-form edit-question" data-member="${esc(m.id)}"><label>问题<input name="question" value="${esc(m.question)}" maxlength="160" required></label><label>新答案<input name="answer" type="password" autocomplete="new-password" maxlength="200" required></label><button class="auth-button">保存并生成新邀请</button></form></details></article>`).join('') : '<p class="panel-note">还没有成员。先填写下面的信息，再领取邀请链接。</p>';
  $('passkey-list').innerHTML = passkeys.map(p => `<div class="passkey-item"><span>${esc(p.name)}<br><small>${date(p.created)}</small></span><button class="auth-button danger" data-action="delete-key" data-key="${esc(p.id)}" ${passkeys.length === 1 ? 'disabled title="不能删除最后一个 Passkey"' : ''}>删除</button></div>`).join('');
  $('member-limit').textContent = `${members.length}/10 位成员，领队单独计入身份管理。`;
}
function createPanel() {
  const dialog = document.createElement('dialog'); dialog.className = 'member-panel'; dialog.id = 'member-panel'; dialog.setAttribute('aria-labelledby', 'panel-title');
  dialog.innerHTML = `<div class="panel-heading"><h2 id="panel-title">成员邀请</h2><button id="panel-close" class="auth-button" aria-label="关闭成员邀请">关闭</button></div><p class="panel-note">只有领队可管理。领取邀请、重发、撤销或移除成员时，可能需要 Passkey 验证。</p><div class="panel-toolbar"><button id="panel-refresh" class="auth-button">刷新状态</button><button id="panel-unlock" class="auth-button">用 Passkey 解锁管理</button></div><p id="panel-message" class="auth-message" role="status" aria-live="polite"></p><section id="invite-output" class="invite-output" hidden><strong>请保存并转发这条邀请</strong><p id="invite-expiry"></p><textarea id="invite-url" readonly aria-label="专属邀请链接"></textarea><button id="copy-invite" class="auth-button">复制链接</button></section><div id="member-list"></div><details><summary>添加成员</summary><p id="member-limit" class="panel-note"></p><form id="create-member" class="auth-form"><label>成员名字或昵称<input name="name" autocomplete="off" maxlength="40" required></label><label>验证问题<input name="question" value="你的生日是几月几日？请按 MM-DD 填写，例如 03-08。" maxlength="160" required></label><label>正确答案<input name="answer" type="password" autocomplete="new-password" maxlength="200" required></label><p class="panel-note">问题中写清格式。答案会忽略首尾空格、全角字符和英文字母大小写；日期分隔符需一致。</p><button class="auth-button primary">添加并生成邀请</button></form></details><details><summary>领队 Passkey 与备用凭证</summary><div id="passkey-list"></div><form id="add-key" class="auth-form"><label>新凭证名称<input name="name" maxlength="60" value="备用 Passkey" required></label><button class="auth-button">验证身份并添加 Passkey</button></form></details>`;
  document.body.append(dialog);
  $('panel-close').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { clearInviteOutput(); dialog.querySelectorAll('input[type=password]').forEach(input => input.value = ''); });
  $('panel-refresh').onclick = event => busy(event.currentTarget, refreshMembers, 'panel-message');
  $('panel-unlock').onclick = event => busy(event.currentTarget, async () => { await loginPasskey(); message('已解锁，管理操作可用 5 分钟。', false, 'panel-message'); }, 'panel-message');
  $('copy-invite').onclick = event => busy(event.currentTarget, async () => { try { await navigator.clipboard.writeText($('invite-url').value); message('已复制，请发送给对应成员。', false, 'panel-message'); } catch { $('invite-url').focus(); $('invite-url').select(); message('请长按或手动复制上面的完整链接。', false, 'panel-message'); } }, 'panel-message');
  dialog.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]'); if (!button) return;
    busy(button, async () => {
      const { action, member: memberId, key: id } = button.dataset;
      if (action === 'claim') { const data = await management('/api/admin/invite/claim', { memberId }); showInvite(data.url, data.expires, memberId); }
      if (action === 'rotate') { if (!confirm('生成新邀请后，此成员的旧邀请会立即失效。继续？')) return; await management('/api/admin/invite/rotate', { memberId }); message('新邀请已生成，请领取。', false, 'panel-message'); }
      if (action === 'revoke') { if (!confirm('此成员的全部浏览器登录和现有邀请都会失效。继续？')) return; await management('/api/admin/member/revoke', { memberId }); }
      if (action === 'remove') {
        if (!confirm(`确定移除“${button.dataset.name}”？所有浏览器登录和邀请链接将失效，成员资料将删除。已有评论会保留，署名改为“已移除成员”。此操作无法撤销。`)) return;
        await management('/api/admin/member/remove', { memberId });
        if ($('invite-output').dataset.member === memberId) clearInviteOutput();
        message('成员已移除，登录和邀请均已失效；现在可以添加新成员。', false, 'panel-message');
      }
      if (action === 'delete-key') { if (!confirm('删除此 Passkey 会同时退出领队的全部浏览器，请确认有可用的备用凭证。')) return; await loginPasskey(); await api('/api/admin/passkey/delete', { id }); return location.replace('/login'); }
      await refreshMembers();
    }, 'panel-message');
  });
  dialog.addEventListener('submit', event => {
    const form = event.target; event.preventDefault();
    busy(form.querySelector('button'), async () => {
      const fields = Object.fromEntries(new FormData(form));
      if (form.id === 'create-member') { await management('/api/admin/member/create', fields); form.reset(); message('成员已添加，请在上方领取邀请。', false, 'panel-message'); }
      else if (form.classList.contains('edit-question')) { await management('/api/admin/invite/rotate', { ...fields, memberId: form.dataset.member }); form.reset(); message('问答已更新，请领取新的邀请。', false, 'panel-message'); }
      else if (form.id === 'add-key') { await registerPasskey(undefined, fields.name); form.reset(); message('备用 Passkey 已添加。', false, 'panel-message'); }
      await refreshMembers();
    }, 'panel-message');
  });
}
async function itineraryPage() {
  identity = (await api('/api/session')).user;
  if (!identity) return location.replace('/login');
  const controls = document.createElement('div'); controls.className = 'account-controls';
  controls.innerHTML = `<span class="account-label">${esc(identity.name)}</span>${identity.role === 'leader' ? '<button id="manage-invites" class="auth-button">成员邀请</button>' : ''}<button id="account-logout" class="auth-button">退出</button>`;
  document.querySelector('.top-actions').append(controls);
  $('account-logout').onclick = event => busy(event.currentTarget, async () => { await api('/api/logout', {}); location.replace('/login'); });
  if (identity.role === 'leader') { createPanel(); $('manage-invites').onclick = event => busy(event.currentTarget, async () => { $('member-panel').showModal(); await refreshMembers(); }, 'panel-message'); }
  // Revalidate on returning to a tab and periodically. Already downloaded content
  // cannot be retracted, but further page/API requests are always server-checked.
  async function checkSession() { try { const {user} = await api('/api/session'); if (!user) location.replace('/login'); } catch { /* Offline reading can continue; next server request still enforces auth. */ } }
  window.addEventListener('pageshow', checkSession);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkSession(); });
  setInterval(() => { if (!document.hidden) checkSession(); }, 60_000);
}
if ($('auth-content')) authPage().catch(error => { $('auth-content').textContent = ''; message(error.message, true); });
else itineraryPage().catch(() => { location.replace('/login'); });
