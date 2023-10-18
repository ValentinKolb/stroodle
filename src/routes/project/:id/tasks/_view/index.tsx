import {IconPlus, IconSquare, IconSquareCheck} from "@tabler/icons-react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ClientResponseError} from "pocketbase";
import {ActionIcon, Button, Modal, Stack, Text, Tooltip} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useState} from "react";
import {DateInput} from "@mantine/dates";
import classes from "./index.module.css";
import {usePB} from "../../../../../lib/pocketbase.tsx";
import {queryClient} from "../../../../../main.tsx";
import TextEditor from "../../../../../components/input/Editor";
import {ProjectModel, TaskModel} from "../../../../../lib/models.ts";
import Task from "./Task.tsx";

const CreateTaskForm = ({projectId, close}: { projectId: string, close: () => void }) => {

    const {pb, user} = usePB()

    const formValues = useForm({
        initialValues: {
            description: '',
            deadline: null as Date | null
        }
    })

    const createTaskMutation = useMutation({
        mutationFn: async () => {
            await pb.collection('tasks').create({
                description: formValues.values.description,
                deadline: formValues.values.deadline,
                done: false,
                project: projectId,
                author: user!.id
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
                <TextEditor
                    maxHeight={300}
                    label={"Beschreibung"}
                    placeholder={"Beschreibung des Todos"}
                    value={formValues.values.description}
                    onChange={v => formValues.setFieldValue('description', v)}
                />

                <DateInput
                    label="Deadline"
                    placeholder="Dealine des Todos"
                    {...formValues.getInputProps('deadline')}
                />

                <Button
                    type={"submit"}
                    loading={createTaskMutation.isPending}
                    disabled={formValues.values.description.length === 0}
                >
                    Aufgabe erstellen
                </Button>
            </Stack>
        </form>
    </>

}

export default function TaskList({project}: { project: ProjectModel }) {

    const {pb, useSubscription} = usePB()

    const [showDone, setShowDone] = useState<boolean>(false)

    const [showCreateTaskForm, setShowCreateTaskForm] = useState<boolean>(false)

    const taskQuery = useQuery<TaskModel[], ClientResponseError>({
        queryKey: ["project", project.id, "tasks"],
        queryFn: async () => {
            return await pb.collection('tasks').getFullList<TaskModel>({
                filter: `project="${project.id}"`,
            })
        }
    })

    useSubscription<TaskModel>({
        idOrName: "tasks",
        callback: async (data) => {
            if (data.record.project === project.id) {
                taskQuery.refetch()
            }
        }
    }, [pb, project.id, taskQuery])

    const tasks = taskQuery.data?.filter((task) => showDone ? true : !task.done) ?? []

    return <div className={classes.container}>

        <Modal
            title={"Neues Todo erstellen"}
            opened={showCreateTaskForm} onClose={() => setShowCreateTaskForm(false)}
        >
            <CreateTaskForm projectId={project.id} close={() => setShowCreateTaskForm(false)}/>
        </Modal>

        <div className={classes.affix}>
            <Tooltip label={`${showDone ? "Undone" : "Done"} tasks anzeigen`} position={"left"}>
                <ActionIcon
                    aria-label={`${showDone ? "Nur offene" : "Alle"} Todos anzeigen`}
                    variant={"light"}
                    onClick={() => {
                        setShowDone(!showDone)
                    }}
                >
                    {showDone ? <IconSquare/> : <IconSquareCheck/>}
                </ActionIcon>
            </Tooltip>

            <Tooltip label={`Neues Todo`} position={"left"}>
                <ActionIcon
                    aria-label={"Create task"}
                    variant={"light"}
                    onClick={() => {
                        setShowCreateTaskForm(!showCreateTaskForm)
                    }}
                >
                    <IconPlus/>
                </ActionIcon>
            </Tooltip>
        </div>

        {
            tasks.length === 0 &&
            <div className={"center"}>
                <Text c={"dimmed"}>Keine Aufgaben vorhanden. Erstelle jetzt eine!</Text>
            </div>
        }

        <div className={"scrollbar"}>
            <ul className={classes.list}>
                {tasks.map((task) => (
                    <Task task={task} key={task.id}/>
                ))}
            </ul>
        </div>
    </div>
}