import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { type Task } from "@prisma/client";
import { useRef } from "react";
import { api } from "~/utils/api";

export interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onDelete?: () => void;
}

export function DeleteTaskDialog({
  isOpen,
  onClose,
  task,
  onDelete,
}: DeleteTaskDialogProps) {
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const util = api.useContext();

  const mutation = api.task.deleteTaskById.useMutation({
    onMutate: async () =>
      await util.task.findAllTasksForAccount.cancel(task.accountId),
    onSettled: async () => {
      await util.task.findAllTasksForAccount.invalidate(task.accountId);
      onClose();
      onDelete && onDelete();
    },
  });

  const handleDelete = () => {
    mutation.mutate(task.id);
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Task
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default DeleteTaskDialog;
