import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {parseGraph} from '../scripts/compile-journey.mjs';
const read=p=>fs.readFileSync(p,'utf8');
const model=vm.runInNewContext(read('dist/data.js')+read('dist/journey-model.js')+';JOURNEY_MODEL');
const route=read('docs/journey/route.md');
test('all source nodes and every consecutive route edge survive compilation',()=>{
 const covered=new Set();for(const days of Object.values(model.variants))for(const list of Object.values(days))for(const d of list){const ids=d.stops.map(s=>s.graphId);ids.forEach(id=>covered.add(id));for(let i=1;i<ids.length;i++)assert.ok(model.edges.some(e=>e.from===ids[i-1]&&e.to===ids[i]));assert.equal(new Set(d.stops.map(s=>s.commentId)).size,d.stops.length);}
 assert.equal(covered.size,Object.keys(model.nodes).length);
});
test('booked hotels connect across nights and retired plans are absent',()=>{
 assert.equal(model.variants.A[1][0].hotel,'sugata-osaka');assert.equal(model.variants.A[5][0].hotel,'choraku');
 assert.equal(Object.keys(model.variants.B).length,0);assert.equal(Object.keys(model.variants.B2).length,0);
 for(let day=1;day<7;day++)for(const d of model.variants.A[day])assert.equal(d.stops.at(-1).id,model.variants.A[day+1][0].stops[0].id);
 const data=vm.runInNewContext(read('dist/data.js')+read('dist/journey-model.js')+';PLAN_B');assert.equal(Object.keys(data).length,0);
});
test('only luggage stations remain as cards while train details remain in connections',()=>{
 for(const list of Object.values(model.variants.A))for(const d of list)for(const s of d.stops)assert.ok(!/站$/.test(model.places[s.id].name),s.id);
 for(const d of model.variants.A[5]){assert.equal(d.stops.filter(s=>s.id==='nara-kintetsu-storage').length,2);assert.match(d.stops.at(-1).connection,/直通快速急行.*三宫.*谷上.*有马口.*兆乐/);}
});
test('Day1 is a flexible list with no fabricated minute schedule',()=>{
 const d=model.variants.A[1][0];assert.ok(d.flexible&&d.schedulePending);assert.equal(d.calories,'按实际选择');assert.equal(d.budget.items[0].min,0);assert.equal(d.budget.items[0].max,2000);
 assert.deepEqual(Array.from(d.stops.map(s=>s.id)),['kix','sugata-osaka','tsutenkaku','nippombashi-denden','namba-yasaka','kuromon-market','dotonbori','hozenji','shinsaibashi','nakazakicho','umeda-shopping','umeda-sky','sugata-osaka']);
});
test('optional temple and night walk do not leak into the baseline',()=>{
 assert.ok(!model.variants.A[5][0].stops.some(s=>['todaiji','nandaimon'].includes(s.id)));
 assert.ok(!model.variants.A[6][0].stops.some(s=>s.id==='venus'));
 assert.ok(model.variants.A[6].some(d=>d.stops.some(s=>s.id==='venus')));
 const temple=model.variants.A[5].find(d=>d.choices.includes('东大寺＋南大门'));assert.equal(temple.budget.items.filter(i=>i.name.includes('东大寺')).length,1);
});
test('new temples have prices, separate last-entry times and distinct map points',()=>{
 const d=model.variants.A[3][0];assert.ok(d.stops.some(s=>s.id==='eikando'));assert.ok(d.stops.some(s=>s.id==='ginkakuji-temple'));assert.equal(d.budget.items.reduce((n,x)=>n+x.min,0),2000);
 assert.match(model.places.eikando.hours.last,/16:00/);assert.match(model.places['ginkakuji-temple'].hours.last,/17:00/);assert.notEqual(model.places['ginkakuji-temple'].lat,model.places.ginkaku.lat);
});
test('old hotel dinner deadline and comment IDs are not assigned to replacements',()=>{
 const old=['d1-osaka','d1-osaka-2','d2-osaka','d5a-hotel','d6-arima-hotel','d6-arima-pickup'];
 for(const list of Object.values(model.variants.A))for(const d of list)for(const s of d.stops)if(['sugata-osaka','choraku'].includes(s.id))assert.ok(!old.includes(s.commentId));
 for(const d of model.variants.A[5]){const deadline=d.stops.find(s=>s.commentId==='d5a-down').deadline;assert.match(deadline.title,/兆乐/);assert.match(deadline.transit,/待重新倒排/);assert.equal(deadline.source,'https://choraku.com/access/');}
});
test('Hozu and lazy branches remain exclusive after removing transit nodes',()=>{
 const days=model.variants.A[2];assert.equal(days.length,6);assert.ok(days[0].stops.some(s=>s.id==='sagano-ride'));
 for(const d of days.filter(d=>d.choices.includes('保津川游船'))){assert.ok(!d.stops.some(s=>s.id==='sagano-ride'));assert.match(d.stops.find(s=>s.id==='hozu-board').connection,/JR山阴.*龟冈站北口/);assert.equal(d.stops.find(s=>s.id==='hozu-land').mode,'boat');assert.equal(d.stops.find(s=>s.id==='kind-cafe').mode,'taxi');assert.equal(d.budget.items.find(i=>i.name.includes('船票')).min,6000);}
 for(const d of days.filter(d=>d.choices.includes('究极懒人'))){const i=d.stops.findIndex(s=>s.id==='otagi');assert.equal(d.stops[i-1].id,'yamato-minamisemba-2');assert.equal(d.stops[i].mode,'taxi');assert.ok(!d.stops.some(s=>['hozu-board','sagano-ride'].includes(s.id)));}
});
test('booked Kyoto and Uji information and luggage loop remain intact',()=>{
 for(const d of model.variants.A[2]){const i=d.stops.findIndex(s=>s.id==='kind-cafe');assert.equal(d.stops[i+1].id,'cross-keys');assert.match(d.stops[i].time,/21:00/);}
 for(const d of model.variants.A[4]){assert.match(d.stops.find(s=>s.graphId==='d4_03').connection,/京阪伏见稻荷.*清水五条.*取件/);assert.match(d.stops.find(s=>s.graphId==='d4_04').connection,/东福寺.*宇治/);}
 assert.match(model.places['cross-keys'].hotel.note,/3,349.99 CNY/);assert.match(model.places.uji.hotel.note,/37,400 JPY/);assert.equal(model.places.fireworks.lat,34.846066);
 const skip=model.variants.A[4].find(d=>d.choices.includes('跳过茶体验'));assert.ok(skip.budget.items.every(i=>!i.name.includes('对凤庵')));
});
test('all selectable budgets are numeric and unknown totals stay pending',()=>{
 const ctx={structuredClone};vm.createContext(ctx);vm.runInContext(read('dist/data.js')+read('dist/estimates.js')+read('dist/schedule.js')+read('dist/journey-model.js'),ctx);
 vm.runInContext(`for(const list of Object.values(JOURNEY_MODEL.variants.A))for(const d of list){const b=budgetFor(d,'A');if(d.budgetPending&&!b.pending)throw Error('Missing pending state');for(const i of b.items)if(!Number.isFinite(i.min)||!Number.isFinite(i.max))throw Error('Invalid amount');if(d.schedulePending&&scheduleFor(d,'A')!==null)throw Error('Stale minute schedule');}`,ctx);
});
test('graph ordering is driven by edges and malformed graphs fail',()=>{
 const original=parseGraph(route);const lines=route.split('\n'),indices=lines.map((l,i)=>/^\s+d2_\w+\["/.test(l)?i:-1).filter(i=>i>=0),reversed=indices.map(i=>lines[i]).reverse();indices.forEach((n,i)=>lines[n]=reversed[i]);assert.deepEqual(parseGraph(lines.join('\n')).paths,original.paths);
 assert.throws(()=>parseGraph(route.replace('d1_01 --> d1_03','d1_01 --> nonexistent')));assert.throws(()=>parseGraph(route.replace('d1_01 --> d1_03','d1_01 --> d1_01')));
});


test('all active place information renders even when no source list exists',()=>{
 const ctx={structuredClone,escapeHtml:s=>String(s),external:(url,label)=>label};vm.createContext(ctx);
 vm.runInContext(read('dist/data.js')+read('dist/hours.js')+read('dist/journey-model.js')+read('dist/tickets.js'),ctx);
 vm.runInContext(`for(const list of Object.values(JOURNEY_MODEL.variants.A))for(const d of list)for(const s of d.stops){renderAccessHours(s.id);renderTicket(s.id);}`,ctx);
});

test('Day2 shipping replaces morning residence storage across all branches',()=>{
 for(const d of model.variants.A[2]){
  assert.equal(d.stops[1].id,'yamato-minamisemba-2');assert.equal(d.stops[1].commentId,'d2-yamato');
  assert.match(d.stops[1].time,/10:00/);assert.match(d.stops[2].connection,/新大阪.*新干线/);
  assert.ok(!d.stops.slice(0,d.stops.findIndex(s=>s.id==='kind-cafe')).some(s=>s.id==='cross-keys'));
  assert.doesNotMatch(d.subtitle+d.schedulePending+d.notes.join(' '),/民宿寄存、午餐后直接打车|确认房东接收时间后重排/);
 }
 const d=model.places['yamato-minamisemba-2'].delivery;
 assert.equal(d.postalCode,'605-0981');assert.equal(d.addressJa,'京都市東山区本町2丁目84-2');
 assert.equal(d.phone,'09037105864');assert.equal(d.recipient,'冨浪喜久子');
 assert.match(model.places['cross-keys'].mapQuery,/89 Honmachi/);
 const fn=read('dist/app.js').split('function renderDelivery(id){')[1].split('function renderTimeline')[0];
 const html=vm.runInNewContext('function renderDelivery(id){'+fn+';renderDelivery("yamato-minamisemba-2")',{JOURNEY_MODEL:model,escapeHtml:s=>String(s),external:(u,l)=>l});
 for(const value of [d.addressJa,d.addressEn,d.recipient,d.recipientEn,d.phone])assert.ok(html.includes(value));
});

test('Day2 late shipping fallback keeps cutoff and delivery time distinct',()=>{
 const f=model.places['yamato-minamisemba-2'].delivery.fallback;
 assert.match(f.cutoff,/11:30/);assert.match(f.deliveryTime,/20:00/);
 assert.equal(f.mapUrl,'https://maps.app.goo.gl/ZFMx9ELH2VjUvqA4A');
 assert.match(f.fee,/1,100 JPY／件/);assert.match(f.note,/京都站寄存/);
 for(const d of model.variants.A[2]){
  assert.match(d.luggage,/新大阪駅東口営業所/);assert.match(d.schedulePending,/11:30/);
  assert.match(d.stops[1].note,/20:00/);
 }
 const fn=read('dist/app.js').split('function renderDelivery(id){')[1].split('function renderTimeline')[0];
 const html=vm.runInNewContext('function renderDelivery(id){'+fn+';renderDelivery("yamato-minamisemba-2")',{JOURNEY_MODEL:model,escapeHtml:s=>String(s),external:(u,l)=>u+l});
 for(const value of [f.name,f.cutoff,f.deliveryTime,f.mapUrl,f.sourceUrl])assert.ok(html.includes(value));
});
