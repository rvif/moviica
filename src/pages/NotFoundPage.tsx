import { Box, Button, Flex, Separator, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Separator size="4" />
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
            Page not found
          </h2>
          <p className="mb-8 font-dm text-gray-400">
            The page you are looking for doesn't exist or has been moved.
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
    </>
  );
};

export default NotFoundPage;
