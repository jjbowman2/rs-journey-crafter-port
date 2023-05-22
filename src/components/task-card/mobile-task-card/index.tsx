import {
  Flex,
  Box,
  Heading,
  Text,
  Checkbox,
  Stack,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { type Task } from "@prisma/client";
import Link from "next/link";
import TaskIcon from "../../task-icon";

export interface MobileTaskCardProps {
  task: Task;
  toggleComplete: () => void;
}

export function MobileTaskCard({ task, toggleComplete }: MobileTaskCardProps) {
  const color = useColorModeValue("blackAlpha.800", "whiteAlpha.800");
  return (
    <Flex alignItems="center" my={4}>
      <Checkbox
        size="lg"
        isChecked={task.complete}
        onChange={toggleComplete}
        mx={8}
      />
      <LinkBox flex="1" pr={8}>
        <Link href={`/task/${task.id}`}>
          <LinkOverlay cursor="pointer">
            <Stack py={8}>
              <Flex alignItems="center">
                <TaskIcon task={task} w={6} h={6} mr="10px" color={color} />
                <Box>
                  <Heading
                    textAlign="left"
                    fontSize="18px"
                    fontWeight="semibold"
                    textDecor={task.complete ? "line-through" : undefined}
                    color={color}
                  >
                    {task.title}
                  </Heading>
                </Box>
              </Flex>
              {task.description && (
                <Text
                  fontSize="14px"
                  fontWeight="light"
                  textAlign="left"
                  textOverflow="ellipsis"
                  noOfLines={2}
                  textDecor={task.complete ? "line-through" : undefined}
                >
                  {task.description}
                </Text>
              )}
            </Stack>
          </LinkOverlay>
        </Link>
      </LinkBox>
    </Flex>
  );
}

export default MobileTaskCard;
