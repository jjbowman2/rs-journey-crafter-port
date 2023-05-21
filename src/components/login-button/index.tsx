import { Button } from "@chakra-ui/react";
import { useClerk } from "@clerk/nextjs";

export default function LoginButton() {
  const { redirectToSignIn } = useClerk();
  return <Button onClick={() => void redirectToSignIn()}>Login</Button>;
}
