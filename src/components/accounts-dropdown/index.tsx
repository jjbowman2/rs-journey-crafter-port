import {
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { type AccountType, Game, type GameAccount } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChevronDownIcon, PlusIcon } from "../icons";
import LogoutButton from "../logout-button";

import { api } from "~/utils/api";

export const selectedAccountIdAtom = atomWithStorage("selected-account-id", "");
export const selectedAccountAtom = atom<GameAccount | null | undefined>(
  undefined
);

export default function AccountsDropdown() {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useAtom(
    selectedAccountIdAtom
  );
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const { userId } = useAuth();
  const { isLoading, isError, data } = api.account.findAllForUser.useQuery(
    userId || "",
    { enabled: !!userId }
  );

  useEffect(() => {
    if (isLoading || selectedAccountId) return;
    if (data?.length) {
      setSelectedAccountId(data[0]?.id || "");
    }
  }, [isLoading, selectedAccountId, data, setSelectedAccountId]);

  useEffect(() => {
    // if the query is still loading or the selectedAccountId is not set but there is data, return
    if (isLoading) return;
    if (!selectedAccountId && data?.length) return;
    // set as null to indicate a lack of accounts (as opposed to none yet selected due to loading)
    setSelectedAccount(
      data?.find((account) => account.id.toString() === selectedAccountId) ||
        null
    );
  }, [data, isLoading, selectedAccountId, setSelectedAccount]);

  if (isError || isLoading) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        leftIcon={
          selectedAccount && (
            <GameIcon
              game={selectedAccount.game}
              accountType={selectedAccount.accountType}
            />
          )
        }
        rightIcon={<ChevronDownIcon />}
        iconSpacing={!selectedAccount ? 0 : undefined}
      >
        {selectedAccount?.accountName}
      </MenuButton>
      <MenuList>
        {data?.map((account) => (
          <MenuItem
            key={`account${account.id}`}
            icon={
              <GameIcon game={account.game} accountType={account.accountType} />
            }
            onClick={() => setSelectedAccountId(account.id)}
            marginLeft="auto"
          >
            {account.accountName}
          </MenuItem>
        ))}
        <MenuItem
          icon={<PlusIcon />}
          onClick={() => void router.push("/account/new")}
        >
          Add New Account
        </MenuItem>
        <LogoutButton />
      </MenuList>
    </Menu>
  );
}

interface GameIconProps {
  game: Game;
  accountType: AccountType | null;
}

const GameIcon = ({ game, accountType }: GameIconProps) => {
  // TODO: get logos for other account types
  let src;
  if (game === Game.rs) {
    src = "/img/rs_logo.png";
  } else {
    src = "/img/osrs_logo.png";
  }
  return <Image src={src} alt="Account Icon" />;
};
