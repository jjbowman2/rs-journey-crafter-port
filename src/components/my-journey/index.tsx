import { Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { trpc } from "../../utils/trpc";
import { selectedAccountAtom } from "../accounts-dropdown";
import JourneyToolbar from "../journey-toolbar";
import LoadingIndicator from "../loading-indicator";
import TaskCard from "../task-card";

export default function MyJourney() {
	const [selectedAccount] = useAtom(selectedAccountAtom);
	const accountId = selectedAccount?.id || "";
	const { isError, isLoading, data } = trpc.useQuery([
		"task.findAllTasksForAccount",
		accountId,
	]);
	const tasks = useMemo(
		() =>
			data?.sort((t1, t2) => Number(t1.createdAt) - Number(t2.createdAt)),
		[data]
	);
	const router = useRouter();

	// if selectedAccount is null (as opposed to undefined) no accounts were found
	if (selectedAccount === null && !isLoading) {
		router.push("/welcome");
	}

	// query is dependent on loading the selectedAccount, loading won't start unless selectedAccount is truthy
	if (isLoading || !selectedAccount) {
		return <LoadingIndicator />;
	}

	if (isError) {
		return (
			<p>There was a problem loading your latest journey information.</p>
		);
	}

	return (
		<>
			<JourneyToolbar />
			{tasks?.length === 0 ? (
				<Text mt={8} fontSize="lg">
					You don&apos;t have any tasks. Try adding a few now to get
					your journey started.
				</Text>
			) : (
				tasks?.map((task) => (
					<TaskCard key={`task${task.id}`} task={task} />
				))
			)}
		</>
	);
}
