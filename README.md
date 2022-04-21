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
Go to your web app. Inspect => Application => Service Worker

4. Make simple UI + API calls (to https://www.themoviedb.org/documentation/api) to list most popular movies. Use the below Movie component. I used axios (run "npm install axios")

```javascript
const Movie = ({movie}) => {
  return (
    <div style={{"padding": "2em"}}>
      <div >
          <img src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path ?? ''}`} alt={movie.name} style={{"max-width": "300px"}}/>
        <h2>{movie?.name ?? ''}</h2>
        <div >
          <p>First Aired: {movie?.first_air_date ?? ''}</p>
          <p>Average Rating: {movie?.vote_average ?? ''}</p>
        </div>
        <p>Overview: {movie?.overview ?? ''}</p>
      </div>
    </div>
  )
}
```

Your App function should look like this: 
```javascript
function App() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios.get(`https://api.themoviedb.org/3/discover/tv`, {
      params: {
        sort_by: 'popularity.desc',
        api_key: '23b2268f768ece0bfc73690051ee08da'
      }
    })
      .then( (response) => {
        setLoading(false);
        setMovies(response?.data?.results);
      })
      .catch( (error) => {
        setLoading(false);
        console.log(error);
      })
  }, [])

  return (
    <div className="flex">
      <h2 style={{"padding-left": "2em"}}>Most Popular TV Shows</h2>
    {!loading && movies?.length ? movies.map( (movie, index) =>  <Movie key={movie?.id ?? index} movie={movie}/>) : <h2>Loading...</h2>}
  </div>
  );
}
```
5. Now register a route to cache 3rd party API calls. Add the below code to service-worker.js. You can refer to (https://developers.google.com/web/tools/workbox).

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
```

6. Now register a route to cache all images. Add the below code to service-worker.js.You can refer to (https://developers.google.com/web/tools/workbox).
```javascript
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
7. Turn off your wifi and reload your site. Voila! It should still render. 

References:
1. https://blog.logrocket.com/setting-up-a-pwa-with-service-workers-and-create-react-app/
2. https://developers.google.com/web/tools/workbox
