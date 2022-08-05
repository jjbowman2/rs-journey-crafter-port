import { Box, Hide, Show, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Task } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import DesktopTaskCard from "./desktop-task-card";
import MobileTaskCard from "./mobile-task-card";
type TaskCardProps = {
	task: Task;
};
export default function TaskCard({ task }: TaskCardProps) {
	const bg = useColorModeValue("white", "gray.600");
	const { queryClient } = trpc.useContext();
	const mutation = trpc.useMutation(["task.updateTask"], {
		onMutate: ({ id, complete }) => {
			queryClient.cancelQueries([
				"task.findAllTasksForAccount",
				task.accountId,
			]);
			queryClient.setQueryData(
				["task.findAllTasksForAccount", task.accountId],
				(old: Task[] | undefined): Task[] =>
					old?.map((task) => ({
						...task,
						complete: task.id == id ? complete : task.complete,
					})) ?? []
			);
		},
		onSettled: () =>
			queryClient.invalidateQueries([
				"task.findAllTasksForAccount",
				task.accountId,
			]),
	});

	const toggleComplete = () => {
		mutation.mutate({ id: task.id, complete: !task.complete });
	};

	return (
		<Box
			borderRadius={4}
			boxShadow="md"
			bg={bg}
			as={motion.div}
			whileHover={{ scale: 1.005 }}
			whileTap={{ scale: 0.995 }}
		>
			<Show above="md">
				<DesktopTaskCard task={task} toggleComplete={toggleComplete} />
			</Show>
			<Hide above="md">
				<MobileTaskCard task={task} toggleComplete={toggleComplete} />
			</Hide>
		</Box>
	);
}
