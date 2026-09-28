import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import YAML from 'yaml';
export function parseGraph(markdown){
 const block=markdown.match(/```mermaid\s*\n([\s\S]*?)```/);if(!block)throw Error('Missing Mermaid route');
 const nodes={},edges=[];let day=0;
 for(const [i,raw] of block[1].split('\n').entries()){
  const s=raw.trim();if(!s||s.startsWith('%%')||s==='flowchart TD'||s==='direction TB')continue;
  let m;if((m=s.match(/^subgraph day([1-7])\[/))){day=+m[1];continue;}if(s==='end'){day=0;continue;}
  if((m=s.match(/^(\w+)\["([^"]+)"\]$/))){if(!day||nodes[m[1]])throw Error('Duplicate/outside-day node at line '+(i+1));nodes[m[1]]={id:m[1],name:m[2],day};continue;}
  if((m=s.match(/^(\w+)\s+(-->|-\.->)(?:\|([^|]+)\|)?\s*(\w+)$/))){edges.push({from:m[1],to:m[4],optional:m[2]==='-.->',label:m[3]||''});continue;}
  throw Error('Unsupported route syntax at line '+(i+1)+': '+s);
 }
 const adjacency=Object.fromEntries(Object.keys(nodes).map(k=>[k,[]]));const incoming=new Set();
 for(const e of edges){if(!nodes[e.from]||!nodes[e.to])throw Error('Unknown route node');if(nodes[e.from].day>nodes[e.to].day)throw Error('Backward day edge');adjacency[e.from].push(e);incoming.add(e.to);}
 const roots=Object.keys(nodes).filter(k=>!incoming.has(k));if(roots.length!==1)throw Error('Route needs one root');
 const paths=[],seen=new Set();function walk(id,path){if(path.includes(id))throw Error('Route cycle: '+id);seen.add(id);const next=[...path,id];if(!adjacency[id].length){if(nodes[id].name!=='关西国际机场'||nodes[id].day!==7)throw Error('Route does not reach airport');paths.push(next);if(paths.length>1024)throw Error('Too many variants');}else for(const e of adjacency[id])walk(e.to,next);}
 walk(roots[0],[]);if(seen.size!==Object.keys(nodes).length)throw Error('Unreachable node');return {nodes,edges,paths};
}
export async function compileJourney(){
 const route=await readFile('docs/journey/route.md','utf8'),catalog=await readFile('docs/journey/catalog.md','utf8');const graph=parseGraph(route);
 const blocks={};for(const m of catalog.matchAll(/```yaml journey:(\w+)\n([\s\S]*?)```/g))(blocks[m[1]]??=[]).push(YAML.parse(m[2]));
 const legs=Object.fromEntries((blocks.leg||[]).map(l=>[l.to,l]));
 const places=Object.fromEntries(blocks.place.map(p=>[p.id,p]));if(Object.keys(places).length!==blocks.place.length)throw Error('Duplicate place IDs');
 const aliases={'Yamato 南船场2丁目营业所（寄送行李）':'yamato-minamisemba-2','永观堂':'eikando','银阁寺':'ginkakuji-temple','落柿舍':'rakushisha','若王子桥':'nyakuoji','银阁寺桥':'ginkaku','贵船神社奥宫':'okumiya','春日大社林荫参道':'kasuga','水谷茶屋':'mizuya','近铁奈良站':'kintetsunara','木津川运动公园':'fireworks','鸭川':'kamo','有马温泉小镇（午餐店待选）':'arima-town'};
 for(const n of Object.values(graph.nodes)){n.place=aliases[n.name]||blocks.place.find(p=>p.name===n.name)?.id;if(!n.place)throw Error('Missing catalog entry: '+n.name);}
 const keys={A:{5:'day-05-a',6:'day-06-a',7:'day-07-a'},B:{5:'day-05',6:'day-06-b',7:'day-07-b'},B2:{5:'day-05',6:'day-06-b2',7:'day-07-b2'}};
 const variants={A:{},B:{},B2:{}};const binding={};
 // Explicit same-place visit matching is persisted in the generated model; graph IDs
 // identify newly introduced visits. Never attach an old ID to a replacement place.
 const reserved={'d2-osaka':'osaka','d1-osaka':'osaka','d1-osaka-2':'osaka','d6-storage':'storage','d6-sannomiya-2':'sannomiya'};
 for(const full of graph.paths){const p=full.includes('d5a_hotel')?'A':full.includes('d6b_kyukamura')?'B2':'B';
  if(graph.edges.some(e=>full.includes(e.from)&&full[full.indexOf(e.from)+1]===e.to&&((e.label.includes('Plan A')&&p!=='A')||(e.label.includes('Plan B')&&p==='A'))))continue;
  for(let day=1;day<=7;day++){
   const ids=full.filter(id=>graph.nodes[id].day===day),signature=ids.join(',');const list=variants[p][day]??=[];if(list.some(v=>v.signature===signature))continue;
   const base=blocks.day.find(d=>d.id===(keys[p][day]||'day-0'+day));if(!base)throw Error('Missing day metadata');const used=new Set();
   const lazy=day===2&&ids.includes('d2_06')&&!ids.includes('d2_04'), lazyBranch=lazy?base.optional.find(o=>o.id==='day-02-optional-lazy'):null;
   const hozu=ids.includes('d2h_board'), branch=hozu?base.optional.find(o=>o.id==='day-02-optional-hozu'):null;
   const stops=ids.map((id,index)=>{const node=graph.nodes[id],candidates=base.stops.filter(s=>s.place===node.place&&!used.has(s.id));let original=candidates[0];if(hozu&&id.startsWith('d2h_'))original=branch.stops.find(s=>s.id===id.replaceAll('_','-'));if(hozu&&id==='d2_sagajr')original=branch.stops.find(s=>s.id==='d2h-return');if(original)used.add(original.id);
    const bindKey=(day<5?'shared':p==='B2'&&day===5?'B':p)+':'+id;
    const oldAllowed=original&&(!reserved[original.id]||reserved[original.id]===node.place);
    let cid=binding[bindKey]??(oldAllowed?original.id:'route-'+bindKey.replace(':','-').replaceAll('_','-').toLowerCase());binding[bindKey]=cid;
    let mode=original?.mode||'walk';let connection=original?.connection||'按路线图顺序衔接；实际步行出口与候车时间待核';
    if(/站$/.test(node.name)&&index&&/站$/.test(graph.nodes[ids[index-1]].name)){mode='rail';connection='铁路换乘，班次与带箱换乘时间待核';}
    if(hozu&&id.startsWith('d2h_')&&original){mode=original.mode||mode;connection=original.connection||connection;}
    if(node.place==='otagi-bus'){mode='bus';connection='野宫乘京都巴士94路至爱宕寺前；实际班次待核';}
    if(node.place==='otagi'&&!hozu){mode='walk';connection='爱宕寺前下车后短走至寺门';}
    if(node.place==='kobe-city')connection='酒店放妥行李后，三宫・元町短逛与咖啡休息';
    if(node.place==='kobe-dinner'){mode='rail';connection='须磨返回神户市区；餐厅待选';}
    if(node.place==='venus'){mode='taxi';connection='元町附近打车往返，五人需两辆普通车或确认大车；回程叫车待核';}
    if(day===5&&p==='A'&&id==='d5a_sannomiya'){mode='rail';connection=original.connection;}
    if(id==='d6_return'){mode='taxi';connection='从观景点附近允许上车处返回元町；预约回程车辆';}
    // Newly split station legs must not inherit the original combined rail leg.
    if(index&&/站$/.test(graph.nodes[ids[index-1]].name)&&places[node.place].hotel&&mode==='rail')mode='walk';
    if(index&&/站$/.test(graph.nodes[ids[index-1]].name)&&places[node.place].hotel&&mode==='walk')connection='出站后步行至酒店；出口与拖箱时间以酒店实际位置为准';
    if(node.place==='kobe-dinner')original={time:'海边休息后 · 晚上',note:'神户市区晚餐店待选，预留60–90分钟，餐饮未预订不计入费用。'};
    if(id==='d6_evening')original={time:'晚饭后 · 仅在选择夜景时',note:'在元町附近乘出租车去Venus Bridge，非白天逛店段。'};
    if(id==='d6_return')original={time:'夜景后',note:'预约或确认返程出租车，返回元町后回酒店。'};
    if(id==='d3_kifune_return')original={time:'下山前',note:'在本宫附近收束；若选择奥宫支线，先回到本宫再乘巴士下山。'};
    if(id==='d4_inari_return')original={time:'短线折返后',note:'经千本鸟居原路返回，不继续登山。'};
    if(hozu&&id==='d2_01')original={...original,time:'约06:00–06:30出发（倒排预算）',note:'为10:00游船提前离开大阪；早餐另安排，班次与酒店寄存待确认。'};
    if(hozu&&id==='d2_02')original={...original,time:'目标08:00–08:15寄存完成',note:'先寄存后乘JR赴龟冈站北口；寄存、车站移动和候车需留余量。'};
    if(hozu&&id==='d2_11')original={...original,time:'岚山返程后',note:'回酒店办理入住并休息约60分钟；晚间祇园按体力缩短。'};
    if(lazy){
     original={...original,time:id==='d2_01'?'10:00起床后退房（暂定）':id==='d2_osakast'?'目标10:30出发，视酒店衔接调整':id==='d2_02'?'抵达京都后寄存、午餐':id==='d2_06'?'午餐后上山，争取15:00前到寺':id==='d2_11'?'回酒店休息约60分钟':'按当日进度从容衔接'};
     if(id==='d2_06'){mode='taxi';connection=lazyBranch.stops[0].connection;original.note=lazyBranch.stops[0].note+' '+lazyBranch.scheduleNote;}
    }
    const kyotoLegs={
     d2_02:['taxi','京都站至Cross Keys民宿寄存行李；拖箱交通及接收时段待核'],
     d2_kyotost_out:['taxi','从Cross Keys民宿返回京都站乘JR；时间与费用按新地址重算'],
     d2_checkin:['taxi','京都站返回the kind cafe，在16:00–21:00办理入住'],
     d2_11:['walk','咖啡厅办妥入住后前往对面Cross Keys（本町2丁目89）'],
     d2_16:['walk','祇园四条返回Cross Keys；按体力选择京阪至清水五条再步行，路线待核'],
     d3_02:['taxi','Cross Keys出发前往若王子桥；交通时长费用按新地址待核'],
     d3_10:['rail','出町柳乘京阪至清水五条，再步行返回Cross Keys'],
     d4_kiyomizu_out:['walk','先退房并按约定寄存，再步行到清水五条站'],
     d4_keihan_inari_out:['rail','京阪清水五条至伏见稻荷，选择停靠本站的列车'],
     d4_02:['walk','京阪伏见稻荷站步行到伏见稻荷大社，非JR稻荷站出发'],
     d4_keihan_inari_back:['walk','参拜后步行返回京阪伏见稻荷站'],
     d4_kiyomizu_back:['rail','京阪返回清水五条站'],
     d4_03:['walk','返回Cross Keys民宿取寄存行李'],
     d4_kiyomizu_uji:['walk','取件后步行至清水五条站，预留拖箱时间'],
     d4_tofukuji_uji:['rail','京阪清水五条至东福寺，下车换JR奈良线'],
     d4_ujist_arrive:['rail','东福寺乘JR奈良线前往JR宇治，核对停靠站']
    };
    if(day>=2&&day<=4){
     if(kyotoLegs[id]){[mode,connection]=kyotoLegs[id];}
     original={...original,time:'按新住宿衔接 · 时刻待确认'};
     if(id==='d2_02')original.note='先到Cross Keys民宿寄存；最早接收时段尚未确认，不能默认08:00可寄存。高精力版本须先确认寄存再预约早班船。';
     if(id==='d2_checkin'){original.time='16:00–21:00（JST）';original.note='最迟10/1告知房东预计入住时间。先到84-2号咖啡厅办理入住，再去对面89号民宿；21:00前完成，夜游安排在入住后。';}
     if(id==='d4_01'){original.time='出游前退房 · 10:00前（JST）';original.note='先退房并按约定寄存，再去伏见稻荷；回来仅取行李，不能保留客房至中午。';}
     if(id==='d4_03')original.note='仅取行李，在Cross Keys民宿交接，可用时段另核。取件后清水五条→东福寺换JR→宇治。';
    }
    if(legs[id]){mode=legs[id].mode;connection=legs[id].connection;}
    if(id==='d2_06'&&lazy){mode='taxi';connection=lazyBranch.stops[0].connection;}
    if(id==='d2_yamato')original={...original,time:'退房后 · 当日配送08:00–10:00办理（JST）'};
    if(id==='d2_06'&&!lazy){mode='rail';connection='观光列车嵯峨下车→步行至野宫巴士站→乘往爱宕寺前的班次；巴士时刻待核，亦可从嵯峨直接打车上山';}
    if(id==='d2_01'){original={...original,time:ids.includes('d2_yamato')?'提前退房，为10:00前寄送留余量':'11:00前退房；按所选游览方案出发',note:places[node.place].hotel.note};}
    if(places[node.place].hotel&&!original)original={time:'按住宿与交通衔接',note:places[node.place].hotel.note};
    if(id==='d6_01'||id==='d6_hotelpickup')original={time:id==='d6_01'?'按订单退房时间':'午餐后取件',note:'兆乐已订10/5–10/6。早餐与退房时刻、寄存和取件条件待确认；不沿用原酒店时刻。'};
    if(id==='d6_16'&&ids.includes('d6_10')){mode='taxi';connection='Venus Bridge结束后乘预约或已确认的出租车下山，返回神户酒店；酒店位置未定，路线待核';}
    return {id:node.place,commentId:cid,graphId:id,time:original?.time||'衔接时段 · 待确认',note:original?.note||places[node.place].duration||'途经点；预留步行、换乘与等候时间。',mode,connection,duration:original?.duration,deadline:original?.deadline};
   });
   if(day===5&&p==='A'&&stops.some(s=>s.id==='nara'))throw Error('Plan A must not use Nara hotel storage');
   const choices=[];if(lazy)choices.push('究极懒人');if(hozu)choices.push('保津川游船');if(ids.includes('d2_kamo'))choices.push('鸭川');if(ids.includes('d3_okumiya'))choices.push('贵船奥宫');if(day===4&&!ids.includes('d4_06'))choices.push('跳过茶体验');if(ids.includes('d5_todaiji'))choices.push('东大寺＋南大门');if(ids.includes('d6_10'))choices.push('饭后Venus Bridge');
   const baseline=choices.length===0;const metrics=day<5?({1:['3–5','120–250'],2:['8–11','300–550'],3:['5–7','200–350'],4:['6–9','250–500']}[day]):day===5?(p==='A'?['4–6','200–350']:['6–9','300–550']):day===6?(p==='A'?['3–5','120–250']:['1–3','50–150']):day===7?['1–2','40–100']:null;
   const d={...structuredClone(base),id:day,date:base.date.slice(5).replace('-','.'),weekday:'周'+'日一二三四五六'[new Date(base.date+'T12:00:00+09:00').getUTCDay()],links:base.links||[],notes:base.notes||[],stops,focus:[...new Set(stops.map(s=>s.id))],signature,key:ids.join('~'),label:choices.map(c=>c==='保津川游船'?'高精力版本':c).join(' · ')||'主线',choices,baseline,variantPlan:p,distance:metrics?.[0]||base.distance||'待复核',calories:metrics?.[1]||base.calories||'待复核'};
   if(choices.length){d.distance='待复核';d.calories='待复核';d.schedulePending='已切换可选路线；时间分配需按所选支线复核，以卡片顺序和宽泛时段为准。';}
   if(day>=5&&!(p==='B'&&day===6))d.schedulePending=base.schedule?.note||'路线已更新，交通班次与停留时间待复核。';
   if(!base.budget?.items?.length)d.budgetPending=base.budget?.summary||'交通和酒店预算待报价，不代表免费。';
   if(day===5&&p==='B')d.notes=d.notes.filter(n=>!n.includes('前五晚住宿'));
   if(day>=6&&p==='B2')d.notes=d.notes.filter(n=>!n.includes('前五晚住宿')).concat('第五晚住奈良；第六、七天联动使用休暇村接驳。');
   if(hozu){
    d.title='高精力版本 · 游船与岚山上行徒步';
    d.schedulePending=branch.scheduleNote;
    d.notes=[branch.scheduleNote,'京都酒店寄存目标08:00–08:15完成，暂按06:00–06:30离开大阪酒店倒排；JR、寄存与船票余位均待确认。','上行徒步主干约3.5–4.5公里、70–95分钟，寺内与车站步行另计；含午餐停留至寺内结束约3小时15分–4小时15分。全日里程与热量待复核。','若13:00才下船，应缩短沿途停留，时间不足取消爱宕寺末段；停航或订不到车船则选原路线。'];
    d.budget={summary:branch.budgetNote,items:[{name:'保津川成人船票',min:6000,max:6000,note:'仅本支线计入；五位成人30,000 JPY，未订票。',source:places['hozu-board'].tickets[0].source,confirmed:true},{name:'爱宕念佛寺成人门票',min:1000,max:1000,note:'完整支线包含寺院参观；取消寺院时不产生本项。',source:'https://www.otagiji.com/visit-en',confirmed:true}],notes:[branch.budgetNote,'住宿、税费、JR和两辆返程出租车待核；本支线不含小火车及龟冈接驳巴士；未预订餐饮不计。']};
    d.budgetPending='游船版全日总额待复核，下面仅列已知门票，不套用原路线交通合计。';
   }
   if(lazy){
    d.title='究极懒人 · 打车上山，沿街下行';d.intensity='省换乘，仍有下坡步行';
    d.subtitle='京都酒店寄存、午餐后直接打车到爱宕念佛寺，再经鸟居本、落柿舍、竹林至渡月桥。';
    d.schedulePending=lazyBranch.scheduleNote;
    d.notes=[lazyBranch.note,lazyBranch.stops[0].note,lazyBranch.scheduleNote,'10:00起床、10:30大阪站出发仅作目标，酒店至大阪站的退房与交通需另留时间。京都寄存后可先用午餐再乘车上山。','寺内及下行仍需步行；累了随时收束。回酒店休息约60分钟，祇园夜游按体力决定。'];
    d.budget={summary:lazyBranch.budgetNote,items:[{name:'爱宕念佛寺成人门票',min:1000,max:1000,note:'只计一次，实际进入寺院时发生。',source:'https://www.otagiji.com/visit-en',confirmed:true}],notes:[lazyBranch.budgetNote,'JR往返、京都酒店直达寺院出租车、住宿及税费尚待核算；未预订餐饮不计入。']};
    d.budgetPending='究极懒人版总额待复核，不套用原路线交通预算。';
   }
   if(day>=2&&day<=4){
    d.distance='待复核';d.calories='待复核';
    d.schedulePending='京都住宿改为Cross Keys；寄存可用时段与新地址交通待核，旧分钟表暂停。'+(hozu?'高精力版本原08:00寄存、10:00船暂不能保证，确认房东接收时间后重排。':'');
    d.notes=d.notes.filter(n=>!n.includes('08:00–08:15')&&!n.includes('06:00–06:30')).concat(base.notes.filter(n=>n.includes('Cross Keys')||n.includes('京都站前')));
    d.budget={...d.budget,items:(d.budget?.items||[]).filter(i=>!['交通','住宿','税'].some(k=>i.name.includes(k)))};
    d.budgetPending='新住宿衔接交通及税费待确认；人民币房费单列，不直接并入JPY合计。';
    d.budget.notes=[...(d.budget.notes||[]),'京都Cross Keys已预订，4人2晚房费合计3,349.99 CNY（人民币），现金住宿税金额待房东告知；CNY房费不直接混入JPY费用合计。住宿查询采用4位成人、2间房，实际订单寝具配置待补充；不把历史占位价当成已付费用。'];
    if(lazy)d.subtitle='Cross Keys民宿寄存、午餐后直接打车上山，再经鸟居本、落柿舍、竹林至渡月桥。';
   }
   if(day===2&&ids.includes('d2_yamato')){
    d.schedulePending=base.schedule.note+(hozu?' '+branch.scheduleNote:lazy?' '+lazyBranch.scheduleNote:'');
    d.notes=[...base.notes,...(hozu?[branch.scheduleNote]:lazy?[lazyBranch.scheduleNote]:[])];
    d.subtitle=lazy?'大阪Yamato寄送行李后经新大阪乘新干线赴京都，从京都站打车到爱宕念佛寺，再沿街下行。':hozu?'大阪Yamato寄送行李后经新大阪乘新干线赴京都，JR龟冈接保津川游船；岚山徒步后到the kind cafe入住。':base.subtitle;
    d.budget.notes=[...base.budget.notes,...(hozu?[branch.budgetNote]:lazy?[lazyBranch.budgetNote]:[])];
    d.budgetPending='新干线及接驳、行李寄送与税费待核；CNY住宿费单列，京都站寄存仅作后备。';
   }
   if(day===4)d.budget.notes.push('宇治酒店已预订：4位成人、2间房、1晚：含10%增值税房费总额37,400 JPY（日元）；Booking.com支付／补贴4,080 JPY，扣减后计算金额33,320 JPY。确认信不据此证明旅客已付款或待付金额，付款状态以订单为准；额外服务不包含。这是4人订单总额，单独列示，不按全队5人均摊或重复计入每人JPY小计。');
   if(base.flexible){d.flexible=true;d.schedulePending=base.schedule.note;d.distance='按实际选择';d.calories='按实际选择';}
   if(day===1){d.budgetPending='交通与已订Sugata房费待补；景点按实际选择计费。';}
   if(day===3)d.schedulePending=base.schedule.note;
   if(day===5){d.budgetPending='兆乐房费、含餐与交通待确认；仅列已知门票。';d.distance='待复核';d.calories='待复核';}
   if(ids.includes('d5_todaiji'))d.budget.items.push({name:'东大寺大佛殿成人门票',min:800,max:800,note:'仅加入东大寺备选时计入，南大门外观不另收费。',source:'https://www.todaiji.or.jp/information/haikan/',confirmed:true});
   const ticketMap=new Map(Object.values(places).flatMap(p=>p.tickets||[]).map(t=>[t.id,t]));
   d.budget.items=(d.budget.items||[]).map(i=>{if(Number.isFinite(i.min)&&Number.isFinite(i.max))return i;const options=(i.ticketOptions||[]).map(id=>ticketMap.get(id));if(!options.length||options.some(t=>!t||!Number.isFinite(t.amount)))throw Error('Missing cost amount: '+i.name);return {...i,min:Math.min(...options.map(t=>t.amount)),max:Math.max(...options.map(t=>t.amount)),source:options[0].source};});
   if(day===4&&!ids.includes('d4_06'))d.budget.items=d.budget.items.filter(i=>!i.name.includes('对凤庵')&&!i.name.includes('茶体验'));
   list.push(d);
  }
 }
 for(const days of Object.values(variants))for(const list of Object.values(days))list.sort((a,b)=>Number(b.baseline)-Number(a.baseline));
 const model={version:1,routeHash:createHash('sha256').update(route).digest('hex'),catalogHash:createHash('sha256').update(catalog).digest('hex'),nodes:graph.nodes,edges:graph.edges,places,variants};
 const usedIds=new Set(Object.values(graph.nodes).map(n=>n.place));const coords=Object.fromEntries([...usedIds].map(id=>{const p=places[id];return [id,[p.name,p.lat??null,p.lng??null,p.mapQuery||p.name]];}));
 const hotels=Object.fromEntries([...usedIds].filter(id=>places[id].hotel).map(id=>[id,places[id].hotel]));
 const code=`// Generated from docs/journey/route.md and catalog.md. Do not edit.\nconst JOURNEY_MODEL=${JSON.stringify(model)};\nObject.assign(PLACES,${JSON.stringify(coords)});\nObject.assign(HOTELS,${JSON.stringify(hotels)});\nDAYS.splice(0,DAYS.length,...Object.values(JOURNEY_MODEL.variants.A).map(v=>v[0]));\nfor(const id of Object.keys(PLAN_B))delete PLAN_B[id];\nfor(const [id,v] of Object.entries(JOURNEY_MODEL.variants.B))if(+id>=5)PLAN_B[id]=v[0];\nMODES.boat={name:'游船',color:'#4f8194',dash:'8 4',icon:'船'};\nMODES.taxi={name:'出租车',color:'#9b723c',dash:'8 5',icon:'车'};\nif(typeof ACCESS_HOURS!=='undefined')for(const p of Object.values(JOURNEY_MODEL.places)){if(p.hours)ACCESS_HOURS[p.id]=p.hours;}\nif(typeof VISIT_TIMES!=='undefined')for(const p of Object.values(JOURNEY_MODEL.places)){if(p.duration)VISIT_TIMES[p.id]=p.duration;}\n`;
 await writeFile('dist/journey-model.js',code);return model;
}
if(process.argv[1]?.endsWith('compile-journey.mjs'))await compileJourney();
