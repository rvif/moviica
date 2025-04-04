import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/movie";
import { getWhereToWatchLinks } from "../service/watchService";
import { Box, Flex, Text, Tooltip, IconButton } from "@radix-ui/themes";
import { TrashIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface WatchlistGridItemProps {
  movie: Movie;
  onRemove: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
}

const WatchlistGridItem: React.FC<WatchlistGridItemProps> = ({
  movie,
  onRemove,
  onToggleWatched,
}) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const streamingLinks = getWhereToWatchLinks(movie.title);

  return (
    <Box className="group relative bg-[#101211] rounded-lg overflow-hidden shadow-md flex flex-col transform transition-all duration-200 ease-in-out hover:scale-[1.03]  hover:shadow-xl">
      {/* Poster Section */}
      <div className="relative aspect-[2/3] border border-[#2a2c2b]">
        <Link to={`/movie/${movie.id}`}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
              loading="lazy"
            />
          ) : (
            <Flex
              align="center"
              justify="center"
              className="w-full h-full bg-gray-700 text-gray-400 text-xs font-dm"
            >
              No Image
            </Flex>
          )}
        </Link>

        {/*Status  */}
        <div
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-sm text-xs font-semibold shadow-sm font-dm
            ${
              movie.watched
                ? "bg-green-600 text-white !p-1"
                : "bg-yellow-500 text-black !p-1"
            }`}
        >
          {movie.watched ? "WATCHED" : "TO WATCH"}
        </div>

        {/* Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
          {/* Action Buttons */}
          <Flex justify="between">
            {/* Streaming Links */}
            {streamingLinks.length > 0 && (
              <Flex gap="1" wrap="wrap" mb="2">
                {streamingLinks.map((platform) => (
                  <Tooltip
                    key={platform.name}
                    content={`Watch on ${platform.name}`}
                  >
                    <a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!pl-3 flex items-center justify-center h-6  rounded-xs text-white text-xs font-dm font-light hover:underline shadow-sm transition-colors"
                    >
                      {platform.name}
                    </a>
                  </Tooltip>
                ))}
              </Flex>
            )}

            <Flex justify="end" align="center" mb="2" gap="4" className="!pr-2">
              <Tooltip
                content={
                  movie.watched ? "Mark as unwatched" : "Mark as watched"
                }
              >
                <IconButton
                  size="1"
                  variant="ghost"
                  color={movie.watched ? "green" : "gray"}
                  highContrast={!movie.watched}
                  onClick={() => onToggleWatched(movie.id)}
                  className="shadow-md hover:scale-110 transition-transform  !rounded-xl"
                >
                  {movie.watched ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip content="Remove from watchlist">
                <IconButton
                  size="1"
                  variant="ghost"
                  color="red"
                  onClick={() => onRemove(movie.id)}
                  className="shadow-md hover:scale-110 transition-transform  !rounded-xl"
                >
                  <TrashIcon />
                </IconButton>
              </Tooltip>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* Movie Info Section */}
      <Box p="3" className="flex-grow">
        {" "}
        <Link to={`/movie/${movie.id}`} className="group/link">
          <Text
            size="2"
            weight="medium"
            className="font-dm text-white truncate group-hover/link:text-teal-400 transition-colors"
            title={movie.title}
          >
            {movie.title}
          </Text>
        </Link>
        {year && (
          <Text as="p" size="1" className="text-gray-400 font-dm mt-1">
            {year}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default WatchlistGridItem;
