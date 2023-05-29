/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CreatableSelect, type PropsValue } from "chakra-react-select";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { selectedAccountAtom } from "../accounts-dropdown";
import { PlusIcon } from "../icons";
import { api } from "~/utils/api";
import { type AddPrerequisiteSchema } from "~/server/api/routers/task";

type CreatePrerequisiteModalProps = {
  dependentTaskId: string;
};

/*
 **  This is copied code from create tasks modal
 **  TODO: deduplicate common areas
 */
export default function CreatePrerequisiteModal({
  dependentTaskId,
}: CreatePrerequisiteModalProps) {
  const [selectedAccount] = useAtom(selectedAccountAtom);
  const userId = selectedAccount?.id;
  const [tab, setTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isError, setIsError] = useState(false);
  const [labels, setLabels] = useState<PropsValue<string>>([]); // controlled state for label since multi-select is not compatible with react-hook-form
  const { register, handleSubmit, reset } = useForm<AddPrerequisiteSchema>();
  const utils = api.useContext();

  const resetForm = () => {
    setLabels([]);
    reset();
  };

  const mutation = api.task.addPrerequisite.useMutation({
    onSuccess: async (_task) => {
      setIsError(false);
      await utils.task.findAllDependeesForTask.invalidate(userId);
      await utils.task.findAllDependeesForTask.invalidate(dependentTaskId);
      onClose();
      resetForm();
    },
    onError: (error) => {
      setIsError(true);
      console.log(error);
    },
  });

  return (
    <>
      <Tooltip placement="top" label="Add prerequisite" openDelay={500}>
        <IconButton
          aria-label="add prerequisite task"
          icon={<PlusIcon />}
          variant="ghost"
          size="lg"
          onClick={onOpen}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={handleSubmit(({ prerequisite }) =>
            mutation.mutate({
              dependentTaskId,
              prerequisite: {
                ...prerequisite,
                taskType: prerequisite.taskType || "custom",
                accountId: userId ?? "",
                // @ts-expect-error TODO: fix this
                labels: labels.map((label) => label.value),
              },
            })
          )}
        >
          <ModalHeader pb={0}>Add a Prerequisite</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0}>
            <Tabs
              variant="line"
              align="center"
              isLazy
              index={tab}
              onChange={(index) => {
                setTab(index);
                resetForm();
              }}
            >
              <TabList>
                <Tab>Quick</Tab>
                <Tab>Advanced</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {/* TODO: make this a smart select component */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="taskTitle">Task</FormLabel>
                    <Input
                      id="taskTitle"
                      placeholder="Example: Complete Cook's Assistant"
                      required
                      {...register("prerequisite.title")}
                    />
                  </FormControl>
                </TabPanel>
                <TabPanel display="flex" flexDir="column" gap={4}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="taskTitle">Title</FormLabel>
                    <Input
                      id="taskTitle"
                      placeholder="Example: Complete Cook's Assistant"
                      required
                      {...register("prerequisite.title")}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="taskDescription">Description</FormLabel>
                    <Textarea
                      id="taskDescription"
                      placeholder="Example: Bake that dude a cake!"
                      {...register("prerequisite.description")}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="taskType">Task Type</FormLabel>
                    <Select
                      id="taskType"
                      placeholder="Example: Quest"
                      {...register("prerequisite.taskType")}
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
                    <CreatableSelect
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
                </TabPanel>
              </TabPanels>
            </Tabs>
            {isError && (
              <Text color="red">There was a problem creating your task.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
