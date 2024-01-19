const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// Cache pages with CacheFirst strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

// Warm the cache for specified URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Register route for navigation requests
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Cache assets with StaleWhileRevalidate strategy
// registerRoute(
//   ({ request }) => request.destination === 'style' || request.destination === 'script',
//   new StaleWhileRevalidate({
//     cacheName: 'assets-cache',
//   })
// );

// Cache images with CacheFirst strategy
registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Implement asset caching for other types as needed
// Example: fonts, videos, etc.
// registerRoute(({ request }) => request.destination === 'font', new CacheFirst({ /* ... */ }));

// Offline fallback
offlineFallback();