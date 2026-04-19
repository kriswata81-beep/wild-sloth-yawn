// XI.COWORK SERVICE WORKER — Offline-First PWA
// 7G Net | Makoa Brotherhood

const CACHE_NAME = 'xi-cowork-v1';
const ASSETS_TO_CACHE = [
  '/xi/',
  '/xi/index.html',
  '/xi/manifest.json'
];

// Install — cache core shell
self.addEventListener('install', (event) => {
  console.log('[XI.SW] Installing XI.Cowork service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[XI.SW] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  console.log('[XI.SW] Activating XI.Cowork service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[XI.SW] Removing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch — network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API calls: always go to network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({
          error: 'XI.Cowork is offline. Request queued for when 7G Net reconnects.'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Static assets: cache-first, fallback to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});

// Push notifications — for XI alerts
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'XI.Cowork Alert';
  const options = {
    body: data.body || 'New notification from XI',
    icon: '/xi/icons/xi-icon-192.png',
    badge: '/xi/icons/xi-icon-192.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'xi-alert',
    data: {
      url: data.url || '/xi/'
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click — open PWA
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/xi/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
