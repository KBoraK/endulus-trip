const BUILD="6.2.29";
const CACHE="endulus-v6-runtime";
const CORE=["./","./index.html","./manifest.webmanifest","./icon.svg","./app-v6.js?v=6.2.29"];

self.addEventListener("install",event=>{
 event.waitUntil(
  caches.open(CACHE)
   .then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"}))))
   .then(()=>self.skipWaiting())
 );
});

self.addEventListener("activate",event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k.startsWith("endulus-")&&k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;

 const networkFresh=()=>fetch(req,{cache:"no-store"});

 // Root navigation: network first, one canonical offline fallback.
 if(req.mode==="navigate"){
  const rootPath=new URL(self.registration.scope).pathname;
  const normalizedRoot=rootPath.endsWith("/")?rootPath:rootPath+"/";
  const isRoot=url.pathname===normalizedRoot||url.pathname===normalizedRoot+"index.html";
  if(isRoot){
   event.respondWith(
    networkFresh()
     .then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy))}
      return res;
     })
     .catch(()=>caches.match("./index.html"))
   );
   return;
  }
  event.respondWith(networkFresh().catch(()=>caches.match(req)));
  return;
 }

 // Self-heal old pages that still request app-v6.js?v=<old>.
 // Always use the newest network file when online and one canonical cache key offline.
 if(url.pathname.endsWith("/app-v6.js")){
  event.respondWith(
   networkFresh()
    .then(res=>{
     if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put("./app-v6.js?v=6.2.29",copy))}
     return res;
    })
    .catch(()=>caches.match("./app-v6.js?v=6.2.29"))
  );
  return;
 }

 // Other local assets: network first, cache fallback.
 event.respondWith(
  networkFresh()
   .then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}
    return res;
   })
   .catch(()=>caches.match(req))
 );
});