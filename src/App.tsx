import { Theme } from "@radix-ui/themes";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import WatchlistPage from "./pages/WatchlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

function App() {
  return (
    <Theme
      accentColor="teal"
      grayColor="sage"
      radius="none"
      scaling="105%"
      appearance="dark"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
            <Route path="/my-watchlist" element={<WatchlistPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <ThemePanel /> */}
    </Theme>
  );
}

export default App;
