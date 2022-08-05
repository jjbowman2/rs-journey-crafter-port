import { signOut } from "next-auth/react";
import { MenuItem } from "@chakra-ui/react";

export default function LogoutButton() {
	return (
		<MenuItem onClick={() => signOut()} textColor="red.600">
			Logout
		</MenuItem>
	);
}
