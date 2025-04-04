import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Flex, Separator, Text, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../store/searchStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearchStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Navigate to homepage if user is not already there
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <Box className="h-18 ">
      <Flex justify="between" align="center" className="h-full">
        <Box pl="6">
          <Text
            className="font-dm text-3xl font-bold hover:cursor-pointer"
            onClick={() => {
              setSearchTerm("");
              navigate("/");
            }}
          >
            MOVIICA
          </Text>
        </Box>
        <Box pr="6">
          <Flex justify="center" gap="7">
            {/* Search  */}
            <Box maxWidth="300px">
              <TextField.Root
                placeholder="Search movies..."
                size="3"
                value={searchTerm}
                onChange={handleSearchChange}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="24" width="24" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Text
              className="font-dm text-2xl hover:underline hover:cursor-pointer"
              onClick={() => {
                setSearchTerm("");
                navigate("/");
              }}
            >
              home
            </Text>
            <Text
              className="font-dm text-2xl hover:underline hover:cursor-pointer"
              onClick={() => navigate("/my-watchlist")}
            >
              my watchlist
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Separator orientation="horizontal" size="4" />
    </Box>
  );
};

export default Navbar;
