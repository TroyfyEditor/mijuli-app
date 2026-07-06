const CACHE = 'mijuli-v2';
const ASSETS = [
  '/mijuli-app/',
  '/mijuli-app/index.html',
  '/mijuli-app/manifest.json',
  '/mijuli-app/icon-192.png',
  '/mijuli-app/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network first for API calls, cache first for assets
  if(e.request.url.includes('api.openai.com') || 
     e.request.url.includes('firestore') ||
     e.request.url.includes('firebase') ||
     e.request.url.includes('n8n.cloud')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
