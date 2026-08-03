const CACHE_NAME = "kesadaran-siklus-v3";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/app.css",

  "./js/app.js",
  "./js/storage.js"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => cache.addAll(FILES))

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        return response || fetch(event.request);

      })

  );

});
