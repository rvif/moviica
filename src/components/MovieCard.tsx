import React, { useState } from "react";
import type { Movie } from "../types/movie";
import { Box } from "@radix-ui/themes";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const rating = movie.vote_average
    ? (Math.round(movie.vote_average * 10) / 10).toFixed(1)
    : null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";

    const placeholder = target.nextElementSibling as HTMLElement | null;
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="bg-black rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform transition-all duration-100 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" // Added focus styles for accessibility
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden ">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title || "Movie poster"}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            loading="lazy"
            onError={handleImageError}
            style={{ transform: isHovered ? "scale(1.02)" : "scale(1)" }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-700 text-gray-400 text-center p-4">
            No image available
          </div>
        )}

        <div
          style={{ display: "none" }}
          className="absolute inset flex items-center justify-center w-full h-full bg-gray-700 text-gray-400 text-center p-4"
        >
          Image unavailable
        </div>

        {rating && (
          <div className="w-[25px] font-dm absolute top-2 right-2 bg-black/70 text-yellow-400 font-bold rounded-sm text-sm flex justify-center">
            {rating}
          </div>
        )}
        {!rating && (
          <div className="w-[100px] h-[22px] font-dm absolute top-2 right-2 bg-black/70 text-yellow-400 font-bold rounded-sm text-sm flex justify-center">
            coming soon
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end opacity-0 transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          {movie.overview && (
            <p className="font-dm text-gray-200 text-xs line-clamp-4 !mb-2 !mx-2">
              {movie.overview}
            </p>
          )}
        </div>
      </div>

      <Box p="3" className="flex flex-col flex-grow">
        <h3
          className="text-white text-md font-light truncate"
          title={movie.title || "Untitled"}
        >
          {movie.title || "Untitled"}{" "}
          {releaseYear && <span className="font-light">({releaseYear})</span>}
        </h3>
      </Box>
    </Link>
  );
};

export default MovieCard;
