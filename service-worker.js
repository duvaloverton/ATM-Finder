const CACHE_NAME = "atm-finder-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./atm-app.js",
  "./manifest.json",
  "./icon.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.url.includes("tile.openstreetmap.org")) {
    e.respondWith(
      caches.open("tiles").then(cache =>
        fetch(req).then(res => {
          cache.put(req, res.clone());
          return res;
        }).catch(() => cache.match(req))
      )
    );
  } else {
    e.respondWith(caches.match(req).then(res => res || fetch(req)));
  }
});
