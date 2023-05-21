import { type IconProps, Image, type ImageProps } from "@chakra-ui/react";
import { type Task } from "@prisma/client";
import { TaskDefaultIcon } from "../icons";
import { api } from "~/utils/api";

type IconImageIntersectionProps = IconProps & ImageProps;

export interface TaskIconProps extends IconImageIntersectionProps {
  task: Task;
}

export function TaskIcon({ task, ...props }: TaskIconProps) {
  const {
    isLoading,
    isError,
    data: account,
  } = api.account.findById.useQuery(task.accountId, {
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
