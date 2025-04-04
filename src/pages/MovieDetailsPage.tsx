import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import tmdb from "../api/tmdb";
import { MovieDetails } from "../api/tmdb";
import {
  Spinner,
  Box,
  Flex,
  Button,
  Text,
  Tooltip,
  IconButton,
  Separator,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { addMovieToWatchlist } from "../service/watchService";
import { Movie } from "../types/movie";
import { Toaster, toast } from "sonner";

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading,
    error,
    isError,
  } = useQuery<MovieDetails, Error>({
    queryKey: ["movieDetails", movieId],
    queryFn: () => {
      if (!movieId) {
        throw new Error("Movie ID is required");
      }
      return tmdb.getMovieDetails(movieId);
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { data: credits } = useQuery({
    queryKey: ["movieCredits", movieId],
    queryFn: () => tmdb.getMovieCredits(movieId!),
    enabled: !!movieId && !!movie,
  });

  const { data: videos } = useQuery({
    queryKey: ["movieVideos", movieId],
    queryFn: () => tmdb.getMovieVideos(movieId!),
    enabled: !!movieId && !!movie,
  });

  const handleAddToWatchlist = (movieToAdd: MovieDetails) => {
    const movieForWatchlist: Movie = {
      id: movieToAdd.id,
      title: movieToAdd.title,
      poster_path: movieToAdd.poster_path,
      release_date: movieToAdd.release_date,
      vote_average: movieToAdd.vote_average,
      watched: false,
      whereToWatch: "",
    };

    addMovieToWatchlist(movieForWatchlist);
    // console.log("Movie added:", movieForWatchlist);
    toast.success(`'${movieToAdd.title}' added to your watchlist!`);
  };

  if (isLoading) {
    return (
      <Box height="calc(100vh - 150px)">
        <Flex align="center" justify="center" width="full" className="h-full">
          <Spinner />
        </Flex>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box height="calc(100vh - 120px)">
        <Flex
          className="h-full"
          direction="column"
          align="center"
          justify="center"
          gap="3"
        >
          <h1 className="text-6xl font-dm font-bold text-gray-200">Error</h1>
          <h2 className="text-2xl font-dm font-medium mt-4 mb-4">
            Could not load movie details
          </h2>
          <p className="mb-8 font-dm text-gray-400">
            {error?.message || "An unknown error occurred."}
          </p>

          <Button
            onClick={() => navigate("/")}
            size="3"
            variant="solid"
            className="px-6"
          >
            <Text className="font-dm">Back to Home</Text>
          </Button>
        </Flex>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box height="calc(100vh - 120px)">
        <Flex
          className="h-full"
          direction="column"
          align="center"
          justify="center"
          gap="3"
        >
          <h1 className="text-9xl font-dm font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-dm font-medium mt-4 mb-8">
            Movie not found
          </h2>
          <p className="mb-8 font-dm text-gray-400">
            The movie you are looking for doesn't exist or has been removed.
          </p>

          <Button
            onClick={() => navigate("/")}
            size="3"
            variant="solid"
            className="px-6"
          >
            <Text className="font-dm">Back to Home</Text>
          </Button>
        </Flex>
      </Box>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const director = credits?.crew?.find(
    (person) => person.job === "Director"
  )?.name;

  const mainCast = credits?.cast?.slice(0, 8) || [];

  const trailer = videos?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <>
      <Separator size="4" />
      <div className="text-white min-h-screen ">
        <Toaster position="bottom-right" richColors theme="dark" />

        {backdropUrl && (
          <div className="relative h-80 md:h-[500px] w-full">
            <img
              src={backdropUrl}
              alt={`${movie.title} backdrop`}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-12 space-y-6">
              <h1 className="!mx-4 text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-xl tracking-wide">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-2xl md:text-3xl text-gray-300 italic font-light drop-shadow-md !mx-4">
                  "{movie.tagline}"
                </p>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-6 !mt-4 !mx-4">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-teal-700/90 px-8 py-4 text-xl font-bold tracking-wider text-white shadow-lg border border-teal-600 min-w-[120px] text-center"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Tooltip content="Add to watchlist">
              <button
                className="absolute right-4 top-4 md:right-8 md:top-8 hover:bg-teal-700 text-white p-3 md:p-4 rounded-full shadow-md transition-colors duration-200"
                onClick={() => handleAddToWatchlist(movie)}
              >
                <IconButton radius="full" variant="soft" color="teal" size="4">
                  <PlusIcon width={24} height={24} />
                </IconButton>
              </button>
            </Tooltip>
          </div>
        )}

        <div className="!mx-4 !mt-4 flex flex-col md:flex-row gap-8 md:gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 w-56 sm:w-64 md:w-72 mx-auto md:mx-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} poster`}
                className="rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.6)] w-full "
              />
            ) : (
              <div className="aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                No Poster
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-grow !mt-8 !md:mt-0">
            {/* Release, Runtime, Rating */}
            <div className="flex flex-wrap gap-8 text-md font-dm !mb-8">
              {movie.release_date && (
                <div>
                  <span className="block text-gray-400 uppercase text-sm tracking-wider mb-1">
                    Release Date
                  </span>
                  <span className="text-white">{releaseDate}</span>
                </div>
              )}

              {movie.runtime !== undefined && movie.runtime > 0 && (
                <div>
                  <span className="block text-gray-400 uppercase text-sm tracking-wider mb-1">
                    Runtime
                  </span>
                  <span className="text-white">{movie.runtime} minutes</span>
                </div>
              )}

              {movie.vote_average !== undefined && movie.vote_average > 0 && (
                <div>
                  <span className="block text-gray-400 uppercase text-sm tracking-wider mb-1">
                    Rating
                  </span>
                  <div className="flex items-center text-white">
                    ⭐ {movie.vote_average.toFixed(1)} / 10
                  </div>
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="!mb-8">
              <h2 className="text-xl font-dm font-medium mb-3 text-gray-100">
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed font-dm text-md">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Director */}
            {director && (
              <div className="!mb-8">
                <span className="text-gray-400 uppercase text-sm tracking-wider block mb-1">
                  Directed by
                </span>
                <h3 className="text-xl font-dm font-medium text-white">
                  {director}
                </h3>
              </div>
            )}

            {/* Trailer Button */}
            {trailer && (
              <div className="mt-6">
                <Button
                  size="3"
                  variant="solid"
                  color="teal"
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${trailer.key}`,
                      "_blank",
                      "noopener noreferrer"
                    )
                  }
                  className="px-6 py-5 hover:bg-teal-700 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <Text className="font-dm">Watch Trailer</Text>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {mainCast.length > 0 && (
          <div className="!mt-16 !mx-4">
            <h2 className="text-lg sm:text-xl font-dm font-semibold !mb-4 pl-2 text-gray-100 relative inline-block hover:underline">
              # Cast Members
            </h2>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 md:gap-3">
              {mainCast.map((actor) => {
                const profileUrl = actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : null;

                return (
                  <div
                    key={actor.id}
                    className="border border-[#2a2c2b]  bg-rounded-md overflow-hidden bg-[#101211] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-[2/3] bg-gray-700 relative">
                      {profileUrl ? (
                        <img
                          src={profileUrl}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-center text-[10px] p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mb-1 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 8v-1c0-3 4-5 6-5s6 2 6 5v1H6z" />
                          </svg>
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <h3
                        className="font-dm font-medium text-white text-[16px] truncate"
                        title={actor.name}
                      >
                        {actor.name}
                      </h3>
                      <p
                        className="text-gray-400 text-[12px] truncate mt-0.5"
                        title={actor.character}
                      >
                        as {actor.character}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="h-16"></div>
      </div>
    </>
  );
};

export default MovieDetailsPage;
