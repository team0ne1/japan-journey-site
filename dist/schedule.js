// Proposed allocations, not booked appointments or verified transport departures.
// Each segment begins exactly where the previous one ends. Minutes drive all widths.
const ACTIVITY_TYPES={
 travel:{name:'通行／候车',color:'#346bc5'},visit:{name:'游览／体验',color:'#187a69'},
 meal:{name:'吃饭／茶点',color:'#b36218'},hotel:{name:'酒店／泡汤',color:'#7956a3'},
 free:{name:'自由／休息',color:'#657989'}
};
const minutesOf=s=>{const [h,m]=s.split(':').map(Number);return h*60+m;};
const slot=(end,type,label,place='',note='')=>({end:minutesOf(end),type,label,place,note});
const SCHEDULES={
 1:{start:600,note:'假设10:00落地，航班未定；入境、车程和入住均为预留。上午可先寄存，能否拿到房间以酒店为准。',slots:[
 slot('11:30','travel','入境、取件','kix','假设10:00抵达；办理入境及领取行李预留90分钟。'),
 slot('13:00','travel','机场→难波酒店','osaka','机场铁路、候车及带箱步行一起预留。'),
 slot('13:20','hotel','寄存行李','osaka'),slot('14:20','meal','难波午饭'),
 slot('15:00','free','咖啡／自由休息'),slot('16:00','hotel','入住、回房休息','osaka','15:00仅作入住安排占位，尚未订房。'),
 slot('16:10','travel','步行去商店街','shinsaibashi'),slot('17:40','visit','心斋桥逛店','shinsaibashi'),
 slot('18:00','travel','步行去法善寺','hozenji'),slot('18:20','visit','法善寺横丁','hozenji'),
 slot('19:35','meal','难波晚饭'),slot('19:45','travel','步行到戎桥','dotonbori'),
 slot('20:25','visit','道顿堀夜景','dotonbori'),slot('20:40','travel','步行回酒店','osaka'),
 slot('24:00','hotel','回房、自由休息','osaka')
 ]},
 2:{start:390,note:'全程较紧的一天。小火车与94路班次尚未核定，以下不是车票时刻；晚间祇园可缩短。鸭川备选未计入主线。',slots:[
 slot('07:00','meal','早餐'),slot('07:15','hotel','收拾、退房','osaka'),
 slot('08:45','travel','大阪→京都酒店','kyoto'),slot('09:00','hotel','京都寄存','kyoto'),
 slot('09:45','travel','JR京都→马堀','umahori'),slot('10:00','travel','步行到龟冈站','kameoka'),
 slot('10:20','travel','进站、候车','kameoka','20分钟候车预留；实际车次未定，整段需随订票平移。'),
 slot('10:45','travel','观光小火车','saga','观光列车约25分钟，发车时间是排程占位。'),
 slot('11:30','travel','步行＋巴士上山','otagi','含到野宫站、候车和94路乘车，按实际班次重排。'),
 slot('12:30','visit','爱宕念佛寺','otagi'),slot('12:50','travel','下行至鸟居本','toriimoto'),
 slot('13:50','meal','老街午饭','toriimoto'),slot('14:15','visit','鸟居本短逛','toriimoto'),
 slot('14:40','travel','步行至落柿舍','rakushisha'),slot('15:00','visit','落柿舍周边','rakushisha'),
 slot('15:15','travel','步行到竹林','bamboo'),slot('15:40','visit','竹林小径','bamboo'),
 slot('15:55','travel','步行到渡月桥','togetsu'),slot('16:25','visit','渡月桥河畔','togetsu'),
 slot('17:30','travel','步行＋JR回京都','kyoto'),slot('18:30','hotel','入住、休息','kyoto','保留至少60分钟回房休息。'),
 slot('19:00','travel','市内交通去八坂','yasaka'),slot('19:25','visit','八坂神社','yasaka'),
 slot('19:35','travel','前往餐厅'),slot('20:35','meal','祇园附近晚饭'),
 slot('20:55','visit','花见小路','hanami'),slot('21:05','travel','步行到白川','shirakawa'),
 slot('21:25','visit','祇园白川','shirakawa'),slot('21:35','travel','步行到祇园四条','gionshijo'),
 slot('22:20','travel','市内交通回酒店','kyoto'),slot('24:00','hotel','酒店休息','kyoto')
 ]},
 3:{start:480,note:'贵船16:00–18:00是目标停留段；返程33路末班未核，实际需要按末班提前收束。奥宫支线未计入主线。',slots:[
 slot('08:45','meal','早餐'),slot('09:15','hotel','晨间收拾','kyoto'),
 slot('10:15','travel','去哲学小道南端','nyakuoji'),slot('11:45','visit','哲学小道慢走','nyakuoji','从若王子桥至银阁寺桥附近，含沿途停留，不进入沿线寺院。'),
 slot('12:45','meal','小道北端午饭','ginkaku'),slot('13:45','free','咖啡、坐下休息','ginkaku'),
 slot('14:15','travel','市内交通到出町柳','demachi'),slot('14:30','travel','换乘、候车','demachi'),
 slot('15:15','travel','叡电到贵船口','kibuneguchi'),slot('16:00','travel','候车＋33路进山','kifune'),
 slot('17:30','visit','贵船本宫、溪边','kifune'),slot('18:00','free','休息、等灯笼','kifune','等日落的弹性时间；需服从返程巴士班次。'),
 slot('18:30','travel','33路下山','kibuneguchi','此处仅分配30分钟，未确认18:00仍有巴士。'),
 slot('19:15','travel','叡电回出町柳','demachi'),slot('19:45','travel','去市区餐厅'),
 slot('20:45','meal','京都晚饭'),slot('21:15','travel','返回酒店','kyoto'),slot('24:00','hotel','酒店休息','kyoto')
 ]},
 4:{start:450,note:'19:00花火是官方活动时刻；其他为暂定排程。对凤庵场次未预约，花火未购票，入场及散场等待均已预留。',slots:[
 slot('08:00','meal','早餐'),slot('08:15','hotel','退房、寄存','kyoto'),slot('08:40','travel','JR去稻荷','inari'),
 slot('09:50','visit','伏见稻荷短线','inari'),slot('10:10','travel','JR返回京都','kyoto'),
 slot('10:20','hotel','取回行李','kyoto'),slot('11:10','travel','带行李去宇治','uji'),
 slot('11:20','hotel','酒店寄存','uji'),slot('11:30','travel','步行去表参道','omotesando'),
 slot('12:30','meal','宇治特色午饭','omotesando'),slot('13:30','visit','表参道茶店','omotesando'),
 slot('13:40','travel','步行去对凤庵','taihoan'),slot('14:20','visit','对凤庵茶体验','taihoan','含提前10分钟换票、报到和20–30分钟薄茶体验；13:40为占位，未预约。'),
 slot('14:50','visit','宇治桥、河畔','ujibridge','包括从茶室向河畔移动的短走；全部按30分钟预留。'),
 slot('15:00','travel','步行回酒店','uji'),slot('16:30','hotel','入住、午后休息','uji','入住手续约15分钟，其余至少一小时回房休息。'),
 slot('17:30','meal','提前吃晚饭'),slot('18:15','travel','JR＋步行去花火','fireworks','含酒店出发、候车及长池站至入场口。'),
 slot('19:00','free','入場排队、候场','fireworks','活动等待缓冲，不能全部挪给别的景点。'),
 slot('19:40','visit','城阳花火','fireworks','官方19:00开始，约40分钟；仍以主办方当天安排为准。'),
 slot('20:25','travel','散场、走回长池','nagaike','45分钟仅是人流预留，拥挤可能延长。'),
 slot('21:10','travel','JR＋步行回宇治','uji'),slot('24:00','hotel','酒店休息','uji')
 ]},
 5:{start:480,note:'若草山安排16:40前下山，不把17:36日落画成可停留时段。东大寺大佛殿是备选，未计入主线；加入时需重排午后空闲与往返。',slots:[
 slot('08:45','meal','早餐'),slot('09:00','hotel','收拾、退房','uji'),slot('10:00','travel','宇治→奈良酒店','nara'),
 slot('10:15','hotel','寄存行李','nara'),slot('10:45','travel','公交入奈良公园','kasuga'),
 slot('12:00','visit','春日参道、看鹿','kasuga'),slot('12:15','travel','走到水谷茶屋附近','mizuya'),
 slot('12:30','visit','水谷周边短逛','mizuya'),slot('13:30','meal','午饭','mizuya','餐厅未选定，不代表已经安排在水谷茶屋用餐。'),
 slot('14:30','free','午后坐下休息','mizuya'),slot('14:50','travel','步行去若草山麓','wakakusa'),
 slot('15:20','free','山麓休息、自由时间','wakakusa'),slot('15:30','visit','入山准备','wakakusa'),
 slot('15:50','travel','步行上坡','hill'),slot('16:20','visit','一重目观景','hill'),
 slot('16:40','travel','原路下山','wakakusa'),slot('17:00','free','山麓短歇','wakakusa','已退出收费草坡；17:00前结束开放的限制已预留。'),
 slot('17:25','travel','向南大门步行','nandaimon'),slot('17:40','visit','南大门外观','nandaimon'),
 slot('18:10','travel','步行去晚餐区域','kintetsunara'),slot('19:20','meal','奈良晚饭','kintetsunara'),
 slot('19:40','travel','返回酒店','nara'),slot('24:00','hotel','入住、酒店休息','nara')
 ]},
 6:{start:420,note:'神户沿用既定目标时刻：17:00–18:00蓝调观景、19:00前取件、20:30左右到有马。交通与酒店仍未预订，晚段衔接较紧。',slots:[
 slot('07:45','meal','早餐'),slot('08:00','hotel','退房','nara'),slot('09:30','travel','奈良→三宫','storage'),
 slot('09:45','travel','寄存行李','storage'),slot('10:15','travel','去白鹤资料馆','hakutsuru'),
 slot('11:30','visit','白鹤酒造资料馆','hakutsuru'),slot('12:00','travel','返回三宫','sannomiya'),
 slot('13:00','meal','三宫午饭','sannomiya'),slot('13:20','travel','JR到须磨','suma'),
 slot('13:30','travel','步行到海边','beach'),slot('14:30','free','海边坐下休息','beach'),
 slot('15:00','visit','海边短走','beach'),slot('15:10','travel','回须磨站','suma'),
 slot('15:35','travel','JR回元町','motomachi'),slot('15:50','travel','步行到县厅前','kencho'),
 slot('16:00','free','洗手间、短歇','kencho'),slot('17:00','travel','缓慢上坡','venus'),
 slot('18:00','visit','Venus黄昏与蓝调','venus'),slot('18:40','travel','下坡回三宫','storage'),
 slot('18:45','travel','取回行李','storage','目标18:40到寄存点、18:45完成；晚于19:00无法取件。'),
 slot('19:30','meal','三宫晚饭','sannomiya'),slot('20:15','travel','铁路去有马','arimast','经谷上、有马口，实际换乘班次待核。'),
 slot('20:30','travel','酒店接驳','arima'),slot('20:45','hotel','办理入住','arima'),
 slot('22:00','hotel','洗漱、泡汤','arima','75分钟包括洗漱与放松，不要求持续浸泡。'),slot('24:00','hotel','回房休息','arima')
 ]}
};
const SCHEDULE_B6={start:480,note:'加太海月按一整天休闲规划；交通预留3.5小时、途中午饭另留1小时。15:00入住与18:00晚餐为候选安排，未订房。',slots:[
 slot('09:00','meal','早餐'),slot('09:30','hotel','收拾、退房','nara'),
 slot('12:00','travel','奈良→新今宫→和歌山','wakayamashi'),slot('13:00','meal','换乘途中午饭','wakayamashi'),
 slot('13:45','travel','南海加太线','kada'),slot('14:00','travel','酒店接驳','kaigetsu'),
 slot('14:15','hotel','寄存行李','kaigetsu'),slot('15:00','free','等入住、看海休息','kaigetsu','房间和住客浴场使用均按15:00后安排，不假设提前开放。'),
 slot('15:15','hotel','办理入住','kaigetsu'),slot('18:00','hotel','午睡、泡汤、海景','kaigetsu','附近15–30分钟散步可从此段自行选择，不增加徒步主线。'),
 slot('19:30','meal','酒店晚饭','kaigetsu'),slot('24:00','hotel','海景与回房休息','kaigetsu')
 ]};
