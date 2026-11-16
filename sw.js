const prefix = 'kokki-quiz:' + self.registration.scope + ':';
const cacheName = prefix + 'v1.0.1';
const shell = ['./index.html','./style.css','./app.mjs','./quiz.mjs','./manifest.webmanifest',
  './assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/sky.svg'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    const dataPath = './data/countries.json';
    const response = await fetch(dataPath, {cache:'reload'});
    if (!response.ok) throw Error('Country data unavailable');
    const countries = await response.clone().json();
    if (countries.length !== 195) throw Error('Incomplete country list');
    await cache.addAll([...shell, ...countries.map(c => './' + c.flag)].map(path => new Request(new URL(path, self.registration.scope), {cache:'reload'})));
    await cache.put(dataPath, response);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(prefix) && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const url = new URL(event.request.url);
    const key = event.request.mode === 'navigate' && [self.registration.scope, new URL('./index.html',self.registration.scope).href].includes(url.origin+url.pathname)
      ? './index.html' : event.request;
    return await cache.match(key) || fetch(event.request);
  })());
});
