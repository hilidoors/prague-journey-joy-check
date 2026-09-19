const CACHE='prague-joy-v6';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','menus-data.js','audio/menu/aubergine-1.mp3','audio/menu/aubergine-2.mp3','audio/menu/aubergine-3.mp3','audio/menu/aubergine-4.mp3','audio/menu/aubergine-5.mp3','audio/menu/havelska-1.mp3','audio/menu/havelska-2.mp3','audio/menu/havelska-3.mp3','audio/menu/havelska-4.mp3','audio/menu/havelska-5.mp3','audio/menu/havelska-6.mp3','audio/menu/kantyna-1.mp3','audio/menu/kantyna-2.mp3','audio/menu/kantyna-3.mp3','audio/menu/kantyna-4.mp3','audio/menu/kantyna-5.mp3','audio/menu/kantyna-6.mp3','audio/menu/lokal-1.mp3','audio/menu/lokal-2.mp3','audio/menu/lokal-3.mp3','audio/menu/lokal-4.mp3','audio/menu/lokal-5.mp3','audio/menu/lokal-6.mp3','audio/menu/strahov-1.mp3','audio/menu/strahov-2.mp3','audio/menu/strahov-3.mp3','audio/menu/strahov-4.mp3','audio/menu/strahov-5.mp3','audio/menu/uparlamentu-1.mp3','audio/menu/uparlamentu-2.mp3','audio/menu/uparlamentu-3.mp3','audio/menu/uparlamentu-4.mp3','audio/menu/uparlamentu-5.mp3','audio/menu/uparlamentu-6.mp3','audio/menu/upinkasu-1.mp3','audio/menu/upinkasu-2.mp3','audio/menu/upinkasu-3.mp3','audio/menu/upinkasu-4.mp3','audio/menu/upinkasu-5.mp3','audio/menu/waiter-cs.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await Promise.all(SHELL.map(async url=>{const res=await fetch(new Request(url,{cache:'reload'}));if(!res.ok)throw new Error('Failed to cache '+url);await c.put(url,res)}))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isRateApi=url.hostname==='open.er-api.com'||(url.hostname==='cdn.jsdelivr.net'&&url.pathname.includes('/currency-api@'));
  if(isRateApi)return;
  const isIndex=url.origin===self.location.origin&&(e.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html'));
  if(isIndex){
    e.respondWith(fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('index.html',copy))}return res}).catch(()=>caches.match('index.html').then(hit=>hit||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return res})));
});
