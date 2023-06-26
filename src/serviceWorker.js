window.self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-cache').then(function(cache) {
        return cache.addAll(['/', '/index.html', '/manifest.json', /* Agrega aquí otros archivos estáticos que deseas almacenar en caché */]);
        })
    );
});
  
window.self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});