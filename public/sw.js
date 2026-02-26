self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("qim-quran-v1").then((cache) => cache.addAll(["/", "/surah", "/juz", "/search"])),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open("qim-quran-v1").then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("/"));
    }),
  );
});
