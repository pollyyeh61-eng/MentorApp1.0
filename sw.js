// 這是 Service Worker 的工作說明書
const CACHE_NAME = '導師專屬平台';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' // 請確保您資料夾裡有這張圖
];

// 安裝時，把網頁內容存進手機緩存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 當學員打開 App 時，優先從手機讀取，讓速度變超快
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );

});
