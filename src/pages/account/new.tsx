import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { useAtom } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { selectedAccountIdAtom } from "../../components/accounts-dropdown";
import { api } from "~/utils/api";
import { type CreateAccountInput } from "~/server/api/routers/account";

const AddAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateAccountInput>();
  const { userId } = useAuth();
  const [, setSelectedAccountId] = useAtom(selectedAccountIdAtom);
  const router = useRouter();
  const utils = api.useContext();
  const mutation = api.account.createAccount.useMutation({
    async onSuccess(data) {
      setSelectedAccountId(data.id);
      await utils.account.findAllForUser.invalidate(userId ?? "");
      await router.push("/");
    },
  });

  return (
    <>
      <Head>
        <title>RS Journey Crafter | New Account</title>
        <meta name="description" content="Home dashboard" />
        <link rel="icon" href="/img/Crafting_icon.png" />
      </Head>
      <Container maxW="container.md" as="main">
        <Heading size="lg">Getting Started</Heading>
        <Heading size="2xl" mb={4}>
          Add New Account
        </Heading>
        <Flex
          as="form"
          direction="column"
          onSubmit={
            void handleSubmit(({ accountName, game, accountType }) => {
              if (userId)
                mutation.mutate({
                  userId,
                  accountName,
                  game,
                  accountType: accountType || null,
                });
            })
          }
          gap={4}
        >
          <FormControl isRequired>
            <FormLabel htmlFor="accountName">In Game Name</FormLabel>
            <Input
              id="accountName"
              placeholder="Example: Cow31337Killer"
              required
              {...register("accountName")}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="game">In Game Name</FormLabel>
            <Select
              id="game"
              placeholder="Example: Old School RuneScape"
              required
              {...register("game")}
            >
              <option value="osrs">Old School RuneScape</option>
              <option value="rs">RuneScape</option>
              <option value="osrs_leagues">OSRS Leagues</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="accountType">Account Type</FormLabel>
            <Select
              id="accountType"
              placeholder="Example: Hardcore Ironman"
              {...register("accountType")}
            >
              <option value="main">Main Account</option>
              <option value="ironman">Ironman</option>
              <option value="hardcore_ironman">Hardcore Ironman</option>
              <option value="group_ironman">Group Ironman</option>
              <option value="ultimate_ironman">Ultimate Ironman</option>
            </Select>
          </FormControl>
          <Button
            variant="ghost"
            type="submit"
            marginLeft="auto"
            disabled={isSubmitting}
          >
            Add Account
          </Button>
        </Flex>
      </Container>
    </>
  );
};
export default AddAccount;
