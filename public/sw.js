/*
 * Offline support, kept deliberately small.
 *
 * The rule that matters: documents are network-first. A recruiter opening the
 * site online always gets the current HTML, and the cache is only consulted
 * when the network fails. Stale content is the one failure mode worth designing
 * against here, so nothing serves a cached page ahead of a reachable server.
 *
 * Build assets under /assets are content-hashed, so a hit can never be stale
 * and cache-first is safe. /media filenames are stable but the files only change
 * when the source photograph does, so they revalidate in the background.
 *
 * BUILD_ID is replaced at build time, which is what retires the previous cache.
 */
const BUILD_ID = "__BUILD_ID__";
const CACHE = `portfolio-${BUILD_ID}`;

/** Enough to render any route offline. */
const SHELL = ["/", "/about", "/work", "/experience", "/education", "/contact"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      // A failed precache must not block activation; runtime caching still works.
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (!response || !response.ok || response.type === "opaque") return response;
  const copy = response.clone();
  caches.open(CACHE).then((cache) => cache.put(request, copy));
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // The contact endpoint must never be answered from a cache.
  if (url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches
        .match(request)
        .then((hit) => hit || fetch(request).then((response) => putInCache(request, response)))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => putInCache(request, response))
      .catch(() =>
        caches
          .match(request)
          .then((hit) => hit || (request.mode === "navigate" ? caches.match("/") : undefined))
      )
  );
});
