const CACHE = "cf-v1";
const ASSETS = [
  "./",
  "./guia-motor.js",
  "./motor.js",
  "./libro.js",
  "./informe.js",
  "./docx.js",
  "./img/carton.webp",
  "./img/caucho.webp",
  "./img/completo.webp",
  "./img/extintores.webp",
  "./img/film.webp",
  "./img/interior_foto.webp",
  "./img/liquidos.webp",
  "./img/liquidos_foto.webp",
  "./img/madera.webp",
  "./img/papel.webp",
  "./img/salida.webp",
  "./img/solidos.webp",
  "./img/superficie.webp",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
