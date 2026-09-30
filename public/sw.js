// AgriConnect AI - Precision Farming Offline Service Worker
const CACHE_NAME = "agriconnect-cache-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html"
];

// Install Event - Pre-cache essential app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching Core App Shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches and claim control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Purging stale cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets when offline, intercept API requests for caching
self.addEventListener("fetch", (event) => {
  const reqUrl = new URL(event.request.url);

  // Skip POST and non-http/https requests (e.g. chrome-extension or websockets)
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Never cache or intercept API traffic: it is per-user, authenticated data.
  // Caching it let a logged-out (or different) user see the previous user's
  // responses on a shared phone, and stale AI answers looked like fresh ones.
  if (reqUrl.pathname.startsWith("/api/")) {
    return;
  }

  // Bypass service worker for development hot-reloading and internal tooling to avoid local fetch issues
  if (
    reqUrl.pathname.includes("/@vite/") ||
    reqUrl.pathname.includes("/node_modules/") ||
    reqUrl.pathname.includes("__vite_ping") ||
    reqUrl.pathname.includes("hot-update")
  ) {
    return;
  }

  // Network-First with Cache-Fallback Strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If request is valid, clone it and save to cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        console.log("[Service Worker] Network offline. Serving cached asset for:", event.request.url);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If a JSON request fails, return a simulated offline response
          if (event.request.headers.get("Accept")?.includes("application/json") || event.request.url.includes("/api/")) {
            return new Response(
              JSON.stringify({
                offline: true,
                error: "Network unavailable. Operating in local cached sandbox mode.",
                cachedAt: new Date().toISOString()
              }),
              {
                headers: { "Content-Type": "application/json" },
                status: 503
              }
            );
          }

          // Fallback basic template if everything fails
          return new Response(
            "<html><body><h1>AgriConnect Operating Offline</h1><p>Telemetry data is being served from local IndexedDB cache. You can continue scanning crops and your diagnoses will be queued for automatic sync.</p></body></html>",
            {
              headers: { "Content-Type": "text/html" }
            }
          );
        });
      })
  );
});
