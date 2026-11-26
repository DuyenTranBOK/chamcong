// Lưu sẵn các file của app để mở nhanh. Luôn lấy bản mới nhất khi có mạng (cập nhật app chỉ cần sửa file trên GitHub).
const CACHE = 'chamcong-v2';
const FILES = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // không đụng tới máy chủ chấm công
  e.respondWith(
    // cache: 'no-cache' → luôn hỏi lại GitHub xem có bản mới chưa (không dùng bản tạm 10 phút của trình duyệt)
    fetch(u.href, { cache: 'no-cache' }).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
