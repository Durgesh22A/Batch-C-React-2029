import React from "react";

export const MovieContext = React.createContext({
  watchList: [],
  addToWatchList: () => {},
  removeFromWatchList: () => {},
  isInWatchList: () => false,
});