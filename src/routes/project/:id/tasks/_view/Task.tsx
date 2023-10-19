import {TaskModel} from "../../../../../lib/models.ts";
import {usePB} from "../../../../../lib/pocketbase.tsx";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {queryClient} from "../../../../../main.tsx";
import classes from "./task.module.css";
import {ActionIcon, Text} from "@mantine/core";
import {IconSquare, IconSquareCheck, IconSquareFilled, IconTrash} from "@tabler/icons-react";
import {CustomLink} from "../../../../../components/layout/Navigation/Custom/CustomLink.tsx";
import Html from "../../../../../components/Html";
import {formatTaskDate} from "../../../../../lib/dateUtil.ts";

export default function Task({task}: { task: TaskModel }) {

    const {pb} = usePB()

    const [taskIsUpdating, setTaskIsUpdating] = useState(false)

    const toggleTaskMutation = useMutation({
        mutationFn: async () => {
            setTaskIsUpdating(true)
            await pb.collection('tasks').update(task.id, {done: !task.done})
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["project", task.project, "tasks"]}),
        onSettled: () => setTaskIsUpdating(false)
    })

    const deleteTaskMutation = useMutation({
        mutationFn: async () => {
            await pb.collection('tasks').delete(task.id)
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["project", task.project, "tasks"]})
    })

    return <>
        <li className={classes.container}>
            <ActionIcon
                aria-label={task.done ? "Set to undone" : "Set to done"}
                onClick={() => toggleTaskMutation.mutate()}
                variant={"transparent"}
            >
                {
                    taskIsUpdating ? <IconSquareFilled/> :
                        task.done ? <IconSquareCheck/> : <IconSquare/>
                }
            </ActionIcon>

            <CustomLink
                className={`${classes.link}`}
                to={`/project/${task.project}/tasks/${task.id}`}
                replace={false}
            >
                <Html className={`${classes.description} one-line`}>
                    {task.description}
                </Html>
            </CustomLink>

            {task.deadline &&
                <Text className={classes.date} data-done={task.done ? "line-through" : undefined}>
                    {formatTaskDate(new Date(task.deadline))}
                </Text>
            }

            <ActionIcon
                aria-label={"delete"}
                onClick={() => deleteTaskMutation.mutate()}
                variant={"transparent"}
                data-add-margin={!task.deadline}
                className={classes.delete}
                size={"xs"}
            >
                <IconTrash/>
            </ActionIcon>
        </li>
    </>
}

