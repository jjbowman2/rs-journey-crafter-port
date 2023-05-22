import { useClerk } from "@clerk/nextjs";
import { MenuItem } from "@chakra-ui/react";

export default function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <MenuItem onClick={() => void signOut()} textColor="red.600">
      Logout
    </MenuItem>
  );
}
