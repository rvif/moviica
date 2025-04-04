import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/movie";
import { getWhereToWatchLinks } from "../service/watchService";
import { Flex, Text, Tooltip, IconButton, Badge, Box } from "@radix-ui/themes";
import { TrashIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface WatchlistListItemProps {
  movie: Movie;
  onRemove: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
}

const WatchlistListItem: React.FC<WatchlistListItemProps> = ({
  movie,
  onRemove,
  onToggleWatched,
}) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
    : null;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const streamingLinks = getWhereToWatchLinks(movie.title);

  return (
    <Box className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] gap-x-4  md:p-4 border-t border-[#2a2c2b] !mt-3 !p-3  items-center transition-colors duration-150">
      {/* Poster */}
      <Flex className="h-full" justify="between">
        <Flex className=" w-[60%]" gap="5" align="center">
          <Link
            to={`/movie/${movie.id}`}
            className="block w-12 h-18 sm:w-14 sm:h-20 md:w-16 md:h-24 overflow-hidden rounded  bg-[#101211]  flex-shrink-0"
          >
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} poster`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <Flex
                align="center"
                justify="center"
                className="w-full h-full text-gray-200 text-center text-xs p-1 font-dm"
              >
                No Image
              </Flex>
            )}
          </Link>

          <Link to={`/movie/${movie.id}`} className="group/link">
            <Text
              weight="medium"
              className="font-dm text-white truncate group-hover/link:text-teal-400 transition-colors text-sm sm:text-base"
              title={movie.title}
            >
              {movie.title}
              {year && (
                <Text as="p" size="1" className="text-gray-400 font-dm mt-0.5">
                  {year}
                </Text>
              )}
            </Text>
          </Link>
        </Flex>

        <Flex className="flex-1" gap="5" align="center" justify="between">
          <div className="!ml-13 hidden sm:flex justify-center">
            {" "}
            <Badge
              variant="soft"
              size="1"
              color={movie.watched ? "green" : "yellow"}
            >
              {movie.watched ? "Watched" : "To watch"}
            </Badge>
          </div>

          {/* Watch Links */}
          <div className="hidden sm:flex justify-center flex-wrap gap-1.5">
            {" "}
            {streamingLinks.length > 0 ? (
              streamingLinks.map((platform) => (
                <Flex
                  gap="6"
                  key={platform.name}
                  justify="center"
                  className="!mx-2 "
                >
                  <Tooltip
                    key={platform.name}
                    content={`Watch on ${platform.name}`}
                  >
                    <a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center h-[30px] w-[80px] justify-center text-white "
                      aria-label={`Watch on ${platform.name}`}
                    >
                      <Text className="font-dm hover:underline lowercase">
                        {platform.name}
                      </Text>
                    </a>
                  </Tooltip>
                </Flex>
              ))
            ) : (
              <Text size="1" color="gray">
                N/A
              </Text>
            )}
          </div>

          {/* Actions */}
          <Flex align="center" justify="end" gap="4" className="!mr-10">
            {" "}
            <Tooltip
              content={movie.watched ? "Mark as unwatched" : "Mark as watched"}
            >
              <IconButton
                size="1"
                variant="ghost"
                color={movie.watched ? "green" : "gray"}
                onClick={() => onToggleWatched(movie.id)}
              >
                {movie.watched ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip content="Remove from watchlist">
              <IconButton
                size="1"
                color="red"
                variant="ghost"
                onClick={() => onRemove(movie.id)}
              >
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default WatchlistListItem;
