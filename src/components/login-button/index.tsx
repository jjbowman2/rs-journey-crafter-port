import { Button } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
	return <Button onClick={() => signIn("auth0")}>Login</Button>;
}
