import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { assertPublicText, publicJourney } from '../scripts/public-journey.mjs';
const read=p=>readFileSync(p,'utf8');
const model=vm.runInNewContext(read('dist/data.js')+read('dist/journey-model.js')+';JOURNEY_MODEL');
test('every deployable text file passes the privacy audit; raw documents and comments are excluded',()=>{
 function audit(path){for(const item of readdirSync(path,{withFileTypes:true})){const file=path+'/'+item.name;if(item.isDirectory())audit(file);else if(!file.endsWith('.jpg'))assertPublicText(read(file));}}
 audit('.build/assets');
 for(const path of ['comments.js','comments.css','docs','sources','booking.pdf','.dev.vars'])assert.equal(existsSync('.build/assets/'+path),false);
 assert.doesNotMatch(read('.build/assets/index.html'),/comments\.js|comments\.css|可发表评论/);
 assert.doesNotMatch(read('.build/assets/app.js'),/step-comments|renderDelivery/);
 assert.doesNotMatch(read('.build/assets/journey-model.js'),/recipientEn|addressJa|postalCode|已预订|已订|确认预订/);
});
test('public data removes booking and delivery fields but preserves names and route metadata',()=>{
 assert.equal(model.places['cross-keys'].name,'Cross Keys');
 assert.equal(model.places['yamato-minamisemba-2'].name,'Yamato 南船场2丁目营业所');
 assert.ok(model.places['cross-keys'].mapUrl.startsWith('https://maps.app.goo.gl/'));
 for(const p of Object.values(model.places)){
  assert.equal(p.delivery,undefined);
  if(p.hotel){assert.equal(p.hotel.status,'住宿地点参考');assert.doesNotMatch(p.hotel.note,/订单|付款|房费/);}
 }
 const synthetic=publicJourney({places:{p:{name:'Known place',delivery:{recipient:'Private name',phone:'private'},hotel:{name:'Hotel',area:'Area',guestName:'Private guest',confirmationNumber:'secret',note:'Private booking'}}},variants:{A:{1:[{stops:[],budget:{items:[]}}]}}});
 assert.doesNotMatch(JSON.stringify(synthetic),/Private|secret|recipient|confirmationNumber/);
});
test('public frontend never redirects anonymous readers to login',()=>{
 const code=read('web/auth.js').split('async function itineraryPage()')[1];
 assert.match(code,/if \(!identity\) return;/);
 assert.doesNotMatch(code,/location\.replace\('\/login'\)/);
 assert.match(read('dist/app.js'),/let view=new URLSearchParams/);
});
