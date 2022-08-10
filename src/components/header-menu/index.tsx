import { Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import AccountsDropdown from "../accounts-dropdown";
import { MoonIcon, SunIcon } from "../icons";
import LoginButton from "../login-button";

export default function HeaderMenu() {
	const { data, status } = useSession();
	// const { isAuthenticated, isLoading, user } = useAuth0();
	const { colorMode, toggleColorMode } = useColorMode();

	if (status == "unauthenticated") {
		return <LoginButton />;
	}

	if (status == "loading") {
		return null;
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
