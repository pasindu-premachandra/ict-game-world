// Offline support (gate D9). School connections drop and lab PCs are slow, so
// the shell, the fonts and the grade data are cached on install and served
// from cache first. Bump CACHE when anything in PRECACHE changes.

const CACHE = 'igw-v9';

const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/fonts.css',
  'css/tokens.css',
  'css/app.css',
  'js/app.js',
  'js/dom.js',
  'js/i18n.js',
  'js/store.js',
  'js/config.js',
  'js/player.js',
  'js/leaderboard.js',
  'js/screens.js',
  'js/audio.js',
  'js/motion.js',
  'js/reward.js',
  'js/activities/order.js',
  'js/activities/match.js',
  'js/activities/pick.js',
  'js/activities/bucket.js',
  'js/activities/symmatch.js',
  'js/activities/rounds.js',
  'js/activities/tf.js',
  'js/activities/input.js',
  'js/activities/hotspot.js',
  'js/activities/trace.js',
  'js/activities/bits.js',
  'js/activities/gate.js',
  'js/activities/query.js',
  'js/adventure.js',
  'js/scratch.js',
  'js/activities/mcquiz.js',
  'js/activities/sortgame.js',
  'js/activities/memory.js',
  'data/grade-6.json',
  'data/grade-7.json',
  'data/grade-8.json',
  'data/grade-9.json',
  'data/adventure-9.json',
  'data/scratch.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'fonts/baloo-2-600-latin.woff2',
  'fonts/baloo-2-700-latin.woff2',
  'fonts/baloo-2-800-latin.woff2',
  'fonts/nunito-400-latin.woff2',
  'fonts/nunito-600-latin.woff2',
  'fonts/nunito-700-latin.woff2',
  'fonts/nunito-800-latin.woff2',
  'fonts/yaldevi-600-sinhala.woff2',
  'fonts/yaldevi-700-sinhala.woff2',
  'fonts/noto-sans-sinhala-400-sinhala.woff2',
  'fonts/noto-sans-sinhala-600-sinhala.woff2',
  'fonts/noto-sans-sinhala-700-sinhala.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll fails the whole install if one file 404s, so add them one by one
      // and let the rest through.
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => (request.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    })
  );
});
