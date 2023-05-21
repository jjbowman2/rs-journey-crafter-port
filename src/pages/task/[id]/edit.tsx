import { Center, Container, Flex, IconButton, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import EditTaskForm from "../../../components/edit-task-form";
import { ChevronLeftIcon } from "../../../components/icons";
import LoadingIndicator from "../../../components/loading-indicator";
import { api } from "~/utils/api";

const EditTaskPage = () => {
  const router = useRouter();
  const id = String(router.query.id);
  const { isLoading, isError, data: task } = api.task.findTaskById.useQuery(id);

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
            onClick={() => void router.push("/task/" + task.id)}
          />
        </Flex>
        <EditTaskForm task={task} />
      </Container>
    </>
  );
};

export default EditTaskPage;
