import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js');
    });
  }
}

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


function App() {

  registerServiceWorker()
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

export default App;
