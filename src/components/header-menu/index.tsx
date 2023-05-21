import { Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import AccountsDropdown from "../accounts-dropdown";
import { MoonIcon, SunIcon } from "../icons";
import LoginButton from "../login-button";

export default function HeaderMenu() {
  const { isLoaded, isSignedIn } = useAuth();
  // const { data, status } = useSession();
  // const { isAuthenticated, isLoading, user } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <LoginButton />;
  }

  return (
    <Flex gap={2}>
      <IconButton
        aria-label="color-mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
      />
      <AccountsDropdown />
    </Flex>
  );
}
