'use strict';
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)} ↗</a>`;
const placeLink=id=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(PLACES[id][3]);
// Match the supplied Xiaohongshu URL: preserve the place name and percent-encode it twice.
const xiaohongshuLink=id=>'https://www.xiaohongshu.com/search_result_ai?keyword='+encodeURIComponent(encodeURIComponent(HOTELS[id]?.name||PLACES[id][0]));
const routeLink=(from,to,mode)=>'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(PLACES[from][3])+'&destination='+encodeURIComponent(PLACES[to][3])+'&travelmode='+(mode==='walk'?'walking':'transit');
let day=1,plan='A',map=null,layer=null,markers=[],current=null,focusMode=true,tileErrors=0;
function readHash(){const p=new URLSearchParams(location.hash.slice(1));day=Math.min(7,Math.max(0,Math.floor(Number(p.get('day')??1)||0)));plan=p.get('plan')==='B'?'B':'A';}
function change(d=day,p=plan){location.hash=`day=${d}&plan=${p}`;}
function getDay(n){return plan==='B'&&PLAN_B[n]?PLAN_B[n]:DAYS[n-1];}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3500);}
function initMap(){
 if(!window.L){$('map').innerHTML='<p class="map-loading">地图组件未能加载，请使用行程中的分段导航。</p>';$('map-error').hidden=false;return;}
 $('map').innerHTML='';map=L.map('map',{scrollWheelZoom:false,zoomControl:true,minZoom:5,maxZoom:19}).setView([34.85,135.5],9);
 L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',{minZoom:5,maxNativeZoom:18,maxZoom:19,bounds:[[20,122],[46,154]],noWrap:true,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html#pale" target="_blank" rel="noopener">国土地理院 · 淡色地図</a>'}).on('tileerror',()=>{tileErrors++;if(tileErrors>=3)$('map-error').hidden=false;}).on('tileload',()=>{tileErrors=0;$('map-error').hidden=true;}).addTo(map);
 layer=L.layerGroup().addTo(map);
}
function fitMap(focused){focusMode=focused;$('focus').setAttribute('aria-pressed',String(focused));$('fit').setAttribute('aria-pressed',String(!focused));if(!map||!current)return;const ids=focused?current.focus:current.stops.map(s=>s.id);const coords=ids.map(id=>PLACES[id].slice(1,3));map.fitBounds(L.latLngBounds(coords),{padding:[38,38],maxZoom:15,animate:false});}
function selectStop(index,scroll=false){
 const stop=current?.stops[index];if(!stop)return;
 const m=markers[index];
 if(map&&m){map.setView(m.getLatLng(),Math.max(map.getZoom(),14),{animate:false});m.openPopup();}
 document.querySelectorAll('.stop').forEach((el,i)=>el.classList.toggle('active',i===index));
 $('map-selection').innerHTML=`<span class="selected-number">${index+1}</span><div><strong>${escapeHtml(PLACES[stop.id][0])}</strong><p>${escapeHtml(stop.time)}</p></div>${current.id?'<button type="button" id="back-to-stop">查看行程</button>':''}`;
 $('back-to-stop')?.addEventListener('click',()=>{setReadingView('itinerary');const card=document.querySelector(`[data-stop="${index}"]`);card?.scrollIntoView({behavior:'smooth',block:'center'});card?.querySelector('.stop-title')?.focus({preventScroll:true});});
 if(scroll){setReadingView('itinerary');document.querySelector(`[data-stop="${index}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});}
}
function setReadingView(view){
 const reading=view!=='map';document.body.dataset.view=reading?'itinerary':'map';
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===(reading?'itinerary':'map'))));
 requestAnimationFrame(()=>{map?.invalidateSize({animate:false});});
}
function drawMap(){
 if(!map)return;layer.clearLayers();markers=[];
 const grouped=new Map();current.stops.forEach((s,i)=>{if(!grouped.has(s.id))grouped.set(s.id,[]);grouped.get(s.id).push(i);});
 current.stops.forEach((s,i)=>{if(!i)return;const prev=current.stops[i-1],m=MODES[s.mode];if(prev.id===s.id)return;const line=L.polyline([PLACES[prev.id].slice(1,3),PLACES[s.id].slice(1,3)],{color:m.color,weight:3.5,opacity:.8,dashArray:m.dash}).addTo(layer);line.bindTooltip(`${escapeHtml(PLACES[prev.id][0])} → ${escapeHtml(PLACES[s.id][0])} · ${m.name}`);line.bindPopup(`<strong>${m.name} · ${i} → ${i+1}</strong><p>${escapeHtml(s.connection||'按当天实际班次衔接')}</p>${external(s.mode==='shuttle'?hotelShuttleUrl():routeLink(prev.id,s.id,s.mode),s.mode==='shuttle'?'查看接驳说明':'打开本段导航')}<p>连线仅示意顺序，并非道路轨迹。</p>`);});
 grouped.forEach((indices,id)=>{const p=PLACES[id],first=indices[0],s=current.stops[first],numbers=indices.map(i=>i+1).join(' / '),short=indices.length>1?`${first+1}⁺`:String(first+1);const marker=L.marker(p.slice(1,3),{icon:L.divIcon({className:'number-marker',html:`<span class="pin-inner ${HOTELS[id]?'hotel':''}">${short}</span>`,iconSize:[30,30],iconAnchor:[15,15]}),title:`${numbers} ${p[0]}`,alt:p[0],keyboard:true}).addTo(layer);
 marker.bindTooltip(`${numbers} · ${escapeHtml(p[0])}`,{direction:'top',offset:[0,-15],className:'map-label'});
 marker.bindPopup(`<strong>${numbers} · ${escapeHtml(p[0])}</strong>${indices.map(i=>`<p><b>${escapeHtml(current.stops[i].time)}</b><br>${escapeHtml(current.stops[i].note)}${durationFor(current,current.stops[i],i)?`<br><strong class="popup-duration">${escapeHtml(durationFor(current,current.stops[i],i))}</strong>`:''}</p>`).join('')}${current.id?renderAccessHours(id,true):''}${external(placeLink(id),'查看地点')}`,{maxHeight:380});
 marker.on('click',()=>{selectStop(first);document.querySelectorAll('.stop').forEach((el,i)=>el.classList.toggle('active',indices.includes(i)));});indices.forEach(i=>markers[i]=marker);
 });fitMap(focusMode);
}
function hotelShuttleUrl(){return plan==='B'?'https://kada-kaigetsu.com/access/':'https://www.arima-gh.jp/etc/access/';}
function renderHeading(d){
 $('day-heading').innerHTML=`<div class="day-heading"><p class="day-kicker">${day===0?'THE WHOLE JOURNEY · 7 DAYS':`DAY ${String(day).padStart(2,'0')} / 07 · ${escapeHtml(d.date)} ${escapeHtml(d.weekday)}`}</p><h2>${escapeHtml(d.title)}</h2><p class="day-description">${escapeHtml(d.subtitle)}</p>${day===0?'':`<div class="day-chips"><span>${escapeHtml(d.intensity)}</span><span>${d.stops.length}个行程节点</span><span>日本时间</span></div>`}</div>`;
}

