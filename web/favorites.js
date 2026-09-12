import { FAVORITE_REGIONS } from '../src/favorite-regions';

const $ = id => document.getElementById(id);
let version = 0, pending = null, saving = false;
function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
async function api(path, body) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  if (response.status === 401) { location.assign('/login'); throw new Error('请重新登录。'); }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '暂时无法访问收藏夹，请重试。');
  return data;
}
const interestPending = new Set();
function interestControls(item) {
  const wrap = node('div', undefined, 'favorite-interest');
  wrap.dataset.interestId = item.id;
  const button = node('button', undefined, 'favorite-interest-button');button.type = 'button';
  button.setAttribute('aria-pressed', String(item.interested));
  button.setAttribute('aria-label', `${item.interested ? '取消感兴趣' : '感兴趣'}：${item.title}`);
  button.disabled = interestPending.has(item.id);
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');icon.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z');icon.append(path);
  button.append(icon);
  const people = node('div', undefined, 'favorite-interest-people');
  people.setAttribute('role', 'list');people.setAttribute('aria-label', '感兴趣的成员');
  for (const name of item.interestNames) {
    const avatar = node('span', undefined, 'favorite-interest-avatar');
    avatar.setAttribute('role', 'listitem');avatar.setAttribute('aria-label', name);
    avatar.title = name;avatar.tabIndex = 0;
    avatar.append(node('span', name));people.append(avatar);
  }
  const count = node('span', `${item.interestCount} 人`, 'favorite-interest-count');
  count.setAttribute('aria-label', `${item.interestCount} 人感兴趣`);
  const status = node('p', '', 'favorite-interest-status');status.setAttribute('role', 'status');
  button.addEventListener('click', async () => {
    if (interestPending.has(item.id)) return;
    interestPending.add(item.id);button.disabled = true;status.textContent = '正在保存…';
    let result, error;
    try { result = await api('/api/favorites/interest', { favoriteId: item.id, interested: !item.interested }); }
    catch (caught) { error = caught; }
    finally { interestPending.delete(item.id); }
    // Ignore an older list response; update only this card, keeping its position.
    version++;$('favorites-refresh').disabled = false;
    const current = document.querySelector(`[data-interest-id="${item.id}"]`);
    if (!current) return;
    if (result) {
      const hadFocus = current.contains(document.activeElement);
      const next = interestControls({ ...item, ...result });
      current.replaceWith(next);
      next.querySelector('[role=status]').textContent = result.interested ? '已记录你的兴趣。' : '已取消。';
      if (hadFocus) next.querySelector('button').focus({ preventScroll: true });
    } else {
      current.querySelector('button').disabled = false;
      current.querySelector('[role=status]').textContent = error.message + ' 请重试。';
    }
  });
  wrap.append(button, people, count, status);return wrap;
}
function card(item) {
  const el = node('article', undefined, 'favorite-card');
  el.dataset.favoriteId = item.id;
  el.append(node('h4', item.title));
  const detail = node('dl');
  detail.append(node('dt', '营业时间'), node('dd', item.hours));
  el.append(detail);
  const link = node('a', 'Google 地图 ↗'); link.href = item.mapsUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
  const links = node('div', undefined, 'favorite-card-links');links.append(link);
  if (item.sourceUrl) { const source = node('a', '消息来源 ↗');source.href = item.sourceUrl;source.target = '_blank';source.rel = 'noopener noreferrer';links.append(source); }
  el.append(links, node('p', `${item.name} 收藏 · ${new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Tokyo', dateStyle: 'medium' }).format(item.created)}`, 'favorite-meta'));
  el.append(interestControls(item));
  return el;
}
function groups(items) {
  return FAVORITE_REGIONS.flatMap(region => {
    const entries = items.filter(item => item.region === region.id);
    if (!entries.length) return [];
    const group = node('section', undefined, 'favorite-region');group.dataset.region = region.id;
    group.setAttribute('aria-labelledby', 'region-' + region.id);
    const heading = node('h3', region.name);heading.id = 'region-' + region.id;
    heading.append(node('span', `${entries.length} 个地点`));
    group.append(heading, ...entries.map(card));return [group];
  });
}
async function load() {
  const request = ++version, status = $('favorite-list-status');
  status.textContent = '正在读取大家的收藏…';
  $('favorites-refresh').disabled = true;
  try {
    const data = await api('/api/favorites');
    if (request !== version) return;
    $('favorite-list').replaceChildren(...groups(data.favorites));
    $('favorite-count').textContent = `· ${data.favorites.length}`;
    status.textContent = data.favorites.length ? '收藏供大家参考，尚未纳入正式行程。' : '还没有收藏。添加第一家想去的小店吧。';
  } catch (error) {
    if (request === version) status.textContent = error.message + ' 可以点击“刷新列表”重试。';
  } finally { if (request === version) $('favorites-refresh').disabled = false; }
}
function init() {
  const form = $('favorite-form'); if (!form) return;
  const hoursInput = form.elements.hours;
  const syncHoursMode = () => {
    const pendingHours = form.elements.hoursMode.value === 'pending';
    hoursInput.disabled = pendingHours;
    hoursInput.required = !pendingHours;
  };
  form.querySelectorAll('[name=hoursMode]').forEach(radio => radio.addEventListener('change', syncHoursMode));
  form.addEventListener('reset', () => queueMicrotask(syncHoursMode));
  syncHoursMode();
  const values = () => ({ region: form.elements.region.value, title: form.elements.title.value.trim(), hours: form.elements.hoursMode.value === 'pending' ? '待确认' : hoursInput.value.trim(), mapsUrl: form.elements.mapsUrl.value.trim(), sourceUrl: form.elements.sourceUrl.value.trim() });
  const regionSelect = $('favorite-region');
  for (const region of FAVORITE_REGIONS) { const option = node('option', region.name);option.value = region.id;regionSelect.append(option); }
  $('favorites-refresh').addEventListener('click', load);
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (saving) return;
    const value = values();
    const signature = JSON.stringify(value);
    if (!pending || pending.signature !== signature) pending = { signature, requestId: crypto.randomUUID() };
    const button = form.querySelector('button[type=submit]'), status = $('favorite-form-status');
    saving = true; button.disabled = true; button.textContent = '正在收藏…'; status.textContent = '';
    try {
      await api('/api/favorites/create', { ...value, requestId: pending.requestId });
      // Do not erase a newer draft typed while the request was in flight.
      if (JSON.stringify(values()) === signature) form.reset();
      pending = null; status.textContent = '已收藏，所有成员都能看到。';
      await load();
    } catch (error) { status.textContent = error.message; }
    finally { saving = false; button.disabled = false; button.textContent = '添加到收藏夹'; }
  });
  window.addEventListener('favorites:show', load);
  if (new URLSearchParams(location.hash.slice(1)).get('view') === 'favorites') load();
}
init();
