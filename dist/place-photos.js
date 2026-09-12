/* Curated, locally hosted photos only. No search scraping or paid API requests. */
'use strict';
(() => {
 const photos = PLACE_IMAGES;
 const failed = new Set();
 const searchUrl = (id,name) => 'https://www.google.com/search?tbm=isch&q='+encodeURIComponent((PLACES[id]?.[3]||name)+' Japan');
 const fallback = (id,name) => `<span class="photo-caption">景观参考</span><p>照片暂未提供</p>${external(searchUrl(id,name),'搜索景点图片')}`;
 const credit = photo => `${escapeHtml(photo.author)} · ${photo.licenseUrl?external(photo.licenseUrl,photo.license):escapeHtml(photo.license)} · ${external(photo.source,'来源')}`;
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
  return `<aside class="place-photo${photo&&!failed.has(id)?' has-photo':''}" data-photo-place="${escapeHtml(id)}" aria-label="${escapeHtml(name)}的照片">${photo&&!failed.has(id)?`<button type="button" data-open-photo="${escapeHtml(id)}" data-photo-name="${escapeHtml(name)}" aria-label="放大${escapeHtml(name)}照片"><img src="${escapeHtml(photo.thumbnail||photo.src)}" alt="${escapeHtml(photo.alt)}" data-place-photo="${escapeHtml(id)}" data-photo-name="${escapeHtml(name)}" loading="lazy" decoding="async" width="${photo.thumbnailWidth||photo.width}" height="${photo.thumbnailHeight||photo.height}"></button>${photo.caption?`<p class="photo-description">${escapeHtml(photo.caption)}</p>`:''}<p class="photo-credit">${credit(photo)}</p>`:fallback(id,name)}</aside>`;
 }});
})();
