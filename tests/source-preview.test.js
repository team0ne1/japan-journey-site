import {it,expect,vi,afterEach} from 'vitest';
import {extractTitle,previewAllowed,previewTitle} from '../src/source-preview';
afterEach(()=>vi.restoreAllMocks());
it('prefers OG metadata, handles markup and falls back to title',async()=>{
 expect(await extractTitle('<title>fallback</title><meta content="京都 &amp; 茶" property="og:title">')).toBe('京都 &amp; 茶');
 expect(await extractTitle('<title>京都小店</title>')).toBe('京都小店');
 expect(await extractTitle('<meta name="twitter:title" content="视频标题">')).toBe('视频标题');
 expect(await extractTitle('<html></html>')).toBe('');
});
it('does not fetch private, unapproved, credential-bearing or deceptive URLs',async()=>{
 for(const url of ['http://127.0.0.1','https://[::1]','https://www.youtube.com.evil.test','https://user:pass@www.youtube.com','https://www.youtube.com:8443','https://example.com'])expect(previewAllowed(url)).toBe(false);
 const mock=vi.spyOn(globalThis,'fetch');expect(await previewTitle('http://localhost')).toBe('');expect(mock).not.toHaveBeenCalled();
});
it('extracts approved HTML and refuses redirect into private networks',async()=>{
 const mock=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(new Response('<meta property="og:title" content="探店">',{headers:{'Content-Type':'text/html'}}));
 expect(await previewTitle('https://www.youtube.com/watch?v=test')).toBe('探店');
 mock.mockResolvedValueOnce(new Response(null,{status:302,headers:{Location:'http://127.0.0.1/secret'}}));
 expect(await previewTitle('https://b23.tv/test')).toBe('');expect(mock).toHaveBeenCalledTimes(2);
});
it('falls back on fetch errors and non-HTML responses',async()=>{
 vi.spyOn(globalThis,'fetch').mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(new Response('{}',{headers:{'Content-Type':'application/json'}}));
 expect(await previewTitle('https://b23.tv/test')).toBe('');expect(await previewTitle('https://b23.tv/test')).toBe('');
});
