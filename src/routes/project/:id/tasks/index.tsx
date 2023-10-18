import {IconPlus, IconSquare, IconSquareCheck, IconSquareFilled} from "@tabler/icons-react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ClientResponseError} from "pocketbase";
import {ActionIcon, Affix, Button, Group, List, Modal, Stack, Text, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import {DateInput} from "@mantine/dates";
import classes from "./index.module.css";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {queryClient} from "../../../../main.tsx";
import {ProjectModel, TaskModel} from "../../../../lib/models.ts";
import {formatTaskDate} from "../../../../lib/dateUtil.ts";

const CreateTaskForm = ({projectId, close}: { projectId: string, close: () => void }) => {

    const {pb} = usePB()

    const formValues = useForm({
        initialValues: {
            name: '',
            description: '',
            deadline: null as Date | null
        }
    })

    const createTaskMutation = useMutation({
        mutationFn: async () => {
            await pb.collection('tasks').create({
                name: formValues.values.name,
                description: formValues.values.description,
                deadline: formValues.values.deadline,
                done: false,
                project: projectId
            })
        },
        onSuccess: () => {
            formValues.reset()
            queryClient.invalidateQueries({queryKey: ["project", projectId, "tasks"]})
            close()
        }
    })

    return <>
        <form onSubmit={formValues.onSubmit(() => createTaskMutation.mutate())}>
            <Stack gap={"sm"}>
                <TextInput
                    label={"Name"}
                    placeholder={"Name des Todos"}
                    required
                    {...formValues.getInputProps('name')}
                />

                <Textarea
                    label={"Beschreibung"}
                    placeholder={"Beschreibung des Todos"}
                    autosize
                    minRows={1}
                    maxRows={5}
                    {...formValues.getInputProps('description')}
                />

                <DateInput
                    label="Deadline"
                    placeholder="Dealine des Todos"
                    {...formValues.getInputProps('deadline')}
                />

                <Button
                    type={"submit"}
                    loading={createTaskMutation.isPending}
                    disabled={formValues.values.name.length === 0}
                >
                    Todo erstellen
                </Button>
            </Stack>
        </form>
    </>

}

export default function Tasks({project}: { project: ProjectModel }) {

    const {pb} = usePB()

    const [toggledTask, setToggledTask] = useState<string>("")
    const [showCreateTaskForm, setShowCreateTaskForm] = useState<boolean>(false)

    const taskQuery = useQuery<TaskModel[], ClientResponseError>({
        queryKey: ["project", project.id, "tasks"],
        queryFn: async () => {
            return await pb.collection('tasks').getFullList<TaskModel>()
        }
    })

    const toggleTaskMutation = useMutation({
        mutationFn: async ({taskId, done}: { taskId: string, done: boolean }) => {
            setToggledTask(taskId)
            await pb.collection('tasks').update(taskId, {done})
        },
        onSuccess: () => {
            taskQuery.refetch()
        },
        onSettled: () => {
            setToggledTask("")
        }
    })

    useEffect(() => {
        pb.collection("tasks").subscribe<TaskModel>('*', async (data) => {
            if (data.record.project === project.id) {
                taskQuery.refetch()
            }
        })
        return () => {
            pb.collection('tasks').unsubscribe('*')
        }
    }, [pb, project.id, taskQuery])

    return <div className={classes.container}>

        <Modal
            title={"Neues Todo erstellen"}
            opened={showCreateTaskForm} onClose={() => setShowCreateTaskForm(false)}
        >
            <CreateTaskForm projectId={project.id} close={() => setShowCreateTaskForm(false)}/>
        </Modal>

        <Affix position={{bottom: 20, right: 20}}>
            <ActionIcon
                aria-label={"Create task"}
                onClick={() => {
                    setShowCreateTaskForm(!showCreateTaskForm)
                }}
            >
                <IconPlus/>
            </ActionIcon>
        </Affix>


        <List className={"scrollbar"}>
            {taskQuery.data?.map((task) => (
                <List.Item
                    key={task.id}
                    icon={
                        <ActionIcon
                            aria-label={task.done ? "Set to undone" : "Set to done"}
                            onClick={() => toggleTaskMutation.mutate({taskId: task.id, done: !task.done})}
                            variant={"transparent"}
                        >
                            {toggledTask === task.id ? <IconSquareFilled/> :
                                task.done ? <IconSquareCheck/> : <IconSquare/>
                            }
                        </ActionIcon>
                    }
                >
                    <Group>
                        <Text fw={500}>
                            {task.name}
                        </Text>

                        <Text c={"dimmed"}>
                            {task.description}
                        </Text>

                        {task.deadline && <Text c={"dimmed"} td={task.done ? "line-through" : undefined}>
                            {formatTaskDate(new Date(task.deadline))}
                        </Text>}
                    </Group>
                </List.Item>
            ))}
        </List>
    </div>
}