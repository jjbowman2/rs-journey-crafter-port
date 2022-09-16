import { Badge, Button, Container, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Welcome: NextPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>RS Journey Crafter | Welcome</title>
				<link rel="icon" href="/img/Crafting_icon.png" />
			</Head>
			<main>
				<Container
					maxW="container.lg"
					display="flex"
					flexDirection="column"
					px="12"
					gap={4}
				>
					<Heading>Welcome to the RuneScape Journey Crafter</Heading>
					<Badge colorScheme="red" width="fit-content">
						This application is currently in alpha and many features
						are actively under development.
					</Badge>
					<Text>
						The world of Gielinor is vast... and there is a lot to
						do. We each have our own journey ahead of us filled with
						many fun hours of &apos;scapin, but no two journeys are
						the same.
						<br />
						<br />
						Sometimes it can feel a bit overwhelming trying to
						remember all of the tasks and goals we have for our
						accounts. Starting out with solving a hard clue can
						sometimes result in a rabbit hole of tasks where
						you&apos;ve gained 8 total levels and completed two
						quests. This tool aims to make managing these tasks just
						a bit easier. All you have to do is create an account
						and start crafting your journey.
					</Text>
					<Button
						onClick={() => router.push("/account/new")}
						ml="auto"
						size="lg"
					>
						Get Started
					</Button>
				</Container>
			</main>
		</>
	);
};

export default Welcome;
