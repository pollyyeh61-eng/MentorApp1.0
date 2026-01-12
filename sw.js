// 這是 Service Worker 的工作說明書
const CACHE_NAME = 'mentor-platform-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' 
];

// 安裝時，把網頁內容存進手機緩存
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 強制讓新版 sw 立即生效
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 激活時清理舊快取，確保註冊程式碼是最新的
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// 核心修改：當學員打開 App 時，處理請求
self.addEventListener('fetch', (event) => {
  // 關鍵：如果是註冊/登入的 POST 請求，絕對不要讀取快取，直接連網
  if (event.request.method === 'POST') {
    return; // 直接連網處理註冊與登入
  }

  // 其他靜態資源優先從手機讀取
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
