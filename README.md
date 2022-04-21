# React Workbox Demo
Caching Demo using React and Workbox

# Steps
1. Create a new project using a custom PWA template:
```bash
npx create-react-app my-app --template cra-template-pwa
```
The template automatically adds a src/service-worker.js file to your project. This file contains a basic service worker that you can come back to later and customize to your liking.

2. Register a service worker. Go to the src/index.js file in your project and find these lines:

```javascript
serviceWorkerRegistration.unregister();
```
Change to 
```javascript
serviceWorkerRegistration.unregister();
```
3. Check your service worker is registered. Add the code below to src/service-worker.js:
```javascript
console.log('Hello from service-worker.js');
```

```javascript
//https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=23b2268f768ece0bfc73690051ee08da
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === "https://api.themoviedb.org" || url.pathname === "/3/discover/tv", // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'movie-api-response',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({maxEntries: 1}), // Will cache maximum 1 requests.
    
    ],
  })
);

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);
```


References:
1. https://blog.logrocket.com/setting-up-a-pwa-with-service-workers-and-create-react-app/
2. https://developers.google.com/web/tools/workbox
