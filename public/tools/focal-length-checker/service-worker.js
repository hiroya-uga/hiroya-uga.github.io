/// <reference lib="webworker" />

const CACHE_NAME = 'focal-length-checker-v1';
const serviceWorker = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis));

serviceWorker.addEventListener(
  'install',
  /** @param {ExtendableEvent} event */ (event) => {
    event.waitUntil(serviceWorker.skipWaiting());
  },
);

serviceWorker.addEventListener(
  'activate',
  /** @param {ExtendableEvent} event */ (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith('focal-length-checker-') && key !== CACHE_NAME)
              .map((key) => caches.delete(key)),
          ),
        )
        .then(() => serviceWorker.clients.claim()),
    );
  },
);

serviceWorker.addEventListener(
  'fetch',
  /** @param {FetchEvent} event */ (event) => {
    if (event.request.method !== 'GET' || event.request.url.startsWith('http') === false) {
      return;
    }

    // PWAで画像は表示しない
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/_next/')) {
      return;
    }
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          const cached = await cache.match(event.request);
          return cached ?? Response.error();
        }
      }),
    );
  },
);