function renderTimeline(d){
 $('timeline').innerHTML=`<div class="section-label"><h3>当天行程</h3><span>按游览顺序 · 点击地点定位</span></div><details class="route-guide"><summary>游览时长与入场时间说明</summary><p>游览时长包含景点内部慢走；交通、排队与用餐另留。可进入时段、最晚入场和结束时间分别列出，未公布的保留待确认。</p>${external('hours-guide.md','开放时间核对表 · 2026.09.11')}</details><ol class="timeline">${d.stops.map((stop,index)=>{
 const next=d.stops[index+1],mode=next?MODES[next.mode]:null,duration=durationFor(d,stop,index);
 const scenic=Boolean(VISIT_TIMES[stop.id])&&!HOTELS[stop.id];
 return `<li class="stop${scenic?' scenic-stop':' transit-stop'}" data-stop="${index}" id="${escapeHtml(stop.commentId)}"><article class="stop-card"><div class="stop-card-top"><button type="button" class="stop-pin" data-locate="${index}" aria-label="在地图上查看第${index+1}站 ${escapeHtml(PLACES[stop.id][0])}">${index+1}</button><div><p class="stop-time">${escapeHtml(stop.time)}</p><h4><button type="button" class="stop-title" data-locate="${index}">${escapeHtml(PLACES[stop.id][0])}</button></h4></div><span class="stop-category">${HOTELS[stop.id]?'住宿':scenic?'游览':'途经'}</span></div><div class="stop-content with-photo"><div class="stop-description"><p class="stop-note">${escapeHtml(stop.note)}</p>${duration?`<p class="visit-duration">${escapeHtml(duration)}</p>`:''}${renderTicket(stop.id)}</div>${JourneyPhotos.render(stop.id,PLACES[stop.id][0])}</div>${renderAccessHours(stop.id)}<div class="stop-links">${external(placeLink(stop.id),'Google 地图')}${external(xiaohongshuLink(stop.id),'小红书搜索')}${HOTELS[stop.id]?external(HOTELS[stop.id].url,'酒店官网'):''}</div>${stop.commentId?`<div class="step-comments" data-comment-target="${escapeHtml(stop.commentId)}"></div>`:''}</article>${next?`<div class="connection"><span class="mode-tag" style="--c:${mode.color}">${mode.name}</span><span>${escapeHtml(next.connection||'按实际情况衔接')}</span>${external(next.mode==='shuttle'?hotelShuttleUrl():routeLink(stop.id,next.id,next.mode),next.mode==='shuttle'?'接驳':'导航')}</div>`:'<p class="day-end">当天行程结束 · 好好休息</p>'}</li>`;
 }).join('')}</ol>`;
 document.querySelectorAll('[data-locate]').forEach(b=>b.addEventListener('click',()=>{setReadingView('map');selectStop(Number(b.dataset.locate));if(innerWidth<=1100)$('content').scrollIntoView({behavior:'smooth',block:'start'});}));
}

