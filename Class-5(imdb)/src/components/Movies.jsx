import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import MovieCard from "./MovieCard";
import axios from "axios";
import Pagination from "./Pagination";
function Movies() {
  const [movies, setMovies] = useState([]);
  const [pageNo , setPageNo] = useState(1)


  function decrementPage(){
    setPageNo(pageNo-1)
  }

  function incrementPage(){
    setPageNo(pageNo+1)
  }

  // Now get the movies data
  useEffect(() => {
    async function getMOvies() {
      let response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=3aec63790d50f3b9fc2efb4c15a8cf99&language=en-US&page=${pageNo}`
      );
      console.log(response.data.results);
      setMovies(response.data.results);
    }

    getMOvies();
  }, [pageNo]);

  return (
    <div>
      <Banner />
      <div
        className="m-10 flex gap-4 flex-wrap justify-evenly 
      "
      >
        {movies.map((movie) => {
          return (
            <MovieCard movieObj={movie} movieTitle={movie.title} posterUrl={movie.poster_path} />
          );
        })}
      </div>

      <Pagination decrementPage={decrementPage} incrementPage={incrementPage} pageNumber={pageNo}/>
    </div>
  );
}

export default Movies;
