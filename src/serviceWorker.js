// Asigna un nombre único a la versión del service worker
const CACHE_NAME = 'my-app-cache-v1';

// Lista de archivos estáticos que se almacenarán en caché
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Agrega aquí otros archivos estáticos que deseas almacenar en caché
];

// Evento de instalación del service worker
window.self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Evento de activación del service worker
window.self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
  );
});

// Evento fetch para manejar las solicitudes de recursos
window.self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});