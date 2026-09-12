const drafts = new Map();
const views = new Set();
let inbox, inboxView, reviewButton, summaryVersion = 0;
function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function button(text, action) {
  const el = node('button', 'comment-button', text); el.type = 'button'; el.onclick = action; return el;
}
async function api(path, body) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  if (response.status === 401) { location.assign('/login'); throw new Error('请重新登录。'); }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '暂时无法访问评论，请重试。');
  return data;
}
const time = stamp => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(stamp) + ' 日本时间';
function contextLabel(c) { return `Day ${c.day}${c.plan === 'shared' ? '' : ' · Plan ' + c.plan} · ${c.place} · ${c.time}`; }
function scrollToTarget(target) {
  const host = [...document.querySelectorAll('[data-comment-target]')].find(el => el.dataset.commentTarget === target);
  if (!host) return;
  const detail = host.querySelector('details'); if (detail) detail.open = true;
  host.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function commentCard(c, view) {
  const card = node('article', 'comment-card'); card.dataset.commentId = c.id;
  if (!view.target) {
    const link = node('a', 'comment-context', contextLabel(c.context));
    if (!c.archived) {
      link.href = `#day=${c.context.day}&plan=${c.context.plan === 'B' ? 'B' : 'A'}&step=${encodeURIComponent(c.target)}`;
      link.onclick = () => { inbox.close(); setTimeout(() => scrollToTarget(c.target), 0); };
    } else { link.textContent += '（原行程节点已移除）'; }
    card.append(link);
  }
  const meta = node('div', 'comment-meta');
  meta.append(node('strong', '', c.name), node('span', 'comment-badge', c.role === 'leader' ? '领队' : '同行成员'), node('span', c.resolved ? 'comment-state resolved' : 'comment-state', c.resolved ? '已处理' : '待讨论'));
  const date = node('time', '', time(c.created)); date.dateTime = new Date(c.created).toISOString();
  card.append(meta, node('p', 'comment-body', c.body), date);
  const actions = node('div', 'comment-actions');
  async function change(control, path, body) {
    control.disabled = true;
    try { await api(path, body); await refreshVisible(); }
    catch (error) { view.message.textContent = error.message; }
    finally { control.disabled = false; }
  }
  if (view.canResolve) actions.append(button(c.resolved ? '重新讨论' : '标记已处理', event => change(event.currentTarget, '/api/comments/resolve', { id: c.id, resolved: !c.resolved })));
  if (c.canDelete) actions.append(button('删除', event => {
    if (confirm('删除这条评论？删除后所有成员都将看不到它。')) change(event.currentTarget, '/api/comments/delete', { id: c.id });
  }));
  card.append(actions);
  return card;
}
function makeView(container, target = '') {
  const list = node('div', 'comment-list'), message = node('p', 'comment-message'); message.setAttribute('role', 'status');
  const more = button('查看更早的评论', () => load(view, true)); more.hidden = true;
  const refresh = button('刷新评论', () => load(view));
  const view = { container, target, list, message, more, next: null, version: 0, status: 'all', canResolve: false, refresh };
  container.append(refresh, message, list, more); views.add(view);
  return view;
}
async function load(view, append = false) {
  const version = ++view.version;
  view.more.disabled = true; view.refresh.disabled = true;
  view.message.textContent = '正在读取评论…';
  const params = new URLSearchParams({ status: view.status });
  if (view.target) params.set('target', view.target);
  if (append && view.next) params.set('before', view.next);
  try {
    const data = await api('/api/comments?' + params);
    if (version !== view.version || !view.container.isConnected) return;
    view.canResolve = data.canResolve;
    if (!append) view.list.replaceChildren();
    const present = new Set([...view.list.children].map(el => el.dataset.commentId));
    for (const c of data.comments) if (!present.has(String(c.id))) view.list.append(commentCard(c, view));
    view.next = data.next; view.more.hidden = !data.next;
    view.message.textContent = view.list.children.length ? '' : view.status === 'open' ? '目前没有待讨论的建议。' : '还没有评论，留下第一个建议吧。';
  } catch (error) { if (version === view.version) view.message.textContent = error.message; }
  finally { if (version === view.version) { view.more.disabled = false; view.refresh.disabled = false; } }
}
function addForm(host, view) {
  const target = view.target;
  const draft = drafts.get(target) ?? { text: '', requestId: null }; drafts.set(target, draft);
  const form = node('form', 'comment-form'), label = node('label', '', '对这一步有什么建议？');
  const input = node('textarea'); input.rows = 3; input.maxLength = 1000; input.required = true; input.value = draft.text;
  input.placeholder = '例如：想多留半小时，或推荐附近的一家餐厅…';
  label.append(input);
  const footer = node('div', 'comment-form-footer'), hint = node('span', '', '所有同行成员可见 · 最多 1000 字');
  const submit = button('发表评论'); submit.type = 'submit';
  input.oninput = () => { draft.text = input.value; draft.requestId = null; };
  footer.append(hint, submit); form.append(label, footer); host.append(form);
  form.onsubmit = async event => {
    event.preventDefault();
    if (!input.value.trim()) { view.message.textContent = '请先写下建议。'; input.focus(); return; }
    // Reuse the ID on a network retry; a slow response cannot publish twice.
    draft.requestId ??= crypto.randomUUID();
    submit.disabled = true; input.disabled = true; view.message.textContent = '正在发表…';
    try {
      await api('/api/comments/create', { target, body: input.value, requestId: draft.requestId });
      draft.text = ''; draft.requestId = null; input.value = '';
      await refreshVisible();
      view.message.textContent = '已发表，所有同行成员都能看到。';
    } catch (error) { view.message.textContent = error.message + ' 你写的内容仍然保留，可以重试。'; }
    finally { submit.disabled = false; input.disabled = false; }
  };
}
function mount() {
  for (const view of views) if (!view.container.isConnected) { view.version++; views.delete(view); }
  for (const host of document.querySelectorAll('[data-comment-target]')) {
    if (host.childElementCount) continue;
    const detail = node('details', 'comment-thread'), summary = node('summary', '', '建议与讨论');
    summary.dataset.commentSummary = host.dataset.commentTarget;
    detail.append(summary);
    const body = node('div', 'comment-thread-body'); detail.append(body); host.append(detail);
    const view = makeView(body, host.dataset.commentTarget);
    addForm(body, view);
    detail.addEventListener('toggle', () => { if (detail.open) load(view); });
  }
  updateSummary();
  const target = new URLSearchParams(location.hash.slice(1)).get('step');
  if (target) scrollToTarget(target);
}
async function updateSummary() {
  const version = ++summaryVersion;
  try {
    const data = await api('/api/comments/summary');
    if (version !== summaryVersion) return;
    const counts = new Map(data.counts.map(c => [c.target, c]));
    for (const el of document.querySelectorAll('[data-comment-summary]')) {
      const c = counts.get(el.dataset.commentSummary);
      el.textContent = c ? `建议与讨论 · ${c.total} 条${c.open ? ' · ' + c.open + ' 条待讨论' : ''}` : '建议与讨论 · 写下你的想法';
    }
    reviewButton.textContent = `全部建议${data.counts.length ? ' · ' + data.counts.reduce((n, c) => n + c.open, 0) + ' 待讨论' : ''}`;
  } catch { reviewButton.textContent = '全部建议 · 点击重试'; }
}
async function refreshVisible() {
  const active = [...views].filter(view => view === inboxView ? inbox.open : view.container.closest('details')?.open);
  await Promise.all([updateSummary(), ...active.map(view => load(view))]);
}
function init() {
  if (!document.getElementById('timeline')) return;
  inbox = node('dialog', 'comments-dialog'); inbox.setAttribute('aria-labelledby', 'comments-title');
  const head = node('div', 'comments-dialog-head'), title = node('h2', '', '大家的行程建议'); title.id = 'comments-title';
  head.append(title, button('关闭', () => inbox.close()));
  inbox.append(head, node('p', 'comment-intro', '所有同行成员共享。点地点名称回到行程讨论；领队可标记处理状态，回复请写在对应地点下方。'));
  const filterLabel = node('label', 'comment-filter', '查看范围 '), filter = node('select');
  for (const [value, text] of [['all', '全部评论'], ['open', '待讨论']]) { const option = node('option', '', text); option.value = value; filter.append(option); }
  filterLabel.append(filter); inbox.append(filterLabel);
  inboxView = makeView(inbox); filter.onchange = () => { inboxView.status = filter.value; load(inboxView); };
  document.body.append(inbox);
  reviewButton = button('全部建议', () => { inbox.showModal(); load(inboxView); });
  document.querySelector('.top-actions').append(reviewButton);
  window.addEventListener('itinerary:render', mount);
  mount();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshVisible(); });
  setInterval(() => { if (!document.hidden && !document.querySelector('.comment-list :focus')) refreshVisible(); }, 60000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