function renderSupport(d){const hotel=d.hotel?HOTELS[d.hotel]:null;const optional=d.id===2?'鸭川黄昏：20–30分钟，仅在餐厅位置顺路且体力允许时加入。':d.id===3?'贵船奥宫方向：往返支线另加30–45分钟，可完全省略。':d.id===5?'东大寺大佛殿：参观45–60分钟，支线往返另留；成人门票800 JPY／人，未计入当天主线总额。':'';$('support').innerHTML=`<div class="support-card rest-card"><h3>给体力留一点余量</h3><p>${escapeHtml(d.rest)}</p></div>${optional?`<div class="support-card"><h3>备选景点 · 额外时长</h3><div class="stop-content with-photo"><div><p>${escapeHtml(optional)}</p></div>${JourneyPhotos.render(d.id===2?'kamo':d.id===3?'okumiya':'todaiji',d.id===2?'鸭川':d.id===3?'贵船奥宫':'东大寺')}</div>${renderAccessHours(d.id===2?'kamo':d.id===3?'okumiya':'todaiji')}</div>`:''}${hotel?`<div class="support-card"><span class="booking-status">住宿候选 · 尚未预订</span><h3>${escapeHtml(hotel.name)}</h3><p class="hotel-area">${escapeHtml(hotel.area)}</p><div class="stop-content with-photo"><div><p>${escapeHtml(hotel.note)}</p></div>${JourneyPhotos.render(d.hotel,hotel.name)}</div><div class="link-row">${external(hotel.url,'酒店官网')}${hotel.booking?external(hotel.booking,'方案与入住说明'):''}</div></div>`:''}<details class="support-card" open><summary>尚待确认的安排</summary><ul>${d.notes.map(n=>`<li>${escapeHtml(n)}</li>`).join('')}</ul></details>${d.links.length?`<div class="support-card"><h3>官网与预约入口</h3><div class="link-row">${d.links.map(l=>external(l[1],l[0])).join('')}</div></div>`:''}`;
 $('handoff').innerHTML=`<div class="handoff-card"><h3>行李与前后两天的衔接</h3><p><span class="handoff-label">今天怎么接上</span>${escapeHtml(d.luggage)}</p><p class="next"><span class="handoff-label">下一段</span>${escapeHtml(d.next)}</p></div>`;
}
function overview(){const last=plan==='A'?'arima':'kaigetsu';return {id:0,title:'先看方向，再看每一天',subtitle:plan==='A'?'大阪 → 京都 → 宇治 → 奈良 → 神户 → 有马 → 关西机场':'大阪 → 京都 → 宇治 → 奈良 → 加太海月 → 关西机场',focus:['kix','osaka','kyoto','uji','nara',last],stops:[stop('kix','10/1','抵达关西机场'),stop('osaka','10/1 · 1晚','放行李后轻松逛街','rail','南海机场线'),stop('kyoto','10/2–3 · 2晚','岚山、祇园、哲学小道、贵船','rail','大阪到京都酒店75–100分钟预算'),stop('uji','10/4 · 1晚','宇治茶文化，往返城阳花火','rail','伏见稻荷结束后取件，到宇治放妥行李75–100分钟'),stop('nara','10/5 · 1晚','林荫慢走、若草山与奈良晚餐','rail','宇治酒店至奈良酒店50–75分钟'),...(plan==='A'?[stop('storage','10/6 · 寄存','白鹤、须磨、Venus后回三宫取件','rail','奈良至三宫寄存点90–110分钟'),stop('arima','10/6 · 1晚','神户晚饭后入住泡汤','rail','取件与晚餐后，经谷上、有马口，最后酒店接驳')]:[stop('kaigetsu','10/6 · 1晚','全日休闲，酒店海景与泡汤','rail','奈良到酒店3–3.5小时，含酒店接驳；午饭另留')]),stop('kix','10/7 · 航班待定','到机场交通预算之外另留值机安检时间','rail',plan==='A'?'酒店至机场2.5–3.5小时；铁路到三宫再换机场巴士':'酒店至机场2–2.5小时；接驳与南海铁路')]};}
const yenRange=(range,multiplier=1)=>range.map(n=>Math.round(n*multiplier).toLocaleString('zh-CN')).join('–');
function renderDailySummary(d){
 const b=budgetFor(d,plan),total=sumBudget(b),daytime=sumBudget(b,false);
 return `<section class="daily-summary" aria-label="当天费用与体力总结"><div class="daily-kpis"><div><span>统计费用／成人</span><strong>${yenRange(total)} <small>JPY</small></strong></div><div><span>全天步行参考</span><strong>${escapeHtml(d.distance)} <small>km</small></strong></div><div><span>活动额外消耗</span><strong>${escapeHtml(d.calories)} <small>kcal</small></strong></div></div><p class="budget-scope">含当晚住宿分摊，不含未预订餐饮。热量按70kg成人估算。</p><details class="budget-details"><summary>查看费用构成与估算说明 <span>5人合计 ${yenRange(total,PARTY_SIZE)} JPY</span></summary><p class="summary-narrative">${escapeHtml(b.summary)}</p>${b.items.map(item=>`<div class="budget-row"><strong>${escapeHtml(item.name)}</strong><span class="budget-amount">${yenRange([item.min,item.max])} JPY／人</span><p>${escapeHtml(item.note)} ${item.source?external(item.source,'来源'):''}</p></div>`).join('')}<p class="budget-scope">不含住宿：${yenRange(daytime)} JPY／人。住宿为规划预留，非指定日期房价；机票、购物和自选升级另计。已含套餐餐食不重复加价；未知费用不表示免费。</p><ul>${(b.notes||[]).map(n=>`<li>${escapeHtml(n)}</li>`).join('')}<li>步行和热量包含景区内部与上下坡，不含基础代谢；不是精确测量。</li></ul>${b.sources?`<div class="link-row">${b.sources.map(x=>external(x[1],x[0])).join('')}</div>`:''}</details></section>`;
}

