import { Box, Flex, Show, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import HeaderMenu from "../header-menu";

export default function Header() {
  return (
    <Flex as="nav" align="center" gap={4} px={12} py={6}>
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/Crafting_icon.png" alt="Crafting Icon" />
      </Link>
      <Show above="sm">
        <Text fontSize="2xl" casing="uppercase" letterSpacing="widest">
          RS Journey Crafter
        </Text>
      </Show>
      <Spacer />
      <Box>
        <HeaderMenu />
      </Box>
    </Flex>
  );
}
