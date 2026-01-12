const CACHE_NAME = 'mentor-v1'; // 建議用英文名稱避免路徑編碼問題
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' 
];

// 安裝階段：存入緩存
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 強制跳過等待，讓修正立刻生效
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 激活階段：清理舊緩存 (防止註冊頁面卡舊版本)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// 抓取策略：對於註冊/登入的請求，直接連網，不讀快取
self.addEventListener('fetch', (event) => {
  // 如果請求包含註冊、登入或後端 API，則不使用快取
  if (event.request.url.includes('api') || event.request.method === 'POST') {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
