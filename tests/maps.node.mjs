import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
const context = { window: {} };
runInNewContext(await readFile(new URL('../dist/route-data.js', import.meta.url), 'utf8'), context);
const { validate, find } = context.window.TripRouteData;
const places = { hotel:['Hotel',35,135], station:['Station',35.01,135.01], temple:['Temple',35.02,135.02] };
const segment = () => ({ day:2, plan:'shared', from:'hotel', to:'temple', toStep:'d2-temple', source:'independent', sourceNote:'Independently authored fixture',
  parts:[{mode:'walk',label:'Walk to station',path:[[35,135],[35.01,135.01]]},{mode:'bus',label:'Bus',path:[[35.01,135.01],[35.02,135.02]]}] });
const previous = { id:'hotel' }, next = { id:'temple', commentId:'d2-temple' };
test('one saved leg retains separate walking and bus paths on both shared plans',()=>{
  const data=validate({version:1,segments:[segment()]},places);
  for(const plan of ['A','B']) {
    const found=find(data,2,plan,previous,next).segment;
    assert.equal(found.parts.length,2);
    assert.equal(found.parts[0].mode,'walk');assert.equal(found.parts[1].mode,'bus');
  }
});
test('a plan-specific route overrides shared data and is not reused on other days or repeated visits',()=>{
  const special={...segment(),plan:'B',sourceNote:'Plan B'};
  const data=validate({version:1,segments:[segment(),special]},places);
  assert.equal(find(data,2,'B',previous,next).segment.sourceNote,'Plan B');
  assert.equal(find(data,2,'A',previous,next).segment.sourceNote,'Independently authored fixture');
  assert.equal(find(data,3,'B',previous,next).segment,null);
  assert.equal(find(data,2,'B',previous,{...next,commentId:'d2-temple-return'}).segment,null);
  assert.equal(find(data,2,'B',{id:'station'},next).segment,null);
});
test('Google geometry is not displayed outside its recorded retention window',()=>{
  const google={...segment(),source:'google-routes',capturedAt:'2026-09-13T00:00:00Z',expiresAt:'2026-10-13T00:00:00Z'};
  const data=validate({version:1,segments:[google]},places);
  assert.ok(find(data,2,'A',previous,next,Date.parse('2026-10-12T23:59:59Z')).segment);
  for(const date of ['2026-10-13T00:00:00Z','2026-09-12T23:59:59Z'])assert.equal(find(data,2,'A',previous,next,Date.parse(date)).reason,'expired');
  assert.throws(()=>validate({version:1,segments:[{...google,expiresAt:'2026-10-14T00:00:00Z'}]},places));
});
test('rejects invalid coordinates, unknown modes, duplicate leg keys and missing attribution',()=>{
  const invalid=[{...segment(),parts:[{mode:'walk',label:'bad',path:[[135,35],[135,35]]}]},
    {...segment(),parts:[{mode:'flight',label:'bad',path:[[35,135],[35.01,135.01]]}]},
    {...segment(),sourceNote:''}, {...segment(),from:'missing'}];
  for(const s of invalid)assert.throws(()=>validate({version:1,segments:[s]},places));
  assert.throws(()=>validate({version:1,segments:[segment(),segment()]},places));
});
test('empty route data remains explicitly missing, never a claimed real route',()=>{
  const data=validate({version:1,segments:[]},places);
  assert.equal(find(data,2,'A',previous,next).reason,'missing');
});

test('Cross Keys marker and every Kyoto handoff use the residence, not the check-in cafe',async()=>{
 const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
 const source=await read('dist/data.js')+await read('dist/journey-model.js');
 const app=(await read('dist/app.js')).split('\nlet day=')[0];
 const {model,places,link}=runInNewContext(source+app+';({model:JOURNEY_MODEL,places:PLACES,link:routeLink})',{URLSearchParams});
 const residence='ChIJLSyMi7cIAWARPlYqhGaEXw4',cafe='ChIJ9bp4TbsJAWARM2iWhP2KRqA';
 assert.equal(places['cross-keys'][1],34.9937824);assert.equal(places['cross-keys'][2],135.769695);
 assert.notEqual(places['cross-keys'][2],places['kind-cafe'][2]);
 assert.equal(model.places['cross-keys'].mapUrl,'https://maps.app.goo.gl/mKWuRX7oUZYGHuEw6');
 let checked=0;
 for(const day of [2,3,4])for(const variant of model.variants.A[day])for(let i=1;i<variant.stops.length;i++){
  const from=variant.stops[i-1].id,to=variant.stops[i].id,mode=variant.stops[i].mode;
  if(![from,to].some(id=>['cross-keys','kind-cafe'].includes(id)))continue;
  const p=new URL(link(from,to,mode)).searchParams;
  for(const [key,id] of [['origin',from],['destination',to]])if(['cross-keys','kind-cafe'].includes(id)){
   assert.equal(p.get(key+'_place_id'),id==='cross-keys'?residence:cafe);
   assert.equal(p.get(key),places[id][3]);checked++;
  }
 }
 assert.ok(checked>10);
 const walk=new URL(link('kind-cafe','cross-keys','walk')).searchParams;
 assert.equal(walk.get('origin_place_id'),cafe);assert.equal(walk.get('destination_place_id'),residence);assert.equal(walk.get('travelmode'),'walking');
 assert.equal(new URL(link('cross-keys','otagi','taxi')).searchParams.get('travelmode'),'driving');
 assert.equal(new URL(link('cross-keys','inari','rail')).searchParams.get('travelmode'),'transit');
 assert.equal(link('hozu-board','hozu-land','boat'),'https://www.hozugawakudari.jp/access');
});
