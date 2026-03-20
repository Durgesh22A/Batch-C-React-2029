import { useState, useContext } from "react";

import { genreids } from "../genres";
import { MovieContext } from "../MovieContext";

function WatchList({ watchList }) {
  // Get the List of Genres present in the WatchList

  const [currGenre, setCurrGenre] = useState("All Genres");
  const { removeFromWatchList } = useContext(MovieContext);

  const genreList = [
    "All Genres",
    ...Array.from(
      new Set(
        watchList
          .map((movieObj) => movieObj?.genre_ids?.[0])
          .filter((id) => typeof id === "number")
          .map((id) => genreids[id])
          .filter(Boolean)
      )
    ),
  ];

  return (
    <div className="rounded-lg border border-gray-200 m-8 overflow-hidden shadow-sm">
      <div className="flex flex-wrap justify-center gap-4 m-4">
        {genreList.map((genre) => (
          <div
            onClick={() => setCurrGenre(genre)}
            key={genre}
            className="flex items-center justify-center h-[3rem] w-[9rem] bg-gray-400 rounded-xl text-white font-bold cursor-pointer hover:bg-blue-500 transition-colors shadow-sm"
          >
            {genre}
          </div>
        ))}
      </div>

      <table className="w-full text-left border-collapse bg-white text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Poster</th>
            <th className="px-6 py-4 font-medium text-gray-900">Name</th>
            <th className="px-6 py-4 font-medium text-gray-900">Ratings</th>
            <th className="px-6 py-4 font-medium text-gray-900">Popularity</th>
            <th className="px-6 py-4 font-medium text-gray-900">Genre</th>
            <th className="px-6 py-4 font-medium text-gray-900">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {watchList
            .filter((movieObj) => {
              const firstGenreId = movieObj?.genre_ids?.[0];
              const firstGenreName =
                typeof firstGenreId === "number"
                  ? genreids[firstGenreId]
                  : undefined;
              return (
                currGenre === "All Genres" ||
                (firstGenreName && currGenre === firstGenreName)
              );
            })
            .map((movieObj) => {
              const firstGenreId = movieObj?.genre_ids?.[0];
              const firstGenreName =
                typeof firstGenreId === "number"
                  ? genreids[firstGenreId]
                  : undefined;
              const posterSrc = movieObj?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`
                : undefined;

              return (
                <tr
                  key={movieObj.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {posterSrc ? (
                      <img
                        className="h-20 w-14 object-cover rounded-md shadow-sm"
                        src={posterSrc}
                        alt={`${movieObj.title} poster`}
                      />
                    ) : (
                      <div className="h-20 w-14 rounded-md bg-gray-100" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {movieObj.title}
                  </td>
                  <td className="px-6 py-4">{movieObj.vote_average}</td>
                  <td className="px-6 py-4">{movieObj.popularity}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                      {firstGenreName ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        typeof movieObj?.id === "number" &&
                        removeFromWatchList(movieObj.id)
                      }
                      className="font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

          {/* Repeat <tr> for more items */}
        </tbody>
      </table>
    </div>
  );
}

export default WatchList;
