import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {parseGraph} from '../scripts/compile-journey.mjs';
const read=p=>fs.readFileSync(p,'utf8');
const model=vm.runInNewContext(read('dist/data.js')+read('dist/journey-model.js')+';JOURNEY_MODEL');
const route=read('docs/journey/route.md');
test('all route nodes are represented and branches retain source edges',()=>{
 const covered=new Set();for(const days of Object.values(model.variants))for(const list of Object.values(days))for(const day of list){const ids=day.stops.map(s=>s.graphId);ids.forEach(id=>covered.add(id));for(let i=1;i<ids.length;i++)assert.ok(model.edges.some(e=>e.from===ids[i-1]&&e.to===ids[i]));assert.equal(new Set(day.stops.map(s=>s.commentId)).size,day.stops.length);}
 assert.equal(covered.size,Object.keys(model.nodes).length);
});
test('Plan A storage and hotel handoffs never mix with Plan B',()=>{
 for(const d of model.variants.A[5]){assert.ok(!d.stops.some(s=>s.id==='nara'));assert.equal(d.hotel,'hanamusubi');assert.equal(d.stops.at(-1).id,'hanamusubi');}
 for(const p of ['B','B2'])for(const d of model.variants[p][5]){assert.ok(!d.stops.some(s=>s.id==='nara-jr-storage'));assert.equal(d.hotel,'nara');}
 for(const p of ['A','B','B2'])for(let day=5;day<7;day++)assert.equal(model.variants[p][day][0].stops.at(-1).id,model.variants[p][day+1][0].stops[0].id);
});
test('optional visits stay out of the main route and hotel alternatives are exclusive',()=>{
 for(const p of ['A','B','B2'])assert.ok(!model.variants[p][5][0].stops.some(s=>['todaiji','nandaimon'].includes(s.id)));
 assert.ok(!model.variants.A[6][0].stops.some(s=>['venus','hakutsuru','arima'].includes(s.id)));
 assert.ok(model.variants.A[6].some(d=>d.stops.some(s=>s.id==='venus')));
 assert.equal(model.variants.B2[6][0].hotel,'kyukamura-kishu-kada');
 assert.ok(!model.variants.B2[6][0].stops.some(s=>s.id==='kaigetsu'));
});
test('unknown hotel coordinates are absent and updated fireworks coordinates survive',()=>{assert.equal(model.places['kobe-hotel'].lat,undefined);assert.equal(model.places.fireworks.lat,34.846066);});
test('declaration order does not determine the itinerary and malformed routes fail',()=>{
 const original=parseGraph(route);let lines=route.split('\n');let indices=lines.map((l,i)=>/^\s+d2_\w+\["/.test(l)?i:-1).filter(i=>i>=0);const reversed=indices.map(i=>lines[i]).reverse();indices.forEach((n,i)=>lines[n]=reversed[i]);assert.deepEqual(parseGraph(lines.join('\n')).paths,original.paths);
 assert.throws(()=>parseGraph(route.replace('d1_01 --> d1_02','d1_01 --> nonexistent')));
 assert.throws(()=>parseGraph(route.replace('d1_01 --> d1_02','d1_01 --> d1_01')));
});
test('every selectable route has safe budget and schedule rendering data',()=>{
 const ctx={structuredClone};vm.createContext(ctx);vm.runInContext(read('dist/data.js')+read('dist/estimates.js')+read('dist/schedule.js')+read('dist/journey-model.js'),ctx);
 vm.runInContext(`for(const [p,days] of Object.entries(JOURNEY_MODEL.variants))for(const list of Object.values(days))for(const d of list){const b=budgetFor(d,p==='A'?'A':'B');if(!b||!Array.isArray(b.items))throw Error('Missing budget');if(d.budgetPending&&!b.pending)throw Error('Unknown costs shown as zero');const s=scheduleFor(d,p);if(s&&s.slots.some(x=>!Number.isFinite(x.duration)||x.duration<=0))throw Error('Invalid schedule');}`,ctx);
});

test('Day5 A uses Kintetsu storage and through train with conservative deadline',()=>{
 for(const d of model.variants.A[5]){
  assert.equal(d.stops.filter(s=>s.id==='nara-kintetsu-storage').length,2);
  assert.ok(!d.stops.some(s=>s.id==='nara-jr-storage'||s.id==='osakast'));
  const train=d.stops.find(s=>s.graphId==='d5a_sannomiya');assert.match(train.connection,/直通快速急行/);
  const deadline=d.stops.find(s=>s.commentId==='d5a-down').deadline;assert.match(deadline.taxi,/13:45/);assert.match(deadline.transit,/13:20/);
 }
 for(const p of ['B','B2'])for(const d of model.variants[p][5])assert.ok(d.stops.every(s=>s.id!=='nara-kintetsu-storage'&&!s.deadline));
});

test('Hozu branch uses JR Kameoka without sightseeing train and returns by taxi',()=>{
 for(const plan of ['A','B','B2']){
  const days=model.variants[plan][2];assert.equal(days.length,6);assert.ok(!days[0].stops.some(s=>s.id==='hozu-board'));
  for(const d of days.filter(d=>d.choices.includes('保津川游船'))){
   const places=d.stops.map(s=>s.id);assert.ok(places.includes('jr-kameoka'));
   assert.ok(!places.includes('kameoka')&&!places.includes('saga'));assert.ok(!places.includes('umahori'));
   assert.equal(d.stops.find(s=>s.id==='hozu-land').mode,'boat');
   assert.equal(d.stops.find(s=>s.graphId==='d2_sagajr').mode,'taxi');
   assert.match(d.stops.find(s=>s.graphId==='d2h_jrkameoka').connection,/JR山阴/);assert.equal(d.stops.find(s=>s.id==='hozu-board').mode,'walk');
   assert.ok(d.budgetPending);assert.ok(d.schedulePending);assert.equal(d.calories,'待复核');
   assert.equal(d.budget.items.filter(i=>i.name.includes('船票')).length,1);
   assert.equal(d.budget.items.find(i=>i.name.includes('船票')).min,6000);
  }
 }
});

test('lazy route taxis directly from Kyoto hotel and excludes boat and sightseeing train',()=>{
 for(const p of ['A','B','B2'])for(const d of model.variants[p][2].filter(d=>d.choices.includes('究极懒人'))){
  const i=d.stops.findIndex(s=>s.id==='otagi');assert.equal(d.stops[i-1].id,'kyoto');assert.equal(d.stops[i].mode,'taxi');
  assert.ok(d.stops.every(s=>!['saga','kameoka','hozu-board','hozu-land','umahori'].includes(s.id)));
  assert.ok(d.budgetPending&&d.schedulePending);assert.equal(d.calories,'待复核');assert.equal(d.budget.items.length,1);
 }
 assert.ok(model.variants.A[2].some(d=>d.label==='高精力版本'));
 assert.ok(model.variants.A[2].some(d=>d.label==='究极懒人'));
});
