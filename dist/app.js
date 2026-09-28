function renderDepartureDeadline(deadline){
 if(!deadline)return '';
 return `<aside class="departure-deadline" aria-label="离开时间提醒"><strong>${escapeHtml(deadline.title)}</strong><p class="departure-deadline-times">${escapeHtml(deadline.transit)}<br>${escapeHtml(deadline.taxi)}</p><p>${escapeHtml(deadline.calculation)}</p><p>${escapeHtml(deadline.pickup)}</p><p>${escapeHtml(deadline.caveat)}</p><div class="stop-links">${external(deadline.source,'酒店晚餐时段')}${external(deadline.uberSource,'Uber 奈良')}</div></aside>`;
}
'use strict';
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(url,label)=>`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)} ↗</a>`;
const placeLink=id=>(typeof JOURNEY_MODEL!=='undefined'&&JOURNEY_MODEL.places[id]?.mapUrl)||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(PLACES[id][3]);
// Match the supplied Xiaohongshu URL: preserve the place name and percent-encode it twice.
const xiaohongshuLink=id=>'https://www.xiaohongshu.com/search_result_ai?keyword='+encodeURIComponent(encodeURIComponent(HOTELS[id]?.name||PLACES[id][0]));
function routeLink(from,to,mode){
 if(mode==='boat')return 'https://www.hozugawakudari.jp/access';
 const params=new URLSearchParams({api:'1',origin:PLACES[from][3],destination:PLACES[to][3],travelmode:mode==='walk'?'walking':mode==='taxi'?'driving':'transit'});
 // Bind verified endpoints to their own Google places; keep addresses as readable fallbacks.
 for(const [key,id] of [['origin',from],['destination',to]]){
  const placeId=typeof JOURNEY_MODEL!=='undefined'&&JOURNEY_MODEL.places[id]?.googlePlaceId;
  if(placeId)params.set(key+'_place_id',placeId);
 }
 return 'https://www.google.com/maps/dir/?'+params;
}
let day=1,plan='A',map=null,current=null,focusMode=true;
function readHash(){const p=new URLSearchParams(location.hash.slice(1));day=Math.min(7,Math.max(0,Math.floor(Number(p.get('day')??1)||0)));plan=p.get('plan')==='B'&&JOURNEY_MODEL.variants.B[5]?.length?'B':'A';}
function change(d=day,p=plan){const params=new URLSearchParams(location.hash.slice(1));params.delete('view');params.set('day',d);params.set('plan',p);location.hash=params.toString();}
function activeJourneyPlan(){return plan==='B'&&new URLSearchParams(location.hash.slice(1)).get('stay')==='kyukamura'?'B2':plan;}
function getDay(n){const variants=JOURNEY_MODEL.variants[activeJourneyPlan()][n];const choice=new URLSearchParams(location.hash.slice(1)).get('route'+n);return variants.find(v=>v.key===choice)||variants[0];}
function renderRouteChoices(d){
 const host=document.createElement('section');host.className='support-card route-choices';
 const variants=JOURNEY_MODEL.variants[activeJourneyPlan()][d.id];
 host.innerHTML=`<h3>路线预览</h3><p>仅切换查看方案，不修改正式行程；全队选择同一路线。</p>${variants.length>1?`<label>当天走法 <select id="route-variant">${variants.map(v=>`<option value="${escapeHtml(v.key)}" ${v.key===d.key?'selected':''}>${escapeHtml(v.label)}</option>`).join('')}</select></label>`:''}${plan==='B'&&d.id>=5?`<label>第六晚住宿 <select id="stay-variant"><option value="kaigetsu">加太海月</option><option value="kyukamura" ${activeJourneyPlan()==='B2'?'selected':''}>休暇村纪州加太</option></select></label>`:''}`;
 $('day-heading').append(host);
 host.querySelector('#route-variant')?.addEventListener('change',e=>{const p=new URLSearchParams(location.hash.slice(1));p.set('route'+d.id,e.target.value);location.hash=p.toString();});
 host.querySelector('#stay-variant')?.addEventListener('change',e=>{const p=new URLSearchParams(location.hash.slice(1));p.set('stay',e.target.value);p.delete('route6');p.delete('route7');location.hash=p.toString();});
}
const hasPoint=id=>PLACES[id]&&Number.isFinite(PLACES[id][1])&&Number.isFinite(PLACES[id][2]);
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3500);}
async function initMap(){
 const view=new TripGoogleMap($('map'),$('map-error'));
 try{await view.init(PLACES);map=view;drawMap();}
 catch(error){view.fail(error.name==='AbortError'?'Google 地图连接超时，请稍后重试。':error.message);}
}
function fitMap(focused){
 focusMode=focused;$('focus').setAttribute('aria-pressed',String(focused));$('fit').setAttribute('aria-pressed',String(!focused));
 if(!map||!current)return;
 const ids=focused?current.focus:current.stops.map(s=>s.id);
 const coords=ids.filter(hasPoint).map(id=>PLACES[id].slice(1,3));
 if(!focused)map.lines.forEach(entry=>coords.push(...entry.path));
 map.fit(coords);
}
function selectStop(index,scroll=false){
 const stop=current?.stops[index];if(!stop)return;
 if(hasPoint(stop.id))map?.focusPlace(stop.id);else toast('地点尚未确定精确坐标，请使用卡片的 Google 地图链接。');
 map?.highlight(index);
 document.querySelectorAll('.stop').forEach((el,i)=>el.classList.toggle('active',i===index));
 $('map-selection').innerHTML=`<span class="selected-number">${index+1}</span><div><strong>${escapeHtml(PLACES[stop.id][0])}</strong><p>${escapeHtml(stop.time)}</p></div>${current.id?'<button type="button" id="back-to-stop">查看行程</button>':''}`;
 $('back-to-stop')?.addEventListener('click',()=>{setReadingView('itinerary');const card=document.querySelector(`[data-stop="${index}"]`);card?.scrollIntoView({behavior:'smooth',block:'center'});card?.querySelector('.stop-title')?.focus({preventScroll:true});});
 if(scroll){setReadingView('itinerary');document.querySelector(`[data-stop="${index}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});}
}
function setReadingView(view){
 const reading=view!=='map';document.body.dataset.view=reading?'itinerary':'map';
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===(reading?'itinerary':'map'))));
 requestAnimationFrame(()=>{map?.resize();});
}
function drawMap(){
 if(!map||!current)return;map.clear();
 const grouped=new Map();current.stops.forEach((s,i)=>{if(!grouped.has(s.id))grouped.set(s.id,[]);grouped.get(s.id).push(i);});
 let savedCount=0,missingCount=0;
 current.stops.forEach((s,i)=>{
  if(!i)return;const previous=current.stops[i-1];if(previous.id===s.id)return;
  if(!hasPoint(previous.id)||!hasPoint(s.id)){missingCount++;return;}
  const found=TripRouteData.find(map.data,current.id,plan,previous,s);
  const saved=found.segment;
  if(saved)savedCount++;else missingCount++;
  const parts=saved?saved.parts:[{mode:s.mode||'walk',label:s.connection||'按行程顺序前往下一站',path:[PLACES[previous.id].slice(1,3),PLACES[s.id].slice(1,3)]}];
  for(const part of parts){
   const mode=MODES[part.mode];
   const status=saved?'预先整理的路线；当天走法和班次以现场为准。':'虚线仅表示游览顺序，不代表实际道路或交通线路。';
   map.addLine({path:part.path,mode:part.mode,color:mode.color,schematic:!saved,leg:i,
    html:`<strong>${escapeHtml(mode.name)} · ${i} → ${i+1}</strong><p>${escapeHtml(PLACES[previous.id][0])} → ${escapeHtml(PLACES[s.id][0])}</p><p>${escapeHtml(part.label)}</p>${external(s.mode==='shuttle'?hotelShuttleUrl():routeLink(previous.id,s.id,s.mode),s.mode==='shuttle'?'查看接驳说明':'打开本段导航')}<p>${status}</p>`});
  }
 });
 grouped.forEach((indices,id)=>{
  if(!hasPoint(id))return;
  const p=PLACES[id],first=indices[0],numbers=indices.map(i=>i+1).join(' / '),short=indices.map(i=>i+1).join('/');
  const html=`<strong>${numbers} · ${escapeHtml(p[0])}</strong>${indices.map(i=>`<p><b>${escapeHtml(current.stops[i].time)}</b><br>${escapeHtml(current.stops[i].note)}${durationFor(current,current.stops[i],i)?`<br><strong class="popup-duration">${escapeHtml(durationFor(current,current.stops[i],i))}</strong>`:''}</p>`).join('')}${current.id?renderAccessHours(id,true):''}${external(placeLink(id),'查看地点')}`;
  map.addPlace({id,position:p.slice(1,3),number:short,title:`${numbers} · ${p[0]}`,hotel:!!HOTELS[id],html,
   onClick:()=>{selectStop(first);document.querySelectorAll('.stop').forEach((el,i)=>el.classList.toggle('active',indices.includes(i)));}});
 });
 document.querySelector('.map-caption').textContent=current.id===0?'全程游览顺序：沿箭头查看下一站。虚线为地点连线示意，具体交通请查看每天行程。':
  savedCount?`已载入 ${savedCount} 段预存路线${missingCount?`；另有 ${missingCount} 段以虚线示意游览顺序`:''}。不同颜色表示交通方式；点选路线看说明。`:
  '沿箭头按编号游览；颜色表示计划交通方式。虚线仅为顺序示意，点击连线查看两站之间的说明与导航。';
 const unlocated=[...grouped.keys()].filter(id=>!hasPoint(id));
 if(unlocated.length)document.querySelector('.map-caption').textContent+=' '+unlocated.map(id=>PLACES[id][0]).join('、')+'的精确点位待确认，暂未绘制。';
 fitMap(focusMode);
}
function hotelShuttleUrl(){return activeJourneyPlan()==='B2'?'https://www.qkamura.or.jp/kada/access/':plan==='B'?'https://kada-kaigetsu.com/access/':'https://choraku.com/access/';}
function renderHeading(d){
 $('day-heading').innerHTML=`<div class="day-heading"><p class="day-kicker">${day===0?'THE WHOLE JOURNEY · 7 DAYS':`DAY ${String(day).padStart(2,'0')} / 07 · ${escapeHtml(d.date)} ${escapeHtml(d.weekday)}`}</p><h2>${escapeHtml(d.title)}</h2><p class="day-description">${escapeHtml(d.subtitle)}</p>${day===0?'':`<div class="day-chips"><span>${escapeHtml(d.intensity)}</span><span>${d.stops.length}个行程节点</span><span>日本时间</span></div>`}</div>`;
}

function renderDelivery(id){
 const d=JOURNEY_MODEL.places[id]?.delivery;if(!d)return '';
 const f=d.fallback;
 const backup=f?`<section class="access-hours delivery-fallback" aria-label="错过寄送截止的后备方案"><div class="hours-heading"><strong>错过10:00？改到新大阪东口寄送</strong></div><p><strong>${escapeHtml(f.name)}</strong><br>${escapeHtml(f.nameEn)}</p><dl>${[['办理截止',f.cutoff],['建议到店',f.arrival],['送达时间',f.deliveryTime],['配送范围',f.serviceArea],['费用参考',f.fee]].map(([label,value])=>`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl><p>${escapeHtml(f.route)}</p><p>${escapeHtml(f.note)}</p><div class="stop-links">${external(f.mapUrl,'新大阪东口营业所 · Google 地图')}${external(f.sourceUrl,'官方营业所表 · 第3页')}</div><small>${escapeHtml(f.checked)}</small></section>`:'';
 const rows=[['郵便番号 / 邮编',d.postalCode],['住所 / 日文地址',d.addressJa],['Address / 英文地址',d.addressEn],['お届け先氏名 / 收件人',d.recipient+' '+d.recipientEn],['電話番号 / 收件电话',d.phone]];
 return `<section class="access-hours delivery-info" aria-label="配送先信息"><div class="hours-heading"><strong>配送先 · 行李收件信息</strong></div><dl>${rows.map(([label,value])=>`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl><p>${escapeHtml(d.note)}</p><div class="stop-links">${external(d.mapUrl,'收件地址 · Google 地图')}</div></section>${backup}`;
}

function renderTimeline(d){
 $('timeline').innerHTML=`<div class="section-label"><h3>当天行程</h3><span>${d.flexible?'弹性清单 · 不要求全部完成':'按游览顺序 · 点击地点定位'}</span></div><details class="route-guide"><summary>游览时长与入场时间说明</summary><p>游览时长包含景点内部慢走；交通、排队与用餐另留。可进入时段、最晚入场和结束时间分别列出，未公布的保留待确认。</p>${external('hours-guide.md','开放时间核对表 · 2026.09.11')}</details><ol class="timeline">${d.stops.map((stop,index)=>{
 const next=d.stops[index+1],mode=next?MODES[next.mode]:null,duration=durationFor(d,stop,index);
 const scenic=Boolean(VISIT_TIMES[stop.id])&&!HOTELS[stop.id];
 return `<li class="stop${scenic?' scenic-stop':' transit-stop'}" data-stop="${index}" id="${escapeHtml(stop.commentId)}"><article class="stop-card"><div class="stop-card-top"><button type="button" class="stop-pin" data-locate="${index}" aria-label="在地图上查看第${index+1}站 ${escapeHtml(PLACES[stop.id][0])}">${index+1}</button><div><p class="stop-time">${escapeHtml(stop.time)}</p><h4><button type="button" class="stop-title" data-locate="${index}">${escapeHtml(PLACES[stop.id][0])}</button></h4></div><span class="stop-category">${HOTELS[stop.id]?'住宿':scenic?'游览':'途经'}</span></div><div class="stop-content with-photo"><div class="stop-description"><p class="stop-note">${escapeHtml(stop.note)}</p>${duration?`<p class="visit-duration">${escapeHtml(duration)}</p>`:''}${renderTicket(stop.id)}</div>${JourneyPhotos.render(stop.id,PLACES[stop.id][0])}</div>${renderDepartureDeadline(stop.deadline)}${renderDelivery(stop.id)}${renderAccessHours(stop.id)}<div class="stop-links">${external(placeLink(stop.id),'Google 地图')}${external(xiaohongshuLink(stop.id),'小红书搜索')}${HOTELS[stop.id]?.url?external(HOTELS[stop.id].url,'酒店官网'):''}</div>${stop.commentId?`<div class="step-comments" data-comment-target="${escapeHtml(stop.commentId)}"></div>`:''}</article>${next?`<div class="connection"><span class="mode-tag" style="--c:${mode.color}">${mode.name}</span><span>${escapeHtml(next.connection||'按实际情况衔接')}</span>${external(next.mode==='shuttle'?hotelShuttleUrl():routeLink(stop.id,next.id,next.mode),next.mode==='shuttle'?'接驳':'导航')}</div>`:'<p class="day-end">当天行程结束 · 好好休息</p>'}</li>`;
 }).join('')}</ol>`;
 document.querySelectorAll('[data-locate]').forEach(b=>b.addEventListener('click',()=>{setReadingView('map');selectStop(Number(b.dataset.locate));if(innerWidth<=1100)$('content').scrollIntoView({behavior:'smooth',block:'start'});}));
}

function renderSupport(d){const hotel=d.hotel?HOTELS[d.hotel]:null;const optional='';$('support').innerHTML=`<div class="support-card rest-card"><h3>给体力留一点余量</h3><p>${escapeHtml(d.rest)}</p></div>${optional?`<div class="support-card"><h3>备选景点 · 额外时长</h3><div class="stop-content with-photo"><div><p>${escapeHtml(optional)}</p></div>${JourneyPhotos.render(d.id===2?'kamo':d.id===3?'okumiya':'todaiji',d.id===2?'鸭川':d.id===3?'贵船奥宫':'东大寺')}</div>${renderAccessHours(d.id===2?'kamo':d.id===3?'okumiya':'todaiji')}</div>`:''}${hotel?`<div class="support-card"><span class="booking-status">${escapeHtml(hotel.status||'住宿候选 · 尚未预订')}</span><h3>${escapeHtml(hotel.name)}</h3><p class="hotel-area">${escapeHtml(hotel.area)}</p><div class="stop-content with-photo"><div><p>${escapeHtml(hotel.note)}</p></div>${JourneyPhotos.render(d.hotel,hotel.name)}</div><div class="link-row">${hotel.url?external(hotel.url,'酒店官网'):''}${hotel.booking?external(hotel.booking,'方案与入住说明'):''}</div></div>`:''}<details class="support-card" open><summary>尚待确认的安排</summary><ul>${d.notes.map(n=>`<li>${escapeHtml(n)}</li>`).join('')}</ul></details>${d.links.length?`<div class="support-card"><h3>官网与预约入口</h3><div class="link-row">${d.links.map(l=>external(l[1],l[0])).join('')}</div></div>`:''}`;
 $('handoff').innerHTML=`<div class="handoff-card"><h3>行李与前后两天的衔接</h3><p><span class="handoff-label">今天怎么接上</span>${escapeHtml(d.luggage)}</p><p class="next"><span class="handoff-label">下一段</span>${escapeHtml(d.next)}</p></div>`;
}
function overview(){
 const selected=Array.from({length:7},(_,i)=>getDay(i+1));const stops=[stop('kix','10/1','抵达机场')];
 for(const d of selected){if(d.id===5)stops.push(stop('nara-kintetsu-storage','10/5',plan==='A'?'奈良游览后取件，前往已订的兆乐':'奈良游览，当晚住奈良','rail',d.luggage));if(d.hotel&&stops.at(-1).id!==d.hotel)stops.push(stop(d.hotel,d.date+' · 住宿',d.title,'rail',d.luggage));}
 stops.push(stop('kix','10/7','按航班倒排返程','bus',selected[6].luggage));
 return {id:0,title:'先看方向，再看每一天',subtitle:plan==='A'?'大阪 → 京都 → 宇治 → 奈良 → 有马 → 神户 → 关西机场':'大阪 → 京都 → 宇治 → 奈良 → 加太 → 关西机场',focus:stops.map(s=>s.id),stops};
}
const yenRange=(range,multiplier=1)=>range.map(n=>Math.round(n*multiplier).toLocaleString('zh-CN')).join('–');
function renderDailySummary(d){
 const b=budgetFor(d,plan),total=sumBudget(b),daytime=sumBudget(b,false);
 return `<section class="daily-summary" aria-label="当天费用与体力总结"><div class="daily-kpis"><div><span>统计费用／成人</span><strong>${b.pending?'待复核':yenRange(total)} <small>JPY</small></strong></div><div><span>全天步行参考</span><strong>${escapeHtml(d.distance)} <small>km</small></strong></div><div><span>活动额外消耗</span><strong>${escapeHtml(d.calories)} <small>kcal</small></strong></div></div><p class="budget-scope">含当晚住宿分摊，不含未预订餐饮。热量按70kg成人估算。</p><details class="budget-details"><summary>查看费用构成与估算说明 <span>${b.pending?'总费用待报价':'5人合计 '+yenRange(total,PARTY_SIZE)+' JPY'}</span></summary><p class="summary-narrative">${escapeHtml(b.summary)}</p>${b.items.map(item=>`<div class="budget-row"><strong>${escapeHtml(item.name)}</strong><span class="budget-amount">${yenRange([item.min,item.max])} JPY／人</span><p>${escapeHtml(item.note)} ${item.source?external(item.source,'来源'):''}</p></div>`).join('')}<p class="budget-scope">${b.pending?'以下仅为已知项目，不代表完整日费用。':'不含住宿：'+yenRange(daytime)+' JPY／人。'}住宿为规划预留，非指定日期房价；机票、购物和自选升级另计。已含套餐餐食不重复加价；未知费用不表示免费。</p><ul>${(b.notes||[]).map(n=>`<li>${escapeHtml(n)}</li>`).join('')}<li>步行和热量包含景区内部与上下坡，不含基础代谢；不是精确测量。</li></ul>${b.sources?`<div class="link-row">${b.sources.map(x=>external(x[1],x[0])).join('')}</div>`:''}</details></section>`;
}

function render(){readHash();
 const favoritesView=new URLSearchParams(location.hash.slice(1)).get('view')==='favorites';
 $('content').hidden=favoritesView;$('favorites-panel').hidden=!favoritesView;
 if(favoritesView){
  tripWeather.hide();
  document.querySelectorAll('[data-day]').forEach(b=>b.removeAttribute('aria-current'));
  $('favorites-nav').setAttribute('aria-current','page');document.title='探店收藏夹｜关西七日';
  window.dispatchEvent(new Event('favorites:show'));return;
 }
 $('favorites-nav').removeAttribute('aria-current');setReadingView('itinerary');$('map-selection').textContent='选择一个行程地点，查看它在地图上的位置。';document.querySelectorAll('[data-day]').forEach(b=>{if(Number(b.dataset.day)===day)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('plan-a').setAttribute('aria-pressed',String(plan==='A'));$('plan-b').setAttribute('aria-pressed',String(plan==='B'));$('plan-switch').hidden=!JOURNEY_MODEL.variants.B[5]?.length||!(day===0||day>=5);$('focus').hidden=day===0;$('fit').textContent=day===0?'全程范围':'当天全程';focusMode=true;
 if(day===0){current=overview();renderHeading(current);$('map-title').textContent='城市之间的移动';$('timeline').innerHTML=`<div class="section-label"><h3>七天，逐日展开</h3><span>点击查看每日地图</span></div>${DAYS.map((_,i)=>{const d=getDay(i+1);return `<a class="overview-card" href="#day=${d.id}&plan=${plan}&stay=${activeJourneyPlan()==='B2'?'kyukamura':'kaigetsu'}"><div class="over-top"><small>DAY ${String(d.id).padStart(2,'0')} · ${d.date}</small><strong>${escapeHtml(d.city)} ↗</strong></div><p>${escapeHtml(d.title)}</p><small>${d.distance} km · ${d.calories} kcal · ${d.hotel?'宿 '+escapeHtml(HOTELS[d.hotel].name):'机场返程'}</small></a>`;}).join('')}`;$('support').innerHTML='<div class="support-card"><h3>第五天起的两条路线</h3><p>Plan A第五晚花結び、第六晚神户；Plan B第五晚奈良、第六晚加太海月或休暇村纪州加太。第六、七天住宿选择联动。酒店未预订，切换地图不代表完成订房。</p></div>';$('handoff').innerHTML='<div class="handoff-card"><h3>跨城从哪里开始？</h3><p>从酒店或实际行李寄存点出发，抵达下一城先放好箱子。图上连线概括移动方向，具体铁路、巴士和接驳见每天时间线。</p><p class="next">为蓝调、日落和休息保留必要折返；不把城市间最快车程当成完整转场时间。</p></div>';}
 else{current=getDay(day);renderHeading(current);renderRouteChoices(current);$('map-title').textContent=`Day ${day} · ${current.city}`;renderTimeline(current);renderSupport(current);}
 renderWeather(current,plan);
 renderSchedule(current,plan);
 $('day-summary').innerHTML=day===0?'':renderDailySummary(current);
 if(day===0)document.querySelectorAll('.overview-card').forEach((el,i)=>{const b=budgetFor(getDay(i+1),plan);const p=document.createElement('p');p.className='overview-budget';p.textContent=b.pending?'费用待复核 · 已知门票见每日构成':`预计 JPY ${yenRange(sumBudget(b))}／人 · 含当晚住宿`;el.appendChild(p);});
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
window.addEventListener('resize',()=>map?.resize());
window.addEventListener('itinerary:reveal',()=>setReadingView('itinerary'));
const headerObserver=new ResizeObserver(entries=>{
 document.documentElement.style.setProperty('--header',`${Math.ceil(entries[0].target.getBoundingClientRect().height)}px`);
 map?.resize();
});
headerObserver.observe(document.querySelector('.topbar'));
window.addEventListener('hashchange',render);initMap();render();
