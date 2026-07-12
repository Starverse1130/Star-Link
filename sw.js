/* ============================================
   Service Worker — StarLink PWA v2
   ============================================
   Strategies:
     - Precache all static assets on install
     - Cache-first for local CSS/JS/images/fonts
     - Network-first for CDN resources (fonts, icons, libraries)
     - Stale-while-revalidate for HTML (always fresh, always fast)
     - Offline fallback via cached index.html
   ============================================ */
const CACHE = 'starlink-v2';

// ---------- PRECACHE LIST ----------
// All local assets needed for offline-first experience
const PRECACHE = [
  '/',
  '/index.html',
  /* CSS */
  '/css/splash.css',
  '/css/hero.css',
  '/css/components.css',
  '/css/responsive.css',
  '/css/animations.css',
  '/css/touch.css',
  /* JS */
  '/js/splash.js',
  '/js/theme.js',
  '/js/email.js',
  '/js/whatsapp.js',
  '/js/gsap-entrance.js',
  '/js/typed.js',
  '/js/stars.js',
  '/js/interactions.js',
  '/js/touch.js',
  '/js/pwa-install.js',
  '/js/init.js',
  /* Icons & Manifest */
  '/assets/icons/favicon.ico',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/icons/site.webmanifest',
  /* Images */
  '/assets/image/Ayush.png',
  '/assets/image/Aayush.webp',
  /* PDF */
  '/assets/pdf/Ayush_Resume.pdf'
];

// CDN origins that we cache with network-first strategy
const CDN_ORIGINS = [
  'https://cdn.jsdelivr.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

// ---------- INSTALL ----------
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.allSettled(
        PRECACHE.map(function(asset) {
          return cache.add(asset)['catch'](function() {
            // Silently skip assets that fail to precache
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names
          .filter(function(n) { return n !== CACHE; })
          .map(function(n) { return caches['delete'](n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ---------- FETCH ----------
self.addEventListener('fetch', function(event) {
  var req = event.request;
  var url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // ---------- CDN: Network-first ----------
  if (isCDNRequest(url)) {
    event.respondWith(networkFirstWithCacheFallback(req));
    return;
  }

  // Skip non-origin requests (e.g. extension scripts)
  if (url.origin !== self.location.origin) return;  // ---------- ALL LOCAL REQUESTS: Cache-first with background update ----------
      event.respondWith(cacheFirstWithBackgroundUpdate(req));
    });

// ---------- STRATEGY HELPERS ----------

// Cache-first: serve from cache instantly, update cache in background
function cacheFirstWithBackgroundUpdate(request) {
  return caches.match(request).then(function(cached) {
    // Fire-and-forget: fetch network and update cache in background
    var network = fetch(request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) { cache.put(request, clone); });
      }
      return response;
    }).catch(function() { return null; });

    if (cached) {
      network; // fire and forget
      return cached;
    }

    // Not cached — wait for network, fall back to offline page
    return network.catch(function() {
      if (request.mode === 'navigate') return caches.match('/index.html');
      return new Response('Offline', { status: 503 });
    });
  });
}

// Network-first: try network first, fall back to cache
function networkFirstWithCacheFallback(request) {
  return fetch(request).then(function(response) {
    if (response && response.status === 200) {
      var clone = response.clone();
      caches.open(CACHE).then(function(cache) { cache.put(request, clone); });
    }
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      return cached || new Response('Offline', { status: 503 });
    });
  });
}

// Check if request is for a CDN resource we cache
function isCDNRequest(url) {
  for (var i = 0; i < CDN_ORIGINS.length; i++) {
    if (url.origin === CDN_ORIGINS[i]) return true;
  }
  return false;
}
