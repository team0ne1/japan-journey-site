/* Curated local photos plus live Google Places photos for missing Day2 locations. */
'use strict';
(() => {
 const photos = {...PLACE_IMAGES};
 const googlePlaces = {"osakast": "ChIJC6fjlY3mAGARSshZ6CLIrhs", "nonomiya-bus": "ChIJXxvnVv-pAWARqv_nHlpOUGg", "otagi-bus": "ChIJ4V1ugjmqAWARKD-j8T4xUYI", "sagaarashiyama": "ChIJeVL-m_6pAWAR2fDtIzRBWRI", "jr-kameoka": "ChIJGxCciMJUAGARMTym5nPrY0c", "hozu-board": "ChIJ5e_0rsRUAGARV6H3azfT3DM", "hozu-land": "ChIJr-wW1QCqAWARnsMRi2g2ung"};
 const pendingGoogle = new Set();
 async function loadGooglePhoto(id,name){
  if(!googlePlaces[id]||pendingGoogle.has(id)||photos[id])return;
  pendingGoogle.add(id);
  try{
   for(let attempt=0;attempt<40&&!window.google?.maps?.importLibrary;attempt++)await new Promise(resolve=>setTimeout(resolve,500));
   if(!window.google?.maps?.importLibrary)throw Error('Maps unavailable');
   const {Place}=await google.maps.importLibrary('places');
   const place=new Place({id:googlePlaces[id]});await place.fetchFields({fields:['photos']});
   const photo=place.photos?.[0];if(!photo)throw Error('No photo');
   photos[id]={src:photo.getURI({maxWidth:1000}),thumbnail:photo.getURI({maxWidth:420}),alt:name+' · Google 地点照片',author:(photo.authorAttributions||[]).map(a=>a.displayName).join('、')||'Google Maps',attributions:photo.authorAttributions||[],license:'Google Maps',source:photo.googleMapsURI||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name)+'&query_place_id='+googlePlaces[id],width:photo.widthPx||1000,height:photo.heightPx||700,note:'由 Google Places 实时提供，拍摄时间与旅行日期可能不同。'};
   document.querySelectorAll('[data-photo-place="'+id+'"]').forEach(host=>{host.outerHTML=window.JourneyPhotos.render(id,name);});
  }catch{document.querySelectorAll('[data-photo-place="'+id+'"]').forEach(host=>{host.innerHTML=fallback(id,name);});}
 }
 const failed = new Set();
 const searchUrl = (id,name) => 'https://www.google.com/search?tbm=isch&q='+encodeURIComponent((PLACES[id]?.[3]||name)+' Japan');
 const fallback = (id,name) => `<span class="photo-caption">景观参考</span><p>照片暂未提供</p>${external(searchUrl(id,name),'搜索景点图片')}`;
 const credit = photo => photo.attributions ? 'Google Maps · '+photo.attributions.map(a=>a.uri?external(a.uri,a.displayName):escapeHtml(a.displayName)).join(' · ')+' · '+external(photo.source,'查看照片来源') : `${escapeHtml(photo.author)} · ${photo.licenseUrl?external(photo.licenseUrl,photo.license):escapeHtml(photo.license)} · ${external(photo.source,'来源')}`;
 let dialog;
 function showPhoto(id,name) {
  const photo=photos[id];if(!photo||failed.has(id))return;
  if(!dialog){
   dialog=document.createElement('dialog');dialog.className='photo-dialog';dialog.setAttribute('aria-labelledby','photo-dialog-title');
   document.body.append(dialog);
   dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
   dialog.addEventListener('close',()=>{dialog.textContent='';});
  }
  dialog.innerHTML=`<header><h2 id="photo-dialog-title">${escapeHtml(name)}</h2><button type="button" aria-label="关闭景点照片" autofocus>关闭 ✕</button></header><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}"><p class="photo-credit">${credit(photo)}</p><p class="photo-note">${escapeHtml(photo.caption||photo.alt)} ${escapeHtml(photo.note)} 景观参考，季节与天气可能不同。</p>`;
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.showModal();
 }
 document.addEventListener('click',event=>{const button=event.target.closest('[data-open-photo]');if(button)showPhoto(button.dataset.openPhoto,button.dataset.photoName);});
 document.addEventListener('error',event=>{
  const img=event.target;if(!(img instanceof HTMLImageElement)||!img.dataset.placePhoto)return;
  const id=img.dataset.placePhoto,name=img.dataset.photoName;failed.add(id);
  const host=img.closest('.place-photo');if(host){host.classList.remove('has-photo');host.innerHTML=fallback(id,name);}
 },true);
 window.JourneyPhotos=Object.freeze({render(id,name){
  const photo=photos[id];
  if(!photo&&googlePlaces[id])setTimeout(()=>loadGooglePhoto(id,name),0);
  return `<aside class="place-photo${photo&&!failed.has(id)?' has-photo':''}" data-photo-place="${escapeHtml(id)}" aria-label="${escapeHtml(name)}的照片">${photo&&!failed.has(id)?`<button type="button" data-open-photo="${escapeHtml(id)}" data-photo-name="${escapeHtml(name)}" aria-label="放大${escapeHtml(name)}照片"><img src="${escapeHtml(photo.thumbnail||photo.src)}" alt="${escapeHtml(photo.alt)}" data-place-photo="${escapeHtml(id)}" data-photo-name="${escapeHtml(name)}" loading="lazy" decoding="async" width="${photo.thumbnailWidth||photo.width}" height="${photo.thumbnailHeight||photo.height}"></button>${photo.caption?`<p class="photo-description">${escapeHtml(photo.caption)}</p>`:''}<p class="photo-credit">${credit(photo)}</p>`:fallback(id,name)}</aside>`;
 }});
})();
