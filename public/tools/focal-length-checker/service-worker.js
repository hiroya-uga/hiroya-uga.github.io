/// <reference lib="webworker" />

const CACHE_NAME = 'focal-length-checker-v2';
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

/**
 * HTMLが参照する /_next/static 配下のファイルを、HTMLより先にキャッシュへ入れる。
 * HTMLだけ新しくなりCSS/JSが未取得のままオフラインで起動すると、スタイルが欠落するため。
 * @param {Cache} cache
 * @param {string} html
 * @param {string} origin
 */
const cacheReferencedAssets = async (cache, html, origin) => {
  const paths = new Set(html.match(/\/_next\/static\/[^"'\s\\)<>]+/g) ?? []);

  await Promise.all(
    [...paths].map(async (path) => {
      const request = new Request(new URL(path, origin));

      if (await cache.match(request)) {
        return;
      }

      const response = await fetch(request);

      if (response.ok) {
        await cache.put(request, response);
      }
    }),
  );
};

/**
 * @param {Cache} cache
 * @param {Request} request
 */
const revalidateDocument = async (cache, request) => {
  const response = await fetch(request);

  if (response.ok === false) {
    return;
  }

  const html = await response.clone().text();

  await cacheReferencedAssets(cache, html, new URL(request.url).origin);
  await cache.put(request, response);
};

serviceWorker.addEventListener(
  'fetch',
  /** @param {FetchEvent} event */ (event) => {
    const { request } = event;

    if (request.method !== 'GET' || request.url.startsWith('http') === false) {
      return;
    }

    const url = new URL(request.url);

    // PWAで画像は表示しない
    if (url.pathname.startsWith('/_next/image')) {
      return;
    }

    // RSCのプリフェッチ等はキャッシュ対象外
    if (url.searchParams.has('_rsc')) {
      return;
    }

    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);

        // ハッシュ付きの静的ファイルは内容が不変なので、キャッシュがあれば通信しない
        if (cached && url.pathname.startsWith('/_next/static/')) {
          return cached;
        }

        const isDocument = request.mode === 'navigate' || request.destination === 'document';

        if (cached) {
          // 表示はキャッシュで即座に済ませ、更新は裏で行って次回起動時に反映する
          event.waitUntil(
            (isDocument
              ? revalidateDocument(cache, request)
              : fetch(request).then((response) => (response.ok ? cache.put(request, response) : undefined))
            ).catch(() => {}),
          );
          return cached;
        }

        try {
          const response = await fetch(request);

          if (response.ok) {
            await cache.put(request, response.clone());
          }
          return response;
        } catch {
          return Response.error();
        }
      }),
    );
  },
);
