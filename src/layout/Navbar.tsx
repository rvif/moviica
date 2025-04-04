import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Separator,
  Text,
  TextField,
  IconButton,
  DropdownMenu,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../store/searchStore";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (window.location.pathname !== "/" && e.target.value) {
      navigate("/");
    }
  };

  const navigateHome = () => {
    setSearchTerm("");
    navigate("/");
    setIsMenuOpen(false);
  };

  const navigateToWatchlist = () => {
    navigate("/my-watchlist");
    setIsMenuOpen(false);
  };

  return (
    <>
      <Box
        p={{ initial: "3", md: "0" }}
        pl={{ md: "6" }}
        pr={{ md: "6" }}
        className="h-auto md:h-18"
      >
        <Flex
          justify={{ initial: "between", md: "between" }}
          align={{ initial: "center", md: "center" }}
          direction={{ initial: "row", md: "row" }}
          className="h-full"
          gap={{ initial: "3", md: "0" }}
        >
          <Box>
            <Text
              className="font-dm text-3xl font-bold hover:cursor-pointer"
              onClick={navigateHome}
            >
              MOVIICA
            </Text>
          </Box>

          <Flex align="center" gap={{ initial: "3", md: "7" }}>
            <Box
              width={{ initial: "150px", xs: "200px", md: "auto" }}
              maxWidth={{ md: "300px" }}
            >
              <TextField.Root
                placeholder="Search movies..."
                size={{ initial: "2", md: "3" }}
                value={searchTerm}
                onChange={handleSearchChange}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="20" width="20" />{" "}
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Flex
              justify="center"
              gap="7"
              display={{ initial: "none", md: "flex" }}
              align="center"
            >
              <Text
                className="font-dm text-2xl hover:underline hover:cursor-pointer"
                onClick={navigateHome}
              >
                home
              </Text>
              <Text
                className="font-dm text-2xl hover:underline hover:cursor-pointer"
                onClick={navigateToWatchlist}
              >
                my watchlist
              </Text>
            </Flex>

            <Box display={{ initial: "block", md: "none" }}>
              {" "}
              <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" size="3">
                    <HamburgerMenuIcon height="24" width="24" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Item onClick={navigateHome}>
                    <Text size="3">Home</Text>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={navigateToWatchlist}>
                    <Text size="3">My Watchlist</Text>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Separator orientation="horizontal" size="4" />
    </>
  );
};

export default Navbar;
