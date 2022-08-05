import {
	Button,
	Center,
	Container,
	Flex,
	Heading,
	IconButton,
	Spinner,
	Tag,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChevronLeftIcon, SaveIcon } from "../../../components/icons";
import { PageWithAuth } from "../../../utils/auth.utils";
import { trpc } from "../../../utils/trpc";

const EditTaskPage: PageWithAuth = () => {
	const color = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
	const router = useRouter();
	const id = String(router.query.id);
	const {
		isLoading,
		isError,
		data: task,
	} = trpc.useQuery(["task.findTaskById", id]);

	if (isLoading)
		return (
			<Center h="48">
				<Spinner />
			</Center>
		);

	if (isError)
		return (
			<Center h="48">
				<Text fontSize="lg">
					There was a problem loading your task.
				</Text>
			</Center>
		);

	if (!task) return null;
	return (
		<>
			<Head>
				<title>RS Journey Crafter | Edit Task</title>
				<link rel="icon" href="/img/Crafting_icon.png" />
			</Head>
			<Container
				maxW="container.lg"
				display="flex"
				flexDirection="column"
				gap={3}
			>
				<Flex>
					<IconButton
						variant="ghost"
						aria-label="Go back"
						icon={<ChevronLeftIcon />}
						onClick={() => router.back()}
					/>
				</Flex>
				<Heading
					textAlign="left"
					fontSize="24px"
					fontWeight="semibold"
					textDecor={task.complete ? "line-through" : undefined}
					color={color}
				>
					{task.title}
				</Heading>
				<Text
					fontSize="18px"
					fontWeight="light"
					textAlign="left"
					textDecor={task.complete ? "line-through" : undefined}
				>
					{task.description}
				</Text>
				{task.labels?.length > 0 && (
					<Flex gap={2}>
						{task.labels.map((label) => (
							<Tag
								key={label}
								size="lg"
								colorScheme="orange"
								borderRadius="full"
							>
								{label}
							</Tag>
						))}
					</Flex>
				)}
				<Heading fontWeight="semibold" color={color} fontSize="18px">
					Prerequisites
				</Heading>
				{/* {task.dependees?.length === 0 ? (
					<Text>This task does not have any prerequisites.</Text>
				) : (
					task.dependees.map((dependee) => (
						<TaskCard key={dependee.dependeeId} task={} /> // fetch dependee as task
					))
				)} */}
				<Flex justifyContent="end" gap={8}>
					<Button
						colorScheme="orange"
						variant="ghost"
						onClick={() => router.back()}
					>
						Discard Changes
					</Button>
					<Button colorScheme="orange" leftIcon={<SaveIcon />}>
						Save Changes
					</Button>
				</Flex>
			</Container>
		</>
	);
};

EditTaskPage.authenticationEnabled = true;

export default EditTaskPage;
