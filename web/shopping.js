import { mapsUrl, hoursInfo, searchPlaces, placeDetails } from './shopping-places';

const $ = id => document.getElementById(id);
const selected = new Map();
let saving = false, pending, listVersion = 0, searchVersion = 0, observer;
let details = new Map();
const statusPending = new Set();
function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function button(text, action) {
  const el = node('button', text, 'favorite-button'); el.type = 'button';
  el.addEventListener('click', action); return el;
}
function link(text, url) {
  const el = node('a', text); el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; return el;
}
function attribution(container, place) {
  const mark = node('span', 'Google Maps', 'shopping-attribution'); mark.setAttribute('translate', 'no');
  const row = node('div', undefined, 'shopping-provider'); row.append(mark);
  for (const source of place?.attributions ?? []) {
    if (!source.provider) continue;
    let url; try { url = new URL(source.providerURI); } catch { /* Plain text attribution is still displayed. */ }
    row.append(url?.protocol === 'https:' ? link(source.provider, url.href) : node('span', source.provider));
  }
  container.append(row);
}
async function api(path, body) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(15000), ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
  if (response.status === 401) { location.assign('/login'); throw new Error('请重新登录。'); }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '暂时无法访问购物清单，请重试。');
  return data;
}
function fetchDetails(id, retry = false) {
  if (retry) details.delete(id);
  if (!details.has(id)) {
    const request = placeDetails(id).catch(error => { if (details.get(id) === request) details.delete(id); throw error; });
    details.set(id, request);
  }
  return details.get(id);
}
function placeRow(id, initial, remove) {
  const row = node('div', undefined, 'shopping-place');
  const header = node('div', undefined, 'shopping-place-heading');
  const name = link(initial?.displayName || '查看已选店铺 ↗', mapsUrl(id, initial?.displayName)); header.append(name);
  if (remove) { const control = button('移除', remove); control.setAttribute('aria-label', `移除${initial?.displayName || '此店铺'}`); header.append(control); }
  const address = node('p', initial?.formattedAddress || '', 'shopping-address');
  const hours = node('div', '正在读取营业时间…', 'shopping-hours');
  row.append(header, address, hours);
  const populate = async (retry = false) => {
    hours.textContent = '正在读取营业时间…';
    try {
      const place = await fetchDetails(id, retry);
      if (!row.isConnected) return;
      name.textContent = (place.displayName || '查看店铺') + ' ↗'; name.href = mapsUrl(id, place.displayName);
      address.textContent = place.formattedAddress || '';
      const info = hoursInfo(place);
      hours.replaceChildren(node('span', info.label, 'shopping-hours-label'));
      if (info.days.length) { const week = node('ul'); info.days.forEach(day => week.append(node('li', day))); hours.append(week); }
      attribution(hours, place);
    } catch {
      if (!row.isConnected) return;
      hours.replaceChildren(node('span', '营业时间读取失败，可重试或打开 Google 地图确认。'), button('重试', () => populate(true)));
    }
  };
  row.loadPlace = populate;
  return row;
}
function selectedPlaces() {
  const container = $('shopping-selected'); container.replaceChildren();
  for (const [id, place] of selected) {
    const row = placeRow(id, place, () => { selected.delete(id); selectedPlaces(); $('shopping-search-status').textContent = '已移除店铺。'; });
    container.append(row); void row.loadPlace();
  }
  document.querySelectorAll('[data-shop-choice]').forEach(el => {
    el.disabled = selected.has(el.dataset.shopChoice); el.textContent = el.disabled ? '已添加' : '添加';
  });
}
async function search() {
  if (saving) return;
  const query = $('shopping-query').value.trim(), status = $('shopping-search-status');
  if (!query) { status.textContent = '请输入店名，可加上城市帮助区分分店。'; $('shopping-query').focus(); return; }
  const version = ++searchVersion;
  $('shopping-search').disabled = true; $('shopping-results').replaceChildren(); status.textContent = '正在搜索店铺…';
  try {
    const places = await searchPlaces(query);
    if (version !== searchVersion) return;
    status.textContent = places.length ? '请选择对应分店，可继续搜索添加多家。' : '没有找到店铺，试试完整店名和城市；也可以先不填地点。';
    for (const place of places) {
      const row = node('div', undefined, 'shopping-search-result');
      const text = node('div'); text.append(node('strong', place.displayName), node('p', place.formattedAddress, 'shopping-address'));
      const choose = button(selected.has(place.id) ? '已添加' : '添加', () => {
        if (selected.has(place.id)) return;
        if (selected.size >= 8) { status.textContent = '每件商品最多选择 8 家店铺。'; return; }
        selected.set(place.id, place); selectedPlaces();
        choose.textContent = '已添加'; choose.disabled = true;
        status.textContent = `已选 ${selected.size} 家店铺，可以继续搜索。`;
      });
      choose.dataset.shopChoice = place.id; choose.disabled = selected.has(place.id); attribution(text, place); row.append(text, choose); $('shopping-results').append(row);
    }
    if (places.length) attribution($('shopping-results'));
  } catch {
    if (version === searchVersion) status.textContent = '暂时无法搜索 Google 店铺，请稍后重试。仍可不填地点添加商品。';
  } finally { if (version === searchVersion) $('shopping-search').disabled = false; }
}
function itemCard(item) {
  const card = node('article', undefined, 'favorite-card shopping-item'); card.dataset.itemId = item.id; card.dataset.purchased = item.purchased;
  const header = node('div', undefined, 'shopping-item-heading'); header.append(node('h3', item.title));
  const status = node('p', '', 'shopping-status'); status.setAttribute('role', 'status');
  const toggle = button(item.purchased ? '✓ 已买到' : '标记已买到', async () => {
    if (statusPending.has(item.id)) return;
    statusPending.add(item.id); listVersion++; $('shopping-refresh').disabled = true; toggle.disabled = true; status.textContent = '正在保存…';
    try {
      const result = await api('/api/shopping/status', { id: item.id, purchased: !item.purchased });
      item.purchased = result.purchased; card.dataset.purchased = item.purchased;
      toggle.textContent = item.purchased ? '✓ 已买到' : '标记已买到'; toggle.setAttribute('aria-pressed', String(item.purchased));
      status.textContent = item.purchased ? '已记为买到，所有成员都能看到。' : '已恢复为待购买。';
      // Invalidate older reads so they cannot overwrite a confirmed update.
      listVersion++; $('shopping-refresh').disabled = false;
    } catch (error) { status.textContent = error.message || '保存失败，请重试。'; }
    finally { statusPending.delete(item.id); toggle.disabled = false; $('shopping-refresh').disabled = statusPending.size > 0; }
  });
  toggle.setAttribute('aria-pressed', String(item.purchased)); toggle.setAttribute('aria-label', `购买状态：${item.title}`); toggle.disabled = statusPending.has(item.id);
  header.append(toggle); card.append(header);
  if (item.notes) card.append(node('p', item.notes, 'shopping-notes'));
  const stores = node('div', undefined, 'shopping-item-places');
  for (const id of item.placeIds) { const row = placeRow(id); stores.append(row); observer.observe(row); }
  if (!item.placeIds.length) stores.append(node('p', '地点待定 · 路上遇到再买也可以', 'shopping-no-place'));
  card.append(stores, node('p', `${item.name} 添加 · ${new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Tokyo', dateStyle: 'medium' }).format(item.created)}`, 'favorite-meta'), status);
  return card;
}
async function load() {
  if (statusPending.size) return;
  const version = ++listVersion, status = $('shopping-list-status');
  status.textContent = '正在读取大家的购物清单…'; $('shopping-refresh').disabled = true;
  try {
    const { items } = await api('/api/shopping');
    if (version !== listVersion) return;
    observer?.disconnect(); details = new Map();
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { observer.unobserve(entry.target); void entry.target.loadPlace(); }
    }, { rootMargin: '100px' });
    $('shopping-list').replaceChildren(...items.map(itemCard));
    $('shopping-count').textContent = `· ${items.length} 件`;
    status.textContent = items.length ? '打开页面或刷新列表，可查看大家最新添加的商品。' : '清单还是空的，记下第一件想买的东西吧。';
  } catch (error) { if (version === listVersion) status.textContent = (error.message || '读取失败。') + ' 点击“刷新列表”重试。'; }
  finally { if (version === listVersion) $('shopping-refresh').disabled = false; }
}
function init() {
  const form = $('shopping-form'); if (!form) return;
  $('shopping-search').addEventListener('click', search);
  $('shopping-query').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); void search(); } });
  $('shopping-query').addEventListener('input', () => { searchVersion++; $('shopping-search').disabled = false; $('shopping-results').replaceChildren(); $('shopping-search-status').textContent = ''; });
  $('shopping-refresh').addEventListener('click', load);
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (saving) return;
    const value = { title: form.elements.title.value.trim(), notes: form.elements.notes.value.trim(), placeIds: [...selected.keys()] };
    const signature = JSON.stringify(value);
    if (!pending || pending.signature !== signature) pending = { signature, requestId: crypto.randomUUID() };
    saving = true; searchVersion++;
    // Freeze this draft until the server confirms it; failed submissions keep all fields.
    const controls = [...form.querySelectorAll('input,textarea,button')].map(el => [el, el.disabled]);
    controls.forEach(([el]) => { el.disabled = true; });
    const status = $('shopping-form-status'); status.textContent = '正在添加…';
    try {
      await api('/api/shopping/create', { ...value, requestId: pending.requestId });
      form.reset(); selected.clear(); selectedPlaces(); pending = null;
      $('shopping-results').replaceChildren(); $('shopping-search-status').textContent = '';
      status.textContent = '已添加，所有成员都能看到。';
      await load();
    } catch (error) { status.textContent = (error.message || '保存失败。') + ' 内容已保留，可以重试。'; }
    finally { saving = false; controls.forEach(([el, disabled]) => { el.disabled = disabled; }); $('shopping-search').disabled = false; }
  });
  window.addEventListener('shopping:show', load);
  window.addEventListener('hashchange', () => { if (new URLSearchParams(location.hash.slice(1)).get('view') !== 'shopping') observer?.disconnect(); });
  if (new URLSearchParams(location.hash.slice(1)).get('view') === 'shopping') void load();
}
init();
