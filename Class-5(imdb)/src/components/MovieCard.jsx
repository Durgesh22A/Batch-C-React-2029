import React, { useState } from "react";

function MovieCard({ movieObj, movieTitle, posterUrl }) {
  const [watchList , setWatchList] = useState([])

  function addToWatchList(movieObj) {
      watchList.push(movieObj)
      console.log(watchList)
  }

  

  return (
    <div
      className="relative w-60 h-80 rounded-xl bg-cover bg-center cursor-pointer transition-transform duration-300 hover:scale-105 shadow-lg overflow-hidden"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w500${posterUrl})`,
      }}
    >
      {/* Add to Watchlist Button */}
      <div className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 bg-gray-900/60 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200">
        <span
          onClick={() => addToWatchList(movieObj)}
          className="text-xl font-bold"
        >
          +
        </span>
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
