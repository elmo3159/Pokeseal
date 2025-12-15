// ポケシル Service Worker
const CACHE_NAME = 'pokeseal-v1';

// インストール時
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

// アクティベート時
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(clients.claim());
});

// フェッチ時（ネットワークファースト戦略）
self.addEventListener('fetch', (event) => {
  // 開発時はネットワークを優先
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
