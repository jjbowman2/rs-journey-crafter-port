import { useBoolean, Flex, IconButton, Show } from "@chakra-ui/react";
import CreateTasksModal from "../create-tasks-modal";
import { SortDownIcon, FilterIcon, DiagramIcon, ListIcon } from "../icons";

export default function JourneyToolbar() {
	const [listMode, { on, off }] = useBoolean(true);
	return (
		<Flex>
			<Flex gap={2} flex="1" justifyContent="left">
				<IconButton
					aria-label="Sort"
					icon={<SortDownIcon />}
					variant="ghost"
				/>
				<IconButton
					aria-label="Filter"
					icon={<FilterIcon />}
					variant="ghost"
				/>
			</Flex>
			<Show above="md">
				<Flex gap={2} flex="1" justifyContent="center">
					<IconButton
						aria-label="Display as List"
						icon={<ListIcon />}
						variant="ghost"
						colorScheme={listMode ? "blue" : undefined}
						onClick={on}
					/>
					<IconButton
						aria-label="Display as Graph"
						icon={<DiagramIcon />}
						variant="ghost"
						colorScheme={listMode ? undefined : "blue"}
						onClick={off}
						disabled
						title="Graph mode is coming soon"
					/>
				</Flex>
			</Show>
			<Flex flex="1" justifyContent="right">
				<CreateTasksModal />
			</Flex>
		</Flex>
	);
}
