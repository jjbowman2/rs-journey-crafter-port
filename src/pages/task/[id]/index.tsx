import {
	Button,
	Center,
	Container,
	Flex,
	Heading,
	IconButton,
	Spacer,
	Tag,
	Text,
	Tooltip,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { Task } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DeleteTaskDialog from "../../../components/delete-task-dialog";
import {
	CheckIcon,
	ChevronLeftIcon,
	CreateEditIcon,
	FlagIcon,
	PlusIcon,
	TrashIcon,
} from "../../../components/icons";
import LoadingIndicator from "../../../components/loading-indicator";
// import TaskCard from "../../../components/task-card";
import { PageWithAuth } from "../../../utils/auth.utils";
import { trpc } from "../../../utils/trpc";

const TaskPage: PageWithAuth = ({}) => {
	const color = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
	const deleteDisclosure = useDisclosure();
	const router = useRouter();
	const id = String(router.query.id);
	const {
		isLoading,
		isError,
		data: task,
	} = trpc.useQuery(["task.findTaskById", id]);
	const { queryClient } = trpc.useContext();
	const mutation = trpc.useMutation(["task.updateTask"], {
		onMutate: ({ complete }) => {
			queryClient.cancelQueries(["task.findTaskById", task?.id]);
			queryClient.setQueryData(
				["task.findTaskById", task?.id],
				// @ts-ignore
				(prev: Task) => ({ ...prev, complete })
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries(["task.findTaskById", task?.id]);
		},
	});

	const toggleComplete = () => {
		mutation.mutate({ id: task!.id, complete: !task!.complete });
	};

	if (isLoading) return <LoadingIndicator />;

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
				<title>RS Journey Crafter | Task</title>
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
					<Spacer />
					{task && (
						<Flex gap={2}>
							<Tooltip
								placement="top"
								label="Edit task"
								openDelay={500}
							>
								<Link href={`/task/${task.id}/edit`}>
									<IconButton
										aria-label="edit task"
										icon={<CreateEditIcon />}
										variant="ghost"
										size="lg"
									/>
								</Link>
							</Tooltip>
							<Tooltip
								placement="top"
								label="Flag task"
								openDelay={500}
							>
								<IconButton
									aria-label="flag task"
									icon={<FlagIcon />}
									variant="ghost"
									size="lg"
									disabled
									title="Flag task coming soon"
								/>
							</Tooltip>
							<Tooltip
								placement="top"
								label="Add prerequisite"
								openDelay={500}
							>
								<IconButton
									aria-label="add prerequisite task"
									icon={<PlusIcon />}
									variant="ghost"
									size="lg"
									disabled
									title="Prerequisites coming soon"
								/>
							</Tooltip>
							<Tooltip
								placement="top"
								label="Delete task"
								openDelay={500}
							>
								<IconButton
									aria-label="delete task"
									icon={<TrashIcon />}
									variant="ghost"
									size="lg"
									onClick={deleteDisclosure.onOpen}
								/>
							</Tooltip>
							<DeleteTaskDialog
								isOpen={deleteDisclosure.isOpen}
								onClose={deleteDisclosure.onClose}
								task={task}
								onDelete={() => router.push("/")}
							/>
						</Flex>
					)}
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
				{/* <Heading fontWeight="semibold" color={color} fontSize="18px">
					Prerequisites
				</Heading>
				{task.dependees?.length === 0 ? (
					<Text>This task does not have any prerequisites.</Text>
				) : (
					task.dependees.map((dependee) => (
						<TaskCard key={dependee.dependeeId} task={} /> // fetch dependee as task
					))
				)} */}
				<Flex justifyContent="end">
					<Button
						colorScheme="orange"
						opacity={task.complete ? 0.7 : undefined}
						onClick={toggleComplete}
						leftIcon={<CheckIcon />}
					>
						{task.complete ? "Mark Uncomplete" : "Mark Complete"}
					</Button>
				</Flex>
			</Container>
		</>
	);
};

TaskPage.authenticationEnabled = true;

export default TaskPage;
