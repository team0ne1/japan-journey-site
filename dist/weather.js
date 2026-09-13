'use strict';
// Kept independent of the itinerary scheduler: display only.
const tripWeather = (() => {
  let controller, revision = 0, renderId = 0;
  const cache = new Map();
  const selected = new Map();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function condition(code, isDay) {
    if (code === 0) return [isDay === 0 ? '🌙' : '☀️', '晴'];
    if (code === 1 || code === 2) return [isDay === 0 ? '☁️' : '🌤️', '多云'];
    if (code === 3) return ['☁️', '阴'];
    if ([45,48].includes(code)) return ['🌫️', '雾'];
    if ([51,53,55].includes(code)) return ['🌦️', '毛毛雨'];
    if ([56,57,66,67].includes(code)) return ['🌧️', '冻雨'];
    if ([61,63,65].includes(code)) return ['🌧️', '雨'];
    if ([71,73,75,77,85,86].includes(code)) return ['🌨️', '雪'];
    if ([80,81,82].includes(code)) return ['🌦️', '阵雨'];
    if ([95,96,99].includes(code)) return ['⛈️', '雷雨'];
    return ['—', '暂无天气'];
  }
  function content(data) {
    if (data.status !== 'ok') return `<p class="weather-message">${data.status === 'past' ? '这一天已结束，当前页面不提供历史天气。' : '天气预报暂未开放：这一天尚未进入未来16天的预报范围。'}日出、日落时间将在数据可用时一同显示。</p>`;
    const time = value => value ? escape(value.slice(11,16)) : '暂无数据';
    const fetched = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Tokyo', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).format(new Date(data.fetchedAt));
    const current = data.current ? (() => {
      const [icon,label] = condition(data.current.code,data.current.isDay);
      return `<div class="weather-now"><span class="weather-icon" aria-hidden="true">${icon}</span><span><small>当前天气</small><strong>${data.current.temperature === null ? '—' : Math.round(data.current.temperature) + '°C'}</strong><span>${label} · ${time(data.current.time)} 更新</span></span></div>`;
    })() : '';
    const cells = data.hours.map(h => {
      const [icon, label] = condition(h.code, h.isDay);
      return `<li class="weather-hour"><time datetime="${escape(h.time)}+09:00">${time(h.time)}</time><span class="weather-icon" aria-hidden="true">${icon}</span><span>${label}</span><strong>${h.temperature === null ? '—' : Math.round(h.temperature) + '°C'}</strong><span class="weather-rain">降雨 ${h.precipitationProbability === null ? '—' : h.precipitationProbability + '%'}</span></li>`;
    }).join('');
    return `${current}<div class="weather-sun"><span>日出 <strong>${time(data.sunrise)}</strong></span><span>日落 <strong>${time(data.sunset)}</strong></span><span class="weather-updated">数据获取于 ${escape(fetched)}${data.stale ? ' · 更新失败，显示上次数据' : ''}</span></div>${data.stale ? '<p class="weather-message">天气服务暂时不可用，以下为最近6小时内获取的预报。</p>' : ''}<div class="weather-scroll" tabindex="0" role="region" aria-label="24小时天气，可左右滚动"><ol class="weather-hours">${cells}</ol></div><p class="weather-hint">左右滑动查看全天 · 降雨为每小时降水概率</p>`;
  }
  async function load(day, plan, location, slide, version) {
    controller?.abort(); controller = new AbortController();
    const result = slide.querySelector('.weather-result');
    const key = `${day.id}:${plan}:${location}`;
    result.setAttribute('aria-busy','true');
    result.innerHTML = '<p class="weather-message" role="status">正在获取当天天气…</p>';
    const requestController = controller;
    const timeout = setTimeout(() => requestController.abort('timeout'), 12000);
    try {
      const previous = cache.get(key);
      let data;
      const now = Date.now();
      // Use the upstream fetch time so browser and edge caches cannot stack into two hours.
      const fetchedAt = previous?.data.fetchedAt ? Date.parse(previous.data.fetchedAt) : previous?.savedAt;
      const cacheAge = now - (previous?.data.stale ? previous.savedAt : fetchedAt);
      const withinStaleWindow = !previous?.data.stale || now - fetchedAt < 6 * 3600000;
      if (previous && previous.japanDate === new Date(now + 9 * 3600000).toISOString().slice(0,10) && cacheAge >= 0 && cacheAge < (previous.data.stale ? 60_000 : 3600000) && withinStaleWindow) data = previous.data;
      else {
        const response = await fetch(`/api/weather?${new URLSearchParams({day:String(day.id),plan,location})}`, { signal: controller.signal, credentials:'same-origin' });
        if (!response.ok) throw new Error(response.status === 401 ? '请重新登录后查看天气。' : '天气暂时无法获取，请稍后重试。');
        data = await response.json();
        cache.set(key, { data, savedAt:Date.now(), japanDate:new Date(Date.now() + 9 * 3600000).toISOString().slice(0,10) });
      }
      if (version !== revision) return;
      result.innerHTML = content(data);
      slide.dataset.loaded = 'true';
      const strip = result.querySelector('.weather-scroll');
      const focusHour = result.querySelectorAll('.weather-hour')[day.id === 0 ? new Date(Date.now() + 9 * 3600000).getUTCHours() : 7];
      if (strip && focusHour) strip.scrollLeft = focusHour.offsetLeft - strip.querySelector('ol').offsetLeft;
    } catch (error) {
      if (version !== revision || (requestController.signal.aborted && requestController.signal.reason !== 'timeout')) return;
      result.innerHTML = `<p class="weather-message" role="status">${escape(requestController.signal.reason === 'timeout' ? '天气获取超时，请稍后重试。' : error.message === '请重新登录后查看天气。' ? error.message : '天气暂时无法获取，请稍后重试。')}</p><button type="button" class="weather-retry">重新获取</button>`;
      result.querySelector('button').addEventListener('click', () => { void load(day, plan, location, slide, ++revision); });
    } finally { clearTimeout(timeout); if (version === revision) result.setAttribute('aria-busy','false'); }
  }
  return {
    hide() { controller?.abort(); ++revision; ++renderId; document.getElementById('day-weather').hidden = true; },
    render(day, plan) {
      controller?.abort(); ++revision; const thisRender = ++renderId;
      const root = document.getElementById('day-weather');
      root.hidden = false;
      const areas = day.id === 0 ? WEATHER_CURRENT_AREAS : ((plan === 'B' ? WEATHER_AREAS_B[day.id] : null) ?? WEATHER_AREAS[day.id]);
      const selectionKey = `${day.id}:${plan}`;
      const initial = Math.max(0, areas.findIndex(([id]) => id === selected.get(selectionKey)));
      root.innerHTML = `<div class="weather-heading"><div><h3>${day.id === 0 ? '当前天气' : '当天的天气'}</h3><p>${day.id === 0 ? '日本当前日期' : `${WEATHER_YEAR}.${escape(day.date)}`} · 日本时间</p></div><div class="weather-carousel-actions" aria-label="切换天气地点"><button type="button" data-weather-previous aria-label="上一个天气地点"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><polyline points="15 6 9 12 15 18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" data-weather-next aria-label="下一个天气地点"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><polyline points="9 6 15 12 9 18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div><div class="weather-carousel" role="region" aria-roledescription="轮播" aria-label="天气地点，左右滑动切换"><div class="weather-track">${areas.map(([id,name],index) => `<article class="weather-place" data-weather-location="${escape(id)}" aria-roledescription="天气卡片" aria-label="${escape(name)}，第${index+1}个，共${areas.length}个"><header><div><span>天气地点</span><h4>${escape(name)}</h4></div><small>${String(index+1).padStart(2,'0')} / ${String(areas.length).padStart(2,'0')}</small></header><div class="weather-result" aria-live="polite"><p class="weather-message">滑动到这里时获取天气…</p></div></article>`).join('')}</div></div><div class="weather-pagination" aria-label="选择天气地点">${areas.map(([id,name],index) => `<button type="button" data-weather-page="${index}" aria-label="查看${escape(name)}天气" aria-current="${index===initial?'true':'false'}"></button>`).join('')}</div><p class="weather-swipe-hint">左右滑动卡片切换地点</p>`;
      const carousel = root.querySelector('.weather-carousel');
      const slides = [...root.querySelectorAll('.weather-place')];
      const pages = [...root.querySelectorAll('[data-weather-page]')];
      const previous = root.querySelector('[data-weather-previous]');
      const next = root.querySelector('[data-weather-next]');
      let active = initial, scrollTimer;
      function activate(index, scroll = false) {
        if (thisRender !== renderId) return;
        index = Math.max(0, Math.min(slides.length - 1, index));
        active = index;
        selected.set(selectionKey, areas[index][0]);
        pages.forEach((page,i) => page.setAttribute('aria-current',String(i===index)));
        previous.disabled = index === 0; next.disabled = index === slides.length - 1;
        if (scroll) carousel.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        if (!slides[index].dataset.loaded) void load(day, plan, areas[index][0], slides[index], ++revision);
      }
      carousel.addEventListener('scroll', () => {
        if (thisRender !== renderId) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const index = slides.reduce((best,slide,i) => Math.abs(slide.offsetLeft-carousel.scrollLeft) < Math.abs(slides[best].offsetLeft-carousel.scrollLeft) ? i : best, 0);
          if (index !== active) activate(index);
        }, 80);
      }, { passive:true });
      previous.addEventListener('click', () => activate(active - 1, true));
      next.addEventListener('click', () => activate(active + 1, true));
      pages.forEach((page,index) => page.addEventListener('click', () => activate(index, true)));
      requestAnimationFrame(() => { if (thisRender === renderId) { carousel.scrollLeft = slides[initial].offsetLeft; activate(initial); } });
    }
  };
})();
function renderWeather(day, plan) { tripWeather.render(day, plan); }