function render(){readHash();
 const favoritesView=new URLSearchParams(location.hash.slice(1)).get('view')==='favorites';
 $('content').hidden=favoritesView;$('favorites-panel').hidden=!favoritesView;
 if(favoritesView){
  document.querySelectorAll('[data-day]').forEach(b=>b.removeAttribute('aria-current'));
  $('favorites-nav').setAttribute('aria-current','page');document.title='探店收藏夹｜关西七日';
  window.dispatchEvent(new Event('favorites:show'));return;
 }
 $('favorites-nav').removeAttribute('aria-current');setReadingView('itinerary');$('map-selection').textContent='选择一个行程地点，查看它在地图上的位置。';document.querySelectorAll('[data-day]').forEach(b=>{if(Number(b.dataset.day)===day)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('plan-a').setAttribute('aria-pressed',String(plan==='A'));$('plan-b').setAttribute('aria-pressed',String(plan==='B'));$('plan-switch').hidden=!(day===0||day>=6);$('focus').hidden=day===0;$('fit').textContent=day===0?'全程范围':'当天全程';focusMode=true;
 if(day===0){current=overview();renderHeading(current);$('map-title').textContent='城市之间的移动';$('timeline').innerHTML=`<div class="section-label"><h3>七天，逐日展开</h3><span>点击查看每日地图</span></div>${DAYS.map((_,i)=>{const d=getDay(i+1);return `<a class="overview-card" href="#day=${d.id}&plan=${plan}"><div class="over-top"><small>DAY ${String(d.id).padStart(2,'0')} · ${d.date}</small><strong>${escapeHtml(d.city)} ↗</strong></div><p>${escapeHtml(d.title)}</p><small>${d.distance} km · ${d.calories} kcal · ${d.hotel?'宿 '+escapeHtml(HOTELS[d.hotel].name):'机场返程'}</small></a>`;}).join('')}`;$('support').innerHTML='<div class="support-card"><h3>选择最后一晚的节奏</h3><p>Plan A保留神户酒藏、海边与蓝调，再去有马。Plan B整天替换为加太海月休闲日。酒店未预订，切换地图不代表完成订房。</p></div>';$('handoff').innerHTML='<div class="handoff-card"><h3>跨城从哪里开始？</h3><p>从酒店或实际行李寄存点出发，抵达下一城先放好箱子。图上连线概括移动方向，具体铁路、巴士和接驳见每天时间线。</p><p class="next">为蓝调、日落和休息保留必要折返；不把城市间最快车程当成完整转场时间。</p></div>';}
 else{current=getDay(day);renderHeading(current);$('map-title').textContent=`Day ${day} · ${current.city}`;renderTimeline(current);renderSupport(current);}
 renderSchedule(current,plan);
 $('day-summary').innerHTML=day===0?'':renderDailySummary(current);
 if(day===0)document.querySelectorAll('.overview-card').forEach((el,i)=>{const b=budgetFor(getDay(i+1),plan);const p=document.createElement('p');p.className='overview-budget';p.textContent=`预计 JPY ${yenRange(sumBudget(b))}／人 · 含当晚住宿`;el.appendChild(p);});
 const dateNav=document.querySelector('.day-nav'),activeDate=dateNav.querySelector('[aria-current=page]');
 if(activeDate&&dateNav.scrollWidth>dateNav.clientWidth)dateNav.scrollLeft=activeDate.offsetLeft-(dateNav.clientWidth-activeDate.offsetWidth)/2;
 window.dispatchEvent(new Event('itinerary:render'));
 drawMap();document.title=`${day?'Day '+day+' · '+current.city:'城市衔接'}｜关西七日`;
}
$('legend').innerHTML=Object.values(MODES).map(m=>`<span class="legend-item"><span class="legend-line" style="--c:${m.color}"></span>${m.name}</span>`).join('');
document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>change(Number(b.dataset.day))));
$('favorites-nav').addEventListener('click',()=>{location.hash=`view=favorites&day=${day}&plan=${plan}`;});
$('plan-a').addEventListener('click',()=>change(day,'A'));$('plan-b').addEventListener('click',()=>change(day,'B'));$('focus').addEventListener('click',()=>fitMap(true));$('fit').addEventListener('click',()=>fitMap(false));
$('share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('已复制当前日期与方案的链接');}catch{toast('无法自动复制，请复制浏览器地址栏中的链接');}});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setReadingView(b.dataset.view)));
window.addEventListener('resize',()=>map?.invalidateSize({animate:false}));
window.addEventListener('itinerary:reveal',()=>setReadingView('itinerary'));
const headerObserver=new ResizeObserver(entries=>{
 document.documentElement.style.setProperty('--header',`${Math.ceil(entries[0].target.getBoundingClientRect().height)}px`);
 map?.invalidateSize({animate:false});
});
headerObserver.observe(document.querySelector('.topbar'));
window.addEventListener('hashchange',render);initMap();render();
