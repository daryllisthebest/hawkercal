// Minimal service worker - just install/activate, don't intercept anything
// This allows unregistering the old broken service worker

self.addEventListener('install', (event) => {
  console.log('[SW] Installing minimal service worker...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating minimal service worker...')
  // Clear all caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map(name => caches.delete(name)))
    }).then(() => self.clients.claim())
  )
})

// No fetch handler - let all requests go directly to the network
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
