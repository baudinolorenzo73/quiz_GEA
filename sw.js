const CACHE="quiz-gea-core-v2.3.8";
const CORE=["./","./index.html","./Quiz_GEA_unificato.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./db-catalog.json","./DB_Quiz_GEA_botanica.json","./DB_Quiz_GEA_geologia.json","./DB_Quiz_GEA_ecologia.json","./DB_Quiz_GEA_storia.json","./DB_Quiz_GEA_fauna.json","./DB_Quiz_GEA_marketing_comunicazione.json","./DB_Quiz_GEA_banca_completa_v5.19.json"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("quiz-gea-core-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  const isDatabase=url.pathname.endsWith("db-catalog.json")||/DB_Quiz_GEA_.*\.json$/i.test(url.pathname);
  const isPage=event.request.mode==="navigate"||url.pathname.endsWith(".html");
  if(isDatabase||isPage){event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{if(!response.ok)throw Error("HTTP "+response.status);const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));return response}).catch(async()=>await caches.match(event.request)||new Response("Risorsa non disponibile offline",{status:503})));return}
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response})));
});
