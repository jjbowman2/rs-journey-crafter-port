import {
	Heading,
	Flex,
	FormControl,
	FormLabel,
	Select,
	Button,
	Container,
	Input,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { PageWithAuth } from "../../utils/auth.utils";
import { selectedAccountIdAtom } from "../../components/accounts-dropdown";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const AddAccount: PageWithAuth = () => {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();
	const session = useSession();
	const userId = session?.data?.user?.id;
	const [, setSelectedAccountId] = useAtom(selectedAccountIdAtom);
	const router = useRouter();
	const { invalidateQueries } = trpc.useContext();
	const mutation = trpc.useMutation(["account.createAccount"], {
		onSuccess(data) {
			setSelectedAccountId(data.id);
			invalidateQueries(["account.findAllForUser"]);
			router.push("/");
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
					onSubmit={handleSubmit(
						({ accountName, game, accountType }) => {
							console.log({ accountName, game, accountType });
							if (userId)
								mutation.mutate({
									userId,
									accountName,
									game,
									accountType: accountType || null,
								});
						}
					)}
					gap={4}
				>
					<FormControl isRequired>
						<FormLabel htmlFor="accountName">
							In Game Name
						</FormLabel>
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
						<FormLabel htmlFor="accountType">
							Account Type
						</FormLabel>
						<Select
							id="accountType"
							placeholder="Example: Hardcore Ironman"
							{...register("accountType")}
						>
							<option value="main">Main Account</option>
							<option value="ironman">Ironman</option>
							<option value="hardcore_ironman">
								Hardcore Ironman
							</option>
							<option value="group_ironman">Group Ironman</option>
							<option value="ultimate_ironman">
								Ultimate Ironman
							</option>
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

AddAccount.authenticationEnabled = true;
export default AddAccount;
