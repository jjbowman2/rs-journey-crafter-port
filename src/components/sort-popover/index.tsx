import {
	Button,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Stack,
	StackDivider,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ArrowDownIcon, ArrowUpIcon, SortDownIcon, SortUpIcon } from "../icons";

type SortOrder = "asc" | "desc";
type SortAttribute = "created-date" | "numberPrerequisites" | "title";

const sortOrderAtom = atomWithStorage<SortOrder>("task-sort-order", "asc");
const sortAttributeAtom = atomWithStorage<SortAttribute>(
	"task-sort-attribute",
	"created-date"
);

export default function SortPopover() {
	const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
	const [sortAttribute, setSortAttribute] = useAtom(sortAttributeAtom);

	const handleSortChange = (attribute: SortAttribute) => () => {
		if (attribute == sortAttribute) {
			if (sortOrder == "asc") setSortOrder("desc");
			else setSortOrder("asc");
		} else {
			setSortAttribute(attribute);
		}
	};

	return (
		<Popover placement="bottom-start">
			<PopoverTrigger>
				<IconButton
					aria-label="Sort"
					icon={
						sortOrder == "asc" ? <SortUpIcon /> : <SortDownIcon />
					}
					variant="ghost"
				/>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverHeader textAlign="left">Sort tasks by:</PopoverHeader>
				<PopoverBody>
					<Stack>
						<Button
							variant="ghost"
							justifyContent="left"
							onClick={handleSortChange("created-date")}
							leftIcon={
								sortAttribute == "created-date" ? (
									sortOrder == "asc" ? (
										<ArrowUpIcon color="orange.500" />
									) : (
										<ArrowDownIcon color="orange.500" />
									)
								) : undefined
							}
						>
							Created date
						</Button>
						<StackDivider />
						<Button
							variant="ghost"
							justifyContent="left"
							onClick={handleSortChange("numberPrerequisites")}
							leftIcon={
								sortAttribute == "numberPrerequisites" ? (
									sortOrder == "asc" ? (
										<ArrowUpIcon color="orange.500" />
									) : (
										<ArrowDownIcon color="orange.500" />
									)
								) : undefined
							}
						>
							Number of prerequisites
						</Button>
						<StackDivider />
						<Button
							variant="ghost"
							justifyContent="left"
							onClick={handleSortChange("title")}
							leftIcon={
								sortAttribute == "title" ? (
									sortOrder == "asc" ? (
										<ArrowUpIcon color="orange.500" />
									) : (
										<ArrowDownIcon color="orange.500" />
									)
								) : undefined
							}
						>
							Title
						</Button>
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
