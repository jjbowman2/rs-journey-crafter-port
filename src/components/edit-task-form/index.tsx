import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Stack,
	Textarea,
	useToast,
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
import { trpc } from "../../utils/trpc";
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
	const toast = useToast();
	const [labels, setLabels] = useState<PropsValue<LabelOption>>(
		task.labels.map((label) => ({ label, value: label }))
	); // controlled state for label since multi-select is not compatible with react-hook-form
	const { register, handleSubmit, reset, formState } = useForm({
		defaultValues: {
			title: task?.title,
			description: task?.description,
			taskType: task?.taskType,
		},
	});

	const { invalidateQueries } = trpc.useContext();
	const mutation = trpc.useMutation(["task.updateTask"], {
		onSuccess: (task) => {
			invalidateQueries(["task.findAllTasksForAccount"]);
			invalidateQueries(["task.findTaskById", task.id]);
			router.push("/task/" + task.id);
		},
		onError: (error) => {
			// TODO: show error
			toast({
				title: "Task edit failed",
				description: "Something went wrong. Please try again later.",
				status: "error",
				isClosable: true,
				duration: 4000,
			});
			console.error(error);
		},
	});

	return (
		<form
			onSubmit={handleSubmit(({ title, description, taskType }: any) =>
				mutation.mutate({
					description,
					taskType,
					title,
					id: task.id,
					// @ts-ignore
					labels: labels.map((label) => label.value),
				})
			)}
		>
			<Stack gap={4}>
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
						<option value="achievementDiary">
							Achievement Diary
						</option>
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
						noOptionsMessage={() =>
							"Type label and press enter to add"
						}
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
						onClick={() => router.push("/task/" + task.id)}
					>
						Discard Changes
					</Button>
					<Button
						colorScheme="orange"
						leftIcon={<SaveIcon />}
						disabled={
							(!formState.isDirty &&
								arrayShallowEquality(
									// @ts-ignore
									labels.map((label) => label.value),
									task.labels
								)) ||
							formState.isSubmitting
						}
						type="submit"
					>
						Save Changes
					</Button>
				</Flex>
			</Stack>
		</form>
	);
}

const arrayShallowEquality = (array1: any[], array2: any[]): boolean => {
	if (array1.length !== array2.length) return false;
	if (!array1.every((val, index) => val === array2[index])) return false;
	return true;
};
