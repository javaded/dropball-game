const CACHE_NAME = 'dropball-v1';
const urlsToCache = [
  '/',
  '/code.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;400;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'دراپ‌بال خبری دارد!',
    icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4LlmuQZ__GLgSjHuUOn1KVF4D69LZjlg3lk60Xfi_8wdb5DJuSi4YfGiQ3vhizK0td9iL59hlwCwAORoIW5uDbngGPjGAIktTlkx7-vI8SvNlW6vcm0lz2FyapWzfXJdZUSCFVfn4ala-Feeu4uZEtQRRyq8-SIxe25iBGiiCBiKlo7IpWj_Gk0-iYgWo3K2dfsHgFlag5VVMfnRHZb9A3MEmoCkfZRzg1eWUe_zGtwHVzkpuCBWyTpq15ZV9CowsobBycaMyoEM',
    badge: 'https://fonts.gstatic.com/si/materialsymbolsoutlined/latest/trophy/vf/gw-48px.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'مشاهده',
        icon: 'https://fonts.gstatic.com/si/materialsymbolsoutlined/latest/explore/vf/gw-48px.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('دراپ‌بال', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
