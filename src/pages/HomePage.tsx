import React from "react";
import { useQuery } from "@tanstack/react-query";
import tmdb from "../api/tmdb";
import { useSearchStore } from "../store/searchStore";

import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { Spinner, Box, Flex } from "@radix-ui/themes";

interface SearchState {
  searchTerm: string;
}

const Homepage: React.FC = () => {
  const searchTerm = useSearchStore((state: SearchState) => state.searchTerm);

  const { data: trendingMovies, isLoading: isTrendingLoading } = useQuery<
    Movie[],
    Error
  >({
    queryKey: ["trendingMovies"],
    queryFn: tmdb.getTrendingMovies,
    staleTime: 1000 * 60 * 5,
  });

  const { data: searchResults, isLoading: isSearchLoading } = useQuery<
    Movie[],
    Error
  >({
    queryKey: ["searchMovies", searchTerm],
    queryFn: () => tmdb.searchMovies(searchTerm),
    enabled: searchTerm.trim().length > 0,
    staleTime: 1000 * 60 * 1,
  });

  const isLoading =
    searchTerm.trim().length > 0 ? isSearchLoading : isTrendingLoading;

  const displayedMovies: Movie[] | undefined =
    searchTerm.trim().length > 0 ? searchResults : trendingMovies;
  const showNoResults =
    searchTerm.trim().length > 0 && !isLoading && searchResults?.length === 0;
  const showMovies =
    !isLoading && displayedMovies && displayedMovies.length > 0;

  const title =
    searchTerm.trim().length > 0
      ? `Search Results for "${searchTerm}"`
      : "Trending Movies";

  return (
    <>
      <Box pl="5" pt="4">
        <div className="mb-6 md:mb-8 pt-4">
          <h1 className="text-1xl md:text-2xl font-light font-dm text-white">
            {title}
          </h1>
        </div>
      </Box>
      <Box className="" p={"4"}>
        {isLoading && (
          <Box height="calc(100vh - 150px)">
            <Flex
              align="center"
              justify="center"
              width="full"
              className="h-full"
            >
              <Spinner />
            </Flex>
          </Box>
        )}

        {showMovies && displayedMovies && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {displayedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {showNoResults && (
          <Box height="calc(100vh - 150px)">
            <Flex
              className="h-full"
              direction="column"
              align="center"
              justify="center"
              gap="3"
            >
              <h2 className="text-2xl font-dm font-medium mt-4 mb-8">
                No movies found matching "{searchTerm}".
              </h2>
              <p className="mb-8 font-dm text-gray-400">
                Try searching for something else.
              </p>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Homepage;
