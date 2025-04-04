import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchlist,
  removeMovieFromWatchlist,
  toggleWatchedStatus,
} from "../service/watchService";
import { Movie } from "../types/movie";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Button,
  Heading,
  SegmentedControl,
  Separator,
} from "@radix-ui/themes";
import {
  CubeIcon,
  Component1Icon,
  ListBulletIcon,
  UploadIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

import WatchlistGridItem from "../components/WatchlistGridItem";
import WatchlistListItem from "../components/WatchlistListItem";

type WatchlistFilter = "all" | "watched" | "unwatched";
type DisplayMode = "grid" | "list";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<WatchlistFilter>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");

  useEffect(() => {
    const timer = setTimeout(() => {
      setWatchlist(getWatchlist());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredWatchlist = watchlist.filter((movie) => {
    if (activeFilter === "watched") return movie.watched;
    if (activeFilter === "unwatched") return !movie.watched;
    return true;
  });

  const handleRemove = (movieId: number) => {
    removeMovieFromWatchlist(movieId);
    setWatchlist(getWatchlist());
  };

  const handleToggleWatched = (movieId: number) => {
    toggleWatchedStatus(movieId);
    setWatchlist(getWatchlist());
  };

  if (isLoading) {
    return (
      <Flex
        align="center"
        justify="center"
        className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-gray-900 to-black"
      >
        <Spinner size="3" />
      </Flex>
    );
  }

  if (watchlist.length === 0) {
    return (
      <Box className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-gray-900 to-black px-4">
        <Flex
          className="h-full max-w-4xl mx-auto py-16"
          direction="column"
          align="center"
          justify="center"
          gap="5"
        >
          <Flex
            align="center"
            justify="center"
            className="w-28 h-28 mb-4 rounded-full bg-gradient-to-br from-teal-800/30 to-gray-800/30 border-2 border-gray-700"
          >
            <CubeIcon
              width={48}
              height={48}
              className="text-teal-500 opacity-70"
            />
          </Flex>

          <Heading
            size="7"
            className="font-dm font-bold text-white text-center"
          >
            Your Watchlist is Empty
          </Heading>
          <Text size="4" className="font-dm text-gray-400 text-center max-w-md">
            Start adding movies to keep track of what you want to watch.
          </Text>

          <Link to="/" className="mt-6">
            <Button size="3" variant="solid" color="teal" highContrast>
              Browse Movies
            </Button>
          </Link>
        </Flex>
      </Box>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-[#101211] to-black px-4 py-8 md:px-6 md:py-10 ">
      <div className="!p-4 w-full mx-auto">
        <Flex
          direction={{ initial: "column", sm: "row" }}
          justify="between"
          align={{ initial: "start", sm: "center" }}
          mb="6"
          gap="4"
        >
          {/* Title and Count */}
          <div>
            <Text size="8" className="font-light text-white font-dm mb-1">
              Your watch-list
            </Text>
            <Text size="3" className="!pl-4 text-gray-200 font-dm">
              {" "}
              {filteredWatchlist.length} movie
              {filteredWatchlist.length !== 1 ? "s" : ""}
              {activeFilter !== "all" && ` (${activeFilter})`}
            </Text>
          </div>

          <Flex gap="4" align="center" wrap="wrap">
            {" "}
            <SegmentedControl.Root
              value={activeFilter}
              onValueChange={(value) =>
                setActiveFilter(value as WatchlistFilter)
              }
              size="2"
            >
              <SegmentedControl.Item value="all">All</SegmentedControl.Item>
              <SegmentedControl.Item value="watched">
                Watched
              </SegmentedControl.Item>
              <SegmentedControl.Item value="unwatched">
                To Watch
              </SegmentedControl.Item>
            </SegmentedControl.Root>
            <SegmentedControl.Root
              value={displayMode}
              onValueChange={(value) => setDisplayMode(value as DisplayMode)}
              size="2"
            >
              <SegmentedControl.Item value="grid" aria-label="Grid View">
                <Component1Icon />
              </SegmentedControl.Item>
              <SegmentedControl.Item value="list" aria-label="List View">
                <ListBulletIcon />
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
        </Flex>

        {filteredWatchlist.length === 0 ? (
          //No Filter Results State
          <Box height="calc(100vh - 356px)">
            <Flex
              className="h-full"
              direction="column"
              align="center"
              justify="center"
              gap="3"
            >
              <h1 className="text-9xl font-dm font-bold text-gray-200">
                No Movies Found
              </h1>
              <h2 className="text-2xl font-dm font-medium mt-4 mb-8">
                Try changing your filter selection.
              </h2>
            </Flex>
          </Box>
        ) : displayMode === "grid" ? (
          // Grid View
          <div className="!py-6 !px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {filteredWatchlist.map((movie) => (
              <WatchlistGridItem
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
                onToggleWatched={handleToggleWatched}
              />
            ))}
          </div>
        ) : (
          //  List View
          <Box height="full">
            <div className="!p-2 bg-[#101211] rounded-sm overflow-hidden border border-[#2a2c2b] !my-4 font-dm text-xs uppercase text-white font-medium ">
              <Flex justify="between" align="center" className="!mt-1">
                <div className="!pl-8 !md:pl-20">Movie</div>
                <Flex justify="between" className="!gap-x-10" align="center">
                  <div className="text-center">Status</div>
                  <div className="!px-48 text-center">Watch On</div>
                  <div className="text-right !pr-16">Actions</div>
                </Flex>
              </Flex>

              {filteredWatchlist.map((movie) => (
                <WatchlistListItem
                  key={movie.id}
                  movie={movie}
                  onRemove={handleRemove}
                  onToggleWatched={handleToggleWatched}
                />
              ))}
            </div>
          </Box>
        )}

        {/*//!TODO: Export and Share Section, implem soon */}
        {/* only show if there are movies in the *entire* watchlist */}
        <Separator size="4" />
        {watchlist.length > 0 && (
          <Box className="!mt-4 !p-5 md:mt-12 bg-[#101211] rounded-lg !md:p-6 border border-[#2a2c2b]">
            <Text size="4" className="font-dm font-medium text-white">
              Manage Watchlist
            </Text>
            <Flex wrap="wrap" gap="3" className="!mt-4">
              {" "}
              <Button variant="soft" color="gray">
                {" "}
                <UploadIcon width="16" height="16" />
                Export as CSV (Soon)
              </Button>
              <Button variant="soft" color="gray">
                <Share1Icon width="16" height="16" />
                Share Watchlist (Soon)
              </Button>
            </Flex>
          </Box>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
