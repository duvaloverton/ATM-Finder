self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("atm-finder").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/atm-app.js",
        "/manifest.json",
        "/icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
