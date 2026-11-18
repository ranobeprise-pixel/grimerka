// Гримёрка работает и без интернета. Новая версия: поменять VERSION.
const VERSION = 'grim-2';
const FILES = ['./','index.html','css/app.css?v=2','js/app.js?v=2','js/data.js','js/covers.js','img/cup.jpg','manifest.webmanifest','img/icon-192.png',
  'fonts/unbounded-cyrillic-900-normal.woff2','fonts/unbounded-cyrillic-700-normal.woff2','fonts/caveat-cyrillic-700-normal.woff2','fonts/golos-text-cyrillic-400-normal.woff2','fonts/golos-text-cyrillic-600-normal.woff2','fonts/ibm-plex-mono-cyrillic-400-normal.woff2'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return res; })));
});
