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
