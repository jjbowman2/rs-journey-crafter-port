import { Button } from "@chakra-ui/react";
import { useClerk } from "@clerk/nextjs";

export default function LoginButton() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { redirectToSignIn } = useClerk();
  return <Button onClick={() => void redirectToSignIn()}>Login</Button>;
}
