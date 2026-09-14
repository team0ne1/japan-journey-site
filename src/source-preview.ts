// Only fetch known public recommendation platforms; arbitrary URLs remain saveable.
const HOSTS = new Set(['www.youtube.com','youtube.com','youtu.be','m.youtube.com','www.bilibili.com','bilibili.com','m.bilibili.com','b23.tv','www.xiaohongshu.com','xiaohongshu.com','xhslink.com','www.xhslink.com','www.dianping.com','dianping.com','m.dianping.com']);
export function previewAllowed(raw: string): boolean {
  try { const u = new URL(raw); return u.protocol === 'https:' && !u.username && !u.password && !u.port && HOSTS.has(u.hostname); } catch { return false; }
}
export async function extractTitle(html: string): Promise<string> {
  let og = '', twitter = '', title = '';
  await new HTMLRewriter().on('meta', { element(el) {
    const key = (el.getAttribute('property') || el.getAttribute('name') || '').toLowerCase();
    if(key === 'og:title' && !og) og = el.getAttribute('content') || '';
    if(key === 'twitter:title' && !twitter) twitter = el.getAttribute('content') || '';
  }}).on('title', { text(t) { title += t.text; } }).transform(new Response(html)).text();
  return (og.trim() || twitter.trim() || title.trim()).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').slice(0, 300).trim();
}
export async function previewTitle(raw: unknown): Promise<string> {
  if(typeof raw !== 'string' || raw.length > 2048 || !previewAllowed(raw)) return '';
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 5000);
  try {
    let url = raw;
    for(let hop = 0; hop < 4; hop++) {
      if(!previewAllowed(url)) return '';
      const res = await fetch(url, { redirect:'manual', signal:controller.signal, headers:{Accept:'text/html'} });
      if(res.status >= 300 && res.status < 400) {
        const next = res.headers.get('Location'); await res.body?.cancel();
        if(!next) return ''; url = new URL(next,url).href; continue;
      }
      if(!res.ok || !res.headers.get('Content-Type')?.toLowerCase().includes('text/html')) { await res.body?.cancel(); return ''; }
      const reader = res.body?.getReader(); if(!reader) return '';
      const decoder = new TextDecoder(); let html = '', size = 0;
      try { while(true) { const {done,value} = await reader.read(); if(done) break; size += value.byteLength; if(size > 262144) break; html += decoder.decode(value,{stream:true}); } }
      finally { await reader.cancel(); }
      return await extractTitle(html + decoder.decode());
    }
  } catch { /* Metadata is optional; do not prevent saving. */ }
  finally { clearTimeout(timer); }
  return '';
}
