import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
} from "@chakra-ui/react";
import { Dependency, Task } from "@prisma/client";
import {
	CreatableSelect,
	GroupBase,
	OptionBase,
	PropsValue,
} from "chakra-react-select";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SaveIcon } from "../icons";

type EditTaskFormProps = {
	task: Task & {
		dependees: Dependency[];
	};
};

interface LabelOption extends OptionBase {
	label: string;
	value: string;
}

export default function EditTaskForm({ task }: EditTaskFormProps) {
	const router = useRouter();
	const [labels, setLabels] = useState<PropsValue<LabelOption>>(
		task.labels.map((label) => ({ label, value: label }))
	); // controlled state for label since multi-select is not compatible with react-hook-form
	const { register, handleSubmit, reset } = useForm({
		defaultValues: {
			title: task?.title,
			description: task?.description,
			taskType: task?.taskType,
		},
	});

	return (
		<>
			<FormControl isRequired>
				<FormLabel htmlFor="taskTitle">Title</FormLabel>
				<Input
					id="taskTitle"
					placeholder="Example: Complete Cook's Assistant"
					required
					{...register("title")}
				/>
			</FormControl>
			<FormControl>
				<FormLabel htmlFor="taskDescription">Description</FormLabel>
				<Textarea
					id="taskDescription"
					placeholder="Example: Bake that dude a cake!"
					{...register("description")}
				/>
			</FormControl>
			<FormControl>
				<FormLabel htmlFor="taskType">Task Type</FormLabel>
				<Select
					id="taskType"
					placeholder="Example: Quest"
					{...register("taskType")}
				>
					<option value="skill">Skill</option>
					<option value="quest">Quest</option>
					<option value="achievementDiary">Achievement Diary</option>
					<option value="combatTask">Combat Task</option>
					<option value="item">Item</option>
					<option value="custom">Other</option>
				</Select>
			</FormControl>
			<FormControl>
				<FormLabel htmlFor="taskLabels">Add a Label</FormLabel>
				<CreatableSelect<LabelOption, true, GroupBase<LabelOption>>
					id="taskLabels"
					isMulti
					placeholder="Example: Questing"
					noOptionsMessage={() => "Type label and press enter to add"}
					formatCreateLabel={(value) => `Add "${value}"`}
					value={labels}
					onChange={setLabels}
				></CreatableSelect>
			</FormControl>
			{/* TODO: make this like smart select component with multiple */}
			<FormControl>
				<FormLabel htmlFor="taskPrerequisites">
					Add a Prerequisite
				</FormLabel>
				<Input
					id="taskPrerequisites"
					placeholder="Coming soon"
					disabled
					// {...register("prerequisites")}
				/>
			</FormControl>
			<Flex justifyContent="end" gap={8}>
				<Button
					colorScheme="orange"
					variant="ghost"
					onClick={() => router.back()}
				>
					Discard Changes
				</Button>
				<Button
					colorScheme="orange"
					leftIcon={<SaveIcon />}
					disabled
					title="Work in progress"
				>
					Save Changes
				</Button>
			</Flex>
		</>
	);
}
