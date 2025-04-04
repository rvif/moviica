import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchlist,
  removeMovieFromWatchlist,
  toggleWatchedStatus,
  getWhereToWatchLinks,
} from "../service/watchService";
import { Movie } from "../types/movie";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Button,
  SegmentedControl,
  Separator,
  Table,
  Badge,
  Tooltip,
  IconButton,
} from "@radix-ui/themes";
import {
  Component1Icon,
  ListBulletIcon,
  UploadIcon,
  Share1Icon,
  CookieIcon,
  TrashIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";

import WatchlistGridItem from "../components/WatchlistGridItem";

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
      <>
        <Separator size="4" />
        <Flex
          align="center"
          justify="center"
          className="min-h-[calc(100vh-115px)] bg-gradient-to-b from-[#101211] to-black px-4"
        >
          <Spinner size="3" />
        </Flex>
      </>
    );
  }

  if (watchlist.length === 0) {
    return (
      <>
        <Separator size="4" />
        <Box
          height="calc(100vh - 115px)"
          className="bg-gradient-to-b from-[#101211] to-black px-4"
        >
          <Flex
            className="h-full mx-auto py-16 "
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
              <CookieIcon
                width={48}
                height={48}
                className="text-teal-500 opacity-70"
              />
            </Flex>

            <Text
              size="7"
              className="font-dm !font-medium text-white text-center"
            >
              Your Watchlist is Empty
            </Text>
            <Text
              size="4"
              className="font-dm text-gray-400 text-center max-w-md"
            >
              Start adding movies to keep track of what you want to watch.
            </Text>

            <Link to="/" className="mt-6">
              <Button size="3" variant="solid" color="teal" highContrast>
                Browse Movies
              </Button>
            </Link>
          </Flex>
        </Box>
      </>
    );
  }

  return (
    <>
      <Separator size="4" />
      <div className="min-h-[calc(100vh-112px)] bg-gradient-to-b from-[#101211] to-black px-4 py-8 md:px-6 md:py-10 ">
        <div className="!p-4 w-full mx-auto">
          <Flex
            direction={{ initial: "column", sm: "row" }}
            justify="between"
            align={{ initial: "start", sm: "center" }}
            mb="6"
            gap="4"
          >
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
            <Box height="full">
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
            </Box>
          ) : (
            <Table.Root
              variant="surface"
              size="2"
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              <Table.Header>
                <Table.Row align="center">
                  <Table.ColumnHeaderCell
                    style={{ minWidth: "70px" }}
                    className="!pl-4"
                  >
                    Poster
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell style={{ minWidth: "150px" }}>
                    Title
                  </Table.ColumnHeaderCell>

                  <Table.ColumnHeaderCell
                    justify="center"
                    style={{ minWidth: "120px" }}
                    className="w-[500px]"
                  >
                    Status
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell
                    justify="center"
                    style={{ minWidth: "500px" }}
                    className="w-[500px]"
                  >
                    Watch On
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell
                    justify="end"
                    style={{ minWidth: "150px" }}
                    className="!pr-20 w-[100px]"
                  >
                    Actions
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {filteredWatchlist.map((movie) => {
                  const posterUrl = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                    : null;
                  const year = movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : null;
                  const streamingLinks = getWhereToWatchLinks(movie.title);

                  return (
                    <Table.Row key={movie.id} align="center">
                      <Table.Cell style={{ width: "70px" }}>
                        <Link
                          to={`/movie/${movie.id}`}
                          style={{
                            display: "block",
                            width: "56px",
                            height: "80px",
                            overflow: "hidden",
                            borderRadius: "var(--radius-2)",
                            background: "var(--color-surface-hover)",
                            flexShrink: 0,
                          }}
                        >
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={`${movie.title} poster`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <Flex
                              align="center"
                              justify="center"
                              style={{ width: "100%", height: "100%" }}
                            >
                              <Text size="1" color="gray">
                                No Image
                              </Text>
                            </Flex>
                          )}
                        </Link>
                      </Table.Cell>

                      <Table.RowHeaderCell>
                        <Link
                          to={`/movie/${movie.id}`}
                          style={{ color: "inherit", textDecoration: "none" }}
                          className="group/link"
                        >
                          <Text
                            weight="medium"
                            className="font-dm text-white group-hover/link:text-teal-400 transition-colors text-sm sm:text-base"
                            title={movie.title}
                          >
                            {movie.title}
                          </Text>
                          {year && (
                            <Text
                              as="p"
                              size="1"
                              className="text-gray-400 font-dm mt-0.5"
                            >
                              {year}
                            </Text>
                          )}
                        </Link>
                      </Table.RowHeaderCell>

                      <Table.Cell justify="center">
                        <Badge
                          variant="soft"
                          size="1"
                          color={movie.watched ? "green" : "yellow"}
                        >
                          {movie.watched ? "Watched" : "To watch"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell justify="center">
                        <Flex
                          gap="1"
                          wrap="wrap"
                          justify="between"
                          align="center"
                          style={{ maxWidth: "500px" }}
                          className="!px-20"
                        >
                          {streamingLinks.length > 0 ? (
                            streamingLinks.map((platform) => (
                              <Tooltip
                                key={platform.name}
                                content={`Watch on ${platform.name}`}
                              >
                                <a
                                  href={platform.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Watch on ${platform.name}`}
                                  style={{
                                    color: "var(--gray-11)",
                                    textDecoration: "none",
                                  }}
                                >
                                  <Text
                                    size="1"
                                    className="font-dm lowercase px-1 hover:underline"
                                  >
                                    {platform.name}
                                  </Text>
                                </a>
                              </Tooltip>
                            ))
                          ) : (
                            <Text size="1" color="gray">
                              N/A
                            </Text>
                          )}
                        </Flex>
                      </Table.Cell>

                      <Table.Cell justify="end">
                        <Flex
                          gap={{ initial: "1", xs: "2", sm: "3" }}
                          justify="between"
                          align="center"
                          className=" !pr-15"
                        >
                          <Tooltip
                            content={
                              movie.watched
                                ? "Mark as unwatched"
                                : "Mark as watched"
                            }
                          >
                            <IconButton
                              size="1"
                              variant="ghost"
                              color={movie.watched ? "green" : "gray"}
                              onClick={() => handleToggleWatched(movie.id)}
                            >
                              {movie.watched ? (
                                <EyeClosedIcon />
                              ) : (
                                <EyeOpenIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Remove from watchlist">
                            <IconButton
                              size="1"
                              color="red"
                              variant="ghost"
                              onClick={() => handleRemove(movie.id)}
                            >
                              <TrashIcon />
                            </IconButton>
                          </Tooltip>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          )}

          <Separator size="4" className="!mt-8" />
          {watchlist.length > 0 && (
            <Box className="!mt-4 !p-5 md:mt-12 bg-[#101211] rounded-lg !md:p-6 border border-[#2a2c2b]">
              <Text size="4" className="font-dm font-medium text-white">
                Manage Watchlist
              </Text>
              <Flex wrap="wrap" gap="3" className="!mt-4">
                <Button variant="soft" color="gray" disabled>
                  <UploadIcon width="16" height="16" />
                  Export as CSV (Soon)
                </Button>
                <Button variant="soft" color="gray" disabled>
                  <Share1Icon width="16" height="16" />
                  Share Watchlist (Soon)
                </Button>
              </Flex>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchlistPage;
