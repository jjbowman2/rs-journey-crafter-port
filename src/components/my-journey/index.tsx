import { Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { selectedAccountAtom } from "../accounts-dropdown";
import JourneyToolbar from "../journey-toolbar";
import LoadingIndicator from "../loading-indicator";
import TaskCard from "../task-card";
import { api } from "~/utils/api";
import { sortAttributeAtom, sortOrderAtom } from "../sort-popover";
import { filtersAtom, hideCompleteAtom } from "../filter-popover";

export default function MyJourney() {
  const [selectedAccount] = useAtom(selectedAccountAtom);
  const [sortOrder] = useAtom(sortOrderAtom);
  const [sortAttribute] = useAtom(sortAttributeAtom);
  const [filters] = useAtom(filtersAtom);
  const [hideComplete] = useAtom(hideCompleteAtom);
  const accountId = selectedAccount?.id || "";
  const { isError, isLoading, data } =
    api.task.findAllTasksForAccount.useQuery(accountId);
  const tasks = useMemo(
    () =>
      data
        ?.sort((taskA, taskB) => {
          let attributeA, attributeB;
          switch (sortAttribute) {
            case "numberPrerequisites":
              attributeA = taskA.dependees?.length ?? 0;
              attributeB = taskB.dependees?.length ?? 0;
              break;
            case "title":
              attributeA = taskA.title;
              attributeB = taskB.title;
              break;
            case "created-date":
            default:
              attributeA = taskA.createdAt;
              attributeB = taskB.createdAt;
          }
          if (attributeA < attributeB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          return sortOrder === "asc" ? 1 : -1;
        })
        ?.filter((task) => {
          if (hideComplete && task.complete) return false;
          return filters.every((filter) => {
            let attribute;
            switch (filter.attribute) {
              case "labels":
                attribute = task.labels?.join(" ") ?? "";
                break;
              case "type":
                attribute = task.taskType;
                break;
              case "description":
              case "title":
              default:
                attribute = task[filter.attribute];
            }
            switch (filter.operator) {
              case "==":
                return (
                  attribute
                    ?.toLowerCase()
                    .includes(filter.value.toLowerCase()) ?? false
                );
              case "!=":
                return (
                  !attribute
                    ?.toLowerCase()
                    .includes(filter.value.toLowerCase()) ?? false
                );
            }
          });
        }),
    [data, sortOrder, sortAttribute, hideComplete, filters]
  );
  const router = useRouter();

  // if selectedAccount is null (as opposed to undefined) no accounts were found
  if (selectedAccount === null && !isLoading) {
    void router.push("/welcome");
  }

  // query is dependent on loading the selectedAccount, loading won't start unless selectedAccount is truthy
  if (isLoading || !selectedAccount) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <p>There was a problem loading your latest journey information.</p>;
  }

  return (
    <>
      <JourneyToolbar />
      {tasks?.length === 0 ? (
        <Text mt={8} fontSize="lg">
          You don&apos;t have any tasks. Try adding a few now to get your
          journey started.
        </Text>
      ) : (
        tasks?.map((task) => <TaskCard key={`task${task.id}`} task={task} />)
      )}
    </>
  );
}
