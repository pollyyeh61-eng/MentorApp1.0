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
      // 核心：監聽網路請求，這是手機版判定 PWA 的關鍵
self.addEventListener('fetch', (event) => {
  // 如果是註冊或登入的 POST 請求，直接連網
  if (event.request.method === 'POST') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 優先回傳快取，沒有快取就上網抓
      return response || fetch(event.request);
      const CACHE_NAME = 'mentor-v10'; // 每次更新務必改名，例如 v10
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// 這是讓手機版判定為 PWA 的最重要部分
self.addEventListener('fetch', (event) => {
  // 繞過 POST 註冊請求
  if (event.request.method === 'POST') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果快取有就用快取，沒有就抓網路並動態存入（確保離線可用）
      return response || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      // 離線防呆
      if (event.request.mode === 'navigate') return caches.match('./index.html');
    })
  );
});
    })
  );
});
    })
  );
});


