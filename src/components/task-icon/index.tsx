import { IconProps, Image, ImageProps } from "@chakra-ui/react";
import { Task } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { TaskDefaultIcon } from "../icons";

type IconImageIntersectionProps = IconProps & ImageProps;

export interface TaskIconProps extends IconImageIntersectionProps {
	task: Task;
}

export function TaskIcon({ task, ...props }: TaskIconProps) {
	const {
		isLoading,
		isError,
		data: account,
	} = trpc.useQuery(["account.findById", task.accountId], {
		staleTime: Infinity,
	});
	if (isLoading) return null;
	if (isError || task.taskType === "custom")
		return <TaskDefaultIcon {...props} />;
	let imageName = account!.game === "rs" ? "rs_" : "osrs_";
	if (task.taskType === "skill") {
		imageName += task.skill ?? "stats";
	} else {
		imageName += task.taskType;
	}
	return <Image {...props} src={`/img/${imageName}.png`} alt="" />;
}

export default TaskIcon;
