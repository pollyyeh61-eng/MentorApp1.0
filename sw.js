// 這是 Service Worker 的工作說明書
const CACHE_NAME = 'mentor-v2'; // 建議加上版本號，更新時改為 v2
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' // 請確保圖示已改為 512x512 正方形
];

// 安裝時，把網頁靜態內容存進手機緩存
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 強制讓新的 Service Worker 立即生效
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在安裝快取資源...');
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

// 核心修改：處理學員打開 App 的抓取請求
self.addEventListener('fetch', (event) => {
  // 關鍵：如果是註冊/登入的 POST 請求，絕對不要讀取快取，直接連網
  if (event.request.method === 'POST') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 其他靜態資源則優先從手機讀取
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果快取有就用快取，沒有就上網抓
      return response || fetch(event.request).then((fetchRes) => {
        // 可選：將新抓到的內容存入快取 (動態快取)
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      // 離線且無快取時的防呆處理
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
