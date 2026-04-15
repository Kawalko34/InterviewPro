// InterviewPro Service Worker v3 — Full Offline Support
const CACHE = 'interviewpro-v3';
const ASSETS = [
  './RecruiterPro.html',
  './manifest.json',
  './icon.svg',
  './icons/icon-44.png',
  './icons/icon-71.png',
  './icons/icon-150.png',
  './icons/icon-192.png',
  './icons/icon-310.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
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
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./RecruiterPro.html'));
    })
  );
});
