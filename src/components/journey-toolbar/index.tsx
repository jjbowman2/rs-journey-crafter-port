import {
  Flex,
  // IconButton,
  // Show,
  // useBoolean
} from "@chakra-ui/react";
import CreateTasksModal from "../create-tasks-modal";
import FilterPopover from "../filter-popover";
// import { DiagramIcon, ListIcon } from "../icons";
import SortPopover from "../sort-popover";

export default function JourneyToolbar() {
  //   const [listMode, { on, off }] = useBoolean(true);
  return (
    <Flex>
      <Flex gap={2} flex="1" justifyContent="left">
        <SortPopover />
        <FilterPopover />
      </Flex>
      {/* <Show above="md">
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
			</Show> */}
      <Flex flex="1" justifyContent="right">
        <CreateTasksModal />
      </Flex>
    </Flex>
  );
}
