import {
	Badge,
	Box,
	Checkbox,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputRightAddon,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Select,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FilterIcon, PlusIcon, XIcon } from "../icons";

// type SortOrder = "asc" | "desc";
// type SortAttribute = "created-date" | "numberPrerequisites" | "title";

// const sortOrderAtom = atomWithStorage<SortOrder>("task-sort-order", "asc");
// const sortAttributeAtom = atomWithStorage<SortAttribute>(
// 	"task-sort-attribute",
// 	"created-date"
// );
const FilterAttribute = z.enum(["title", "description", "type", "labels"]);
type FilterAttribute = z.infer<typeof FilterAttribute>;
const FilterOperator = z.enum(["==", "!="]);
type FilterOperator = z.infer<typeof FilterOperator>;

const Filter = z.object({
	attribute: FilterAttribute,
	operator: FilterOperator,
	value: z.string().min(1, "Please enter a value"),
});
type Filter = z.infer<typeof Filter>;

const filtersAtom = atomWithStorage<Filter[]>("task-filters", []);
const hideCompleteAtom = atomWithStorage("hide-complete-tasks", true);

export default function FilterPopover() {
	const [filterAttribute, setFilterAttribute] = useState<
		FilterAttribute | undefined
	>("title");
	const [filterOperator, setFilterOperator] = useState<FilterOperator>("==");
	const [filterValue, setFilterValue] = useState<string>("");
	const [formError, setFormError] = useState<string>("");
	const [filters, setFilters] = useAtom(filtersAtom);
	const [hideComplete, setHidecomplete] = useAtom(hideCompleteAtom);

	const remainingAttributes = useMemo(
		() =>
			FilterAttribute.options.filter(
				(attribute) =>
					!filters.some((filter) => filter.attribute == attribute)
			),
		[filters]
	);

	useEffect(() => {
		setFilterAttribute(remainingAttributes?.[0]);
	}, [filters, remainingAttributes]);

	const handleAddFilter = () => {
		let result = Filter.safeParse({
			attribute: filterAttribute,
			operator: filterOperator,
			value: filterValue,
		});
		if (!result.success) {
			setFormError(result.error.errors[0]?.message ?? "");
		} else {
			setFormError("");
			setFilterValue("");
			setFilters([...filters, result.data]);
		}
	};

	const handleRemoveFilter = (index: number) => () => {
		setFilters((prev) => [
			...prev.slice(0, index),
			...prev.slice(index + 1),
		]);
	};

	return (
		<Popover placement="bottom-start">
			<PopoverTrigger>
				<div>
					<IconButton
						aria-label="Filter"
						icon={<FilterIcon />}
						variant="ghost"
					/>
					{!!filters.length && (
						<Badge
							marginLeft={-4}
							marginTop={-4}
							colorScheme="orange"
						>
							{filters.length}
						</Badge>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent width={350}>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverHeader textAlign="left">Filter tasks by:</PopoverHeader>
				<PopoverBody>
					<Stack>
						<Checkbox
							checked={hideComplete}
							onChange={(e) => setHidecomplete(e.target.checked)}
							textAlign="left"
						>
							Hide completed tasks
						</Checkbox>
						<StackDivider />
						<FormControl isInvalid={Boolean(formError)}>
							<FormLabel>Add a filter</FormLabel>
							<InputGroup>
								<Select
									variant="flushed"
									value={filterAttribute}
									flex={2}
									onChange={(e) =>
										// @ts-ignore
										setFilterAttribute(e.target.value)
									}
								>
									{remainingAttributes.length > 0 ? (
										remainingAttributes.map((attribute) => (
											<option
												style={{ padding: 10 }}
												key={attribute}
												value={attribute}
											>
												<Box p={4}>{attribute}</Box>
											</option>
										))
									) : (
										<option disabled>
											No filters remaining
										</option>
									)}
								</Select>
								<Select
									flex={1}
									variant="flushed"
									value={filterOperator}
									onChange={(e) =>
										// @ts-ignore
										setFilterOperator(e.target.value)
									}
								>
									<option value="==">=</option>
									<option value="!=">&ne;</option>
								</Select>
								<Input
									flex={2}
									variant="flushed"
									value={filterValue}
									onChange={(e) =>
										setFilterValue(e.target.value)
									}
								/>
								<InputRightAddon>
									<IconButton
										aria-label="Add filter"
										icon={<PlusIcon />}
										variant="ghost"
										onClick={handleAddFilter}
									/>
								</InputRightAddon>
							</InputGroup>
							{formError && (
								<FormErrorMessage>{formError}</FormErrorMessage>
							)}
						</FormControl>
						<StackDivider />
						{filters.map((filter, index) => (
							<Flex
								key={filter.attribute + index}
								alignItems="center"
							>
								<Text marginRight={2}>{filter.attribute}</Text>
								<Text marginRight={2}>{filter.operator}</Text>
								<Text>{filter.value}</Text>
								<IconButton
									aria-label="Remove filter"
									icon={<XIcon />}
									onClick={handleRemoveFilter(index)}
									marginLeft="auto"
								/>
							</Flex>
						))}
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
