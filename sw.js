const CACHE='pintorapp-pro-v1';
const ARCHIVOS=[
  './',
  './index.html',
  './icono-pintorapp.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(response=>{
        if(!response||response.status!==200||response.type==='opaque') return response;
        const clone=response.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
        return response;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});
