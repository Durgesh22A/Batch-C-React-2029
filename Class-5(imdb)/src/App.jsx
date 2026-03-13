import { useEffect, useState } from "react";
import "./App.css";
import MoodSelector from "./components/MoodSelector";
import Movies from "./components/Movies";
import Navbar from "./components/Navbar";
import WatchList from "./components/WatchList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [watchList, setWatchList] = useState([]);

  function addToWatchList(movieObj) {
    watchList.push(movieObj);
    setWatchList(watchList);
    localStorage.setItem("movies", JSON.stringify(watchList));
  }

  useEffect(() => {
    let moviesFromLS = localStorage.getItem("movies");
    if (!moviesFromLS) {
      return;
    }
    let movies = JSON.parse(moviesFromLS);
    setWatchList(movies);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <Movies watchList={watchList} addToWatchList={addToWatchList} />
            }
          />
          <Route
            path="/watchlist"
            element={<WatchList watchList={watchList} />}
          />
          <Route path="/mood" element={<MoodSelector />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
