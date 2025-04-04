import { Box, Flex, Link, Separator, Text } from "@radix-ui/themes";

const Footer = () => {
  return (
    <Box width="full" height="40px">
      <Separator orientation="horizontal" size="4" />
      <Flex width="full" justify="center" align="center" className="h-full">
        <Text className="font-dm">
          Made with 💞 by{" "}
          <Link href="https://github.com/rvif/" target="_blank">
            rvif
          </Link>{" "}
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
