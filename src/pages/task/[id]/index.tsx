import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { type Task } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import CreatePrerequisiteModal from "../../../components/create-prerequisite-modal";
import DeleteTaskDialog from "../../../components/delete-task-dialog";
import {
  CheckIcon,
  ChevronLeftIcon,
  CreateEditIcon,
  FlagIcon,
  TrashIcon,
} from "../../../components/icons";
import LoadingIndicator from "../../../components/loading-indicator";
import TaskCard from "../../../components/task-card";
import { api } from "~/utils/api";
// import TaskCard from "../../../components/task-card";

const TaskPage = () => {
  const color = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
  const deleteDisclosure = useDisclosure();
  const router = useRouter();
  const id = String(router.query.id);
  const utils = api.useContext();
  const { isLoading, isError, data: task } = api.task.findTaskById.useQuery(id);
  const { data: prerequisites } = api.task.findAllDependeesForTask.useQuery(id);
  const mutation = api.task.updateTask.useMutation({
    onMutate: async (update) => {
      await utils.task.findTaskById.cancel(task?.id);
      utils.task.findTaskById.setData(task?.id, (prev: Task) => ({
        ...prev,
        ...update,
      }));
    },
    onSettled: async () => {
      await utils.task.findTaskById.invalidate(task?.id);
    },
  });

  const toggleComplete = () => {
    mutation.mutate({ id: task!.id, complete: !task!.complete });
  };

  const toggleFlagged = () => {
    mutation.mutate({ id: task!.id, flagged: !task!.flagged });
  };

  if (isLoading) return <LoadingIndicator />;

  if (isError)
    return (
      <Center h="48">
        <Text fontSize="lg">There was a problem loading your task.</Text>
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
            onClick={() => router.push("/")}
          />
          <Spacer />
          {task && (
            <Flex gap={2}>
              <Tooltip placement="top" label="Edit task" openDelay={500}>
                <Link href={`/task/${task.id}/edit`}>
                  <IconButton
                    aria-label="edit task"
                    icon={<CreateEditIcon />}
                    variant="ghost"
                    size="lg"
                  />
                </Link>
              </Tooltip>
              <Tooltip placement="top" label="Flag task" openDelay={500}>
                <IconButton
                  aria-label="flag task"
                  icon={<FlagIcon />}
                  variant="ghost"
                  size="lg"
                  onClick={toggleFlagged}
                  colorScheme={task.flagged ? "red" : undefined}
                />
              </Tooltip>
              <CreatePrerequisiteModal dependentTaskId={id} />
              <Tooltip placement="top" label="Delete task" openDelay={500}>
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

        <Stack display="flex" justifyContent="right">
          <Heading
            fontWeight="semibold"
            color={color}
            fontSize="18px"
            mt="24px"
          >
            Prerequisites
          </Heading>
          {prerequisites?.length === 0 ? (
            <Text>This task does not have any prerequisites.</Text>
          ) : (
            prerequisites?.map((prerequisite) => (
              <TaskCard key={prerequisite.id} task={prerequisite} /> // fetch dependee as task
            ))
          )}
        </Stack>
      </Container>
    </>
  );
};

export default TaskPage;
