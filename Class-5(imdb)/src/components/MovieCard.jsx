import { useContext } from "react";
import { MovieContext } from "../MovieContext";

function MovieCard({ movieObj, movieTitle, posterUrl }) {
  const { addToWatchList, isInWatchList } = useContext(MovieContext);
  const alreadyAdded = isInWatchList(movieObj?.id);
  const posterStyle = posterUrl
    ? {
        backgroundImage: `url(https://image.tmdb.org/t/p/w500${posterUrl})`,
      }
    : undefined;

  return (
    <div
      className="relative w-60 h-80 rounded-xl bg-cover bg-center cursor-pointer transition-transform duration-300 hover:scale-105 shadow-lg overflow-hidden"
      style={posterStyle}
    >
      {/* Add to Watchlist Button */}
      <div className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 bg-gray-900/60 rounded-lg text-white transition-colors duration-200">
        <button
          type="button"
          onClick={() => addToWatchList(movieObj)}
          disabled={alreadyAdded}
          aria-label={alreadyAdded ? "Added to watchlist" : "Add to watchlist"}
          className={`text-xl font-bold ${
            alreadyAdded
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
        >
          +
        </button>
      </div>

      {/* Bottom Title Overlay */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
        <p className="text-white text-sm font-semibold truncate">
          {movieTitle}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
