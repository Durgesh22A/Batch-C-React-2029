import { useEffect, useState } from "react";
import Banner from "./Banner";
import MovieCard from "./MovieCard";
import axios from "axios";
import Pagination from "./Pagination";
function Movies() {
  const [movies, setMovies] = useState([]);
  const [pageNo, setPageNo] = useState(1);
 


  const decrementPage = () => setPageNo((prev) => Math.max(1, prev - 1));
  const incrementPage = () => setPageNo((prev) => prev + 1);

  useEffect(() => {
    async function getMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=3aec63790d50f3b9fc2efb4c15a8cf99&language=en-US&page=${pageNo}`
        );
        setMovies(
          Array.isArray(response.data?.results) ? response.data.results : []
        );
      } catch {
        setMovies([]);
      }
    }

    getMovies();
  }, [pageNo]);

  return (
    <div>
      <Banner />
      <div
        className="m-10 flex flex-wrap justify-evenly gap-4"
      >
        {movies.map((movie) => {
          return (
            <MovieCard
              key={movie.id}
              movieObj={movie}
              movieTitle={movie.title}
              posterUrl={movie.poster_path}
            />
          );
        })}
      </div>

      <Pagination
        decrementPage={decrementPage}
        incrementPage={incrementPage}
        pageNumber={pageNo}
      />
    </div>
  );
}

export default Movies;