function departureSchedule(p){
 const hotel=p==='B'?'kaigetsu':'arima';
 const rows=p==='B'?[
 [15,'travel','酒店送站','kada'],[55,'travel','加太线到和歌山','wakayamashi'],[70,'travel','换乘候车','wakayamashi'],
 [130,'travel','南海本线到泉佐野','izumisano'],[150,'travel','机场线与航站楼移动','kix'],[330,'travel','值机、安检与候机预留','kix']
 ]:[
 [15,'travel','酒店送站','arimast'],[90,'travel','铁路换乘到三宫','sannomiya'],[120,'travel','步行到巴士站、候车','sannomiya'],
 [180,'travel','机场巴士与航站楼移动','kix'],[360,'travel','值机、安检与候机预留','kix']
 ];
 return {start:-90,relative:true,note:`航班未定，以“离开酒店”为0点。酒店到机场预留${p==='B'?'2.5':'3'}小时，机场手续与候机暂留3小时；这不是实际起飞时间。${p==='B'?'酒店送站09:30／10:10，需按航班核对能否使用。':'离店时间还须符合酒店送站及机场巴士班次。'}餐食可在候机预留内安排。`,slots:[
 {end:-45,type:'meal',label:'酒店早餐',place:hotel},
 {end:0,type:'hotel',label:'收拾行李、退房',place:hotel},
 ...rows.map(([end,type,label,place])=>({end,type,label,place}))
 ]};
}
function scheduleFor(d,p){if(d.schedulePending)return null;const source=d.schedule?.slots?.length?{...d.schedule,start:typeof d.schedule.start==='string'?minutesOf(d.schedule.start):d.schedule.start,slots:d.schedule.slots.map(s=>({...s,end:typeof s.end==='string'?minutesOf(s.end):s.end}))}:d.id===7?departureSchedule(p):d.id===6&&p==='B'?SCHEDULE_B6:SCHEDULES[d.id];if(!source)return null;let cursor=source.start;return {...source,slots:source.slots.map((s,i)=>{const result={...s,start:cursor,duration:s.end-cursor,index:i};cursor=s.end;return result;}),end:source.slots.at(-1).end};}
function clockLabel(m,relative=false){if(relative){if(m===0)return '离店';const n=Math.abs(m);return `${m<0?'−':'+'}${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
function durationLabel(m){return m<60?`${m}分钟`:`${Math.floor(m/60)}小时${m%60?`${m%60}分钟`:''}`;}
function allocationDetails(s,schedule){return `<span class="allocation-type" style="--activity:${ACTIVITY_TYPES[s.type].color}">${ACTIVITY_TYPES[s.type].name}</span><strong>${escapeHtml(s.label)}</strong><span>${clockLabel(s.start,schedule.relative)}–${clockLabel(s.end,schedule.relative)} · ${durationLabel(s.duration)}</span><p>${escapeHtml(s.note||(s.type==='free'?'弹性时间可按体力调整；候场缓冲须保留必要余量。':s.type==='hotel'?'酒店色块只统计当前时间轴内的停留，不代表整晚睡眠时长。':'本段为暂定时间分配，需随实际交通、预约与当天进度调整。'))}</p>`;}
function renderSchedule(d,p){
 const target=$('day-schedule'),s=scheduleFor(d,p);if(!s){target.innerHTML=d.schedulePending?`<section class="allocation-card"><h3>时间分配待复核</h3><p>${escapeHtml(d.schedulePending)}</p><p>请按下方卡片的先后顺序与宽泛时段查看，未沿用旧路线的分钟表。</p></section>`:'';return;}
 const span=s.end-s.start,position=m=>(m-s.start)/span*100,ticks=[s.start];
 for(let m=Math.ceil(s.start/60)*60;m<s.end;m+=60)if(m-s.start>=45&&s.end-m>=45)ticks.push(m);
 ticks.push(s.end);
 const totals=Object.keys(ACTIVITY_TYPES).map(type=>({type,minutes:s.slots.filter(x=>x.type===type).reduce((v,x)=>v+x.duration,0)})).filter(x=>x.minutes);
 target.innerHTML=`<section class="allocation-card" aria-labelledby="allocation-heading"><div class="allocation-heading"><div><h3 id="allocation-heading">Day ${d.id} · 一天的时间分配</h3><p>${s.relative?'相对时间 · 以离店为0点':'日本时间 · '+clockLabel(s.start)+'–'+clockLabel(s.end)} · 暂定排程</p></div><div class="allocation-zoom" aria-label="时间轴显示比例"><button type="button" data-schedule-zoom="1" aria-pressed="true">全日</button><button type="button" data-schedule-zoom="2" aria-pressed="false">放大</button><button type="button" data-schedule-zoom="4" aria-pressed="false">细看</button></div></div><p class="allocation-notice">${escapeHtml(s.note)}</p><div class="allocation-legend">${totals.map(x=>`<span><i style="background:${ACTIVITY_TYPES[x.type].color}"></i>${ACTIVITY_TYPES[x.type].name} <strong>${durationLabel(x.minutes)}</strong></span>`).join('')}</div><div class="allocation-scroll" tabindex="0" role="region" aria-label="横向时间轴，可左右滚动查看放大后的安排"><div class="allocation-canvas"><div class="allocation-axis">${ticks.map((m,i)=>`<span class="allocation-tick ${i===0?'first':i===ticks.length-1?'last':''}" style="left:${position(m)}%"><span>${clockLabel(m,s.relative)}</span></span>`).join('')}</div><div class="allocation-track" role="group" aria-label="按先后顺序连续排列的活动">${s.slots.map(x=>`<button type="button" class="allocation-block" data-allocation="${x.index}" style="width:${x.duration/span*100}%;--activity:${ACTIVITY_TYPES[x.type].color}" aria-pressed="false" aria-label="${escapeHtml(x.label)}，${ACTIVITY_TYPES[x.type].name}，${clockLabel(x.start,s.relative)}至${clockLabel(x.end,s.relative)}，${durationLabel(x.duration)}，暂定" title="${escapeHtml(x.label)} · ${clockLabel(x.start,s.relative)}–${clockLabel(x.end,s.relative)} · ${durationLabel(x.duration)}"><span>${escapeHtml(x.label)}</span><small>${durationLabel(x.duration)}</small></button>`).join('')}</div></div></div><p class="allocation-help">色块宽度与时长成正比，所有活动在同一行首尾相接。点击色块看完整安排；短项目可放大后查看。${s.relative?'负号表示离店前，正号表示离店后。':''}</p><div class="allocation-detail" role="status" aria-live="polite">点击一个色块，查看活动名称、起止时间与预留说明。</div></section>`;
 const buttons=target.querySelectorAll('[data-allocation]'),detail=target.querySelector('.allocation-detail');
 buttons.forEach(b=>{const show=()=>{buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));detail.innerHTML=allocationDetails(s.slots[Number(b.dataset.allocation)],s);};b.addEventListener('click',show);b.addEventListener('focus',show);});
 target.querySelectorAll('[data-schedule-zoom]').forEach(b=>b.addEventListener('click',()=>{const zoom=Number(b.dataset.scheduleZoom);target.querySelector('.allocation-canvas').style.width=`${zoom*100}%`;target.querySelectorAll('[data-schedule-zoom]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));target.querySelector('.allocation-scroll').classList.toggle('zoomed',zoom>1);}));
}
