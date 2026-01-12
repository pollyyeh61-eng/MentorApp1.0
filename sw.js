const CACHE_NAME = 'mentor-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// 安裝時存入快取
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 激活時清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// 處理請求：避開註冊與登入請求
self.addEventListener('fetch', (event) => {
  // 關鍵：如果是 POST 請求（註冊、登入），直接連網，不要讀快取
  if (event.request.method === 'POST') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
