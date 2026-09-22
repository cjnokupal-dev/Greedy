// GREEDY — service worker for PWA
const CACHE = "greedy-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/reset.css",
  "./css/variables.css",
  "./css/layout.css",
  "./css/ui.css",
  "./css/animations.css",
  "./css/game.css",
  "./js/main.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", e => {
  // network first for API, cache fallback for assets
  if (e.request.url.includes("/api/")) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
