import { Box, Hide, Show, useColorModeValue } from "@chakra-ui/react";
import type { Dependency, Task } from "@prisma/client";
import { motion } from "framer-motion";
import DesktopTaskCard from "./desktop-task-card";
import MobileTaskCard from "./mobile-task-card";
import { api } from "~/utils/api";
type TaskCardProps = {
  task: Task;
};

type TaskWithDependees = Task & {
  dependees: Dependency[];
};

export default function TaskCard({ task }: TaskCardProps) {
  const bg = useColorModeValue("#ffffff6b", "#4a556859");
  const utils = api.useContext();
  const mutation = api.task.updateTask.useMutation({
    onMutate: async ({ id, complete, flagged }) => {
      await utils.task.findAllTasksForAccount.cancel(task.accountId);
      utils.task.findAllTasksForAccount.setData(
        task.accountId,
        (old: TaskWithDependees[] | undefined): TaskWithDependees[] =>
          old?.map((task) => ({
            ...task,
            complete:
              task.id == id && complete !== undefined
                ? complete ?? false
                : task.complete,
            flagged:
              task.id == id && flagged !== undefined
                ? flagged ?? false
                : task.flagged,
          })) ?? []
      );
    },
    onSettled: () =>
      utils.task.findAllTasksForAccount.invalidate(task.accountId),
  });

  const toggleComplete = () => {
    mutation.mutate({ id: task.id, complete: !task.complete });
  };

  const toggleFlagged = () => {
    mutation.mutate({ id: task.id, flagged: !task.flagged });
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
        <DesktopTaskCard
          task={task}
          toggleComplete={toggleComplete}
          toggleFlagged={toggleFlagged}
        />
      </Show>
      <Hide above="md">
        <MobileTaskCard task={task} toggleComplete={toggleComplete} />
      </Hide>
    </Box>
  );
}
