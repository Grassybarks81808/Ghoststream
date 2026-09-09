/**
 * Ghoststream service worker
 * - Precaches the app shell for offline browsing & instant loads
 * - Caches thumbnails (archive.org/services/img) with a cache-first strategy
 * - NEVER caches video streams (archive.org/download) — those are huge
 */

const VERSION = "gs-v2.1.0";
const SHELL_CACHE = `${VERSION}-shell`;
const THUMB_CACHE = `${VERSION}-thumbs`;
const MAX_THUMBS = 400;

const SHELL_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

async function trimCache(name, maxEntries) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    return trimCache(name, maxEntries);
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never intercept video files — let the browser stream them directly.
  if (url.hostname.endsWith("archive.org") && url.pathname.includes("/download/")) return;

  // Thumbnails: cache-first (they're immutable per item)
  if (url.hostname === "archive.org" && url.pathname.startsWith("/services/img/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(THUMB_CACHE);
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok) {
            cache.put(req, res.clone()).then(() => trimCache(THUMB_CACHE, MAX_THUMBS));
          }
          return res;
        } catch {
          return new Response("", { status: 504 });
        }
      })()
    );
    return;
  }

  // App shell & static assets: cache-first, then network
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/icons/") ||
      /\.(js|css|woff2?|png|svg|webmanifest)$/.test(url.pathname))
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL_CACHE);
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          return hit || new Response("Offline", { status: 504 });
        }
      })()
    );
    return;
  }

  // Navigations: network-first with offline fallback to cached shell
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          return res;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          return (
            (await cache.match("/")) ||
            new Response("You're offline and the app shell isn't cached yet.", {
              status: 504,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })()
    );
  }
});
