const CACHE='globalhr-shell-20261111-v2';
const ROOT=new URL('./',self.location.href);
const SHELL=['index.html','platform.html','home.js','pwa.js','manifest.webmanifest','assets/cohr-logo.jpg','assets/pwa/icon-192.png','assets/pwa/icon-512.png','assets/pwa/icon-180.png','assets/pwa/icon-maskable-512.png'];
const ALLOWED=new Set(SHELL.map(p=>new URL(p,ROOT).pathname));
ALLOWED.add(ROOT.pathname);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(p=>new URL(p,ROOT).href)))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('globalhr-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data&&event.data.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 // Never persist API traffic, signed media, candidate data or other sites on this GitHub origin.
 if(req.method!=='GET'||url.origin!==ROOT.origin||!ALLOWED.has(url.pathname))return;
 if(req.headers.has('Authorization'))return;
 if(url.search&&url.pathname!==new URL('pwa.js',ROOT).pathname&&url.pathname!==new URL('index.html',ROOT).pathname&&url.pathname!==ROOT.pathname)return;
 const key=url.pathname===ROOT.pathname?new URL('index.html',ROOT).href:new URL(url.pathname,ROOT.origin).href;
 event.respondWith(fetch(req,{cache:'no-cache'}).then(async response=>{
  if(response.ok&&response.type!=='opaque'){try{const cache=await caches.open(CACHE);await cache.put(key,response.clone());}catch(e){/* Cache storage may be full; keep the successful network response. */}}
  return response;
 }).catch(async()=>{
  const cached=await caches.match(key,{cacheName:CACHE});
  if(cached)return cached;
  return new Response('当前离线，请联网后重试。',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 }));
});
