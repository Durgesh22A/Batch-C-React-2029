import { useState } from "react";
import "./App.css";
import MoodSelector from "./components/MoodSelector";
import Movies from "./components/Movies";
import Navbar from "./components/Navbar";
import WatchList from "./components/WatchList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MovieContext } from "./MovieContext";

function App() {
  const [watchList, setWatchList] = useState(() => {
    const moviesFromLS = localStorage.getItem("movies");
    if (!moviesFromLS) return [];
    try {
      const parsed = JSON.parse(moviesFromLS);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  function addToWatchList(movieObj) {
    if (!movieObj || typeof movieObj.id !== "number") return;

    setWatchList((prev) => {
      if (prev.some((m) => m?.id === movieObj.id)) return prev;
      const next = [...prev, movieObj];
      localStorage.setItem("movies", JSON.stringify(next));
      return next;
    });
  }
  
  function removeFromWatchList(movieId) {
    if (typeof movieId !== "number") return;

    setWatchList((prev) => {
      const next = prev.filter((m) => m?.id !== movieId);
      localStorage.setItem("movies", JSON.stringify(next));
      return next;
    });
  }

  function isInWatchList(movieId) {
    return typeof movieId === "number" && watchList.some((m) => m?.id === movieId);
  }

  return (
    <>
    <MovieContext value={{ watchList, addToWatchList, removeFromWatchList, isInWatchList }}>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Movies />} />
          <Route
            path="/watchlist"
            element={<WatchList watchList={watchList} />}
          />
          <Route path="/mood" element={<MoodSelector />} />
        </Routes>
      </BrowserRouter>
      </MovieContext>
    </>
  );
}

export default App;
