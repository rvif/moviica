import { Movie } from "../types/movie";

const WATCHLIST_KEY = "user_watchlist"; //TODO: change when feature to add more watchlists is added

export const getWatchlist = (): Movie[] => {
  return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
};

export const addMovieToWatchlist = (movie: Movie) => {
  const watchlist = getWatchlist();
  if (!watchlist.find((m) => m.id === movie.id)) {
    watchlist.push({ ...movie, watched: false, whereToWatch: "" });
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
};

export const removeMovieFromWatchlist = (movieId: number) => {
  const watchlist = getWatchlist().filter((movie) => movie.id !== movieId);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const toggleWatchedStatus = (movieId: number) => {
  const watchlist = getWatchlist().map((movie) =>
    movie.id === movieId ? { ...movie, watched: !movie.watched } : movie
  );
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const getWhereToWatchLinks = (movieName: string) => {
  const sources = [
    { name: "Netflix", link: `https://www.netflix.com/search?q=${movieName}` },
    {
      name: "Prime Video",
      link: `https://www.primevideo.com/region/eu/search/ref=atv_nb_sug?ie=UTF8&phrase=${movieName}`,
    },
    {
      name: "Stremio",
      link: `https://web.strem.io/#/search?query=${movieName}`,
    },
  ];
  return sources;
};
