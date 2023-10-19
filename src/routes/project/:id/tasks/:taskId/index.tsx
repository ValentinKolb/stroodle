import {ProjectModel, TaskModel} from "../../../../../lib/models.ts";
import {useParams} from "react-router-dom";
import {usePB} from "../../../../../lib/pocketbase.tsx";
import {useQuery} from "@tanstack/react-query";
import {Loader} from "@mantine/core";
import NotFound from "../../../../../components/NotFound.tsx";
import TaskEditor from "./TaskEditor.tsx";

export default function EditTask({project}: { project: ProjectModel }) {
    const params = useParams()
    const {pb} = usePB()

    const taskId = params.taskId as string

    const taskQuery = useQuery({
        queryKey: ["project", project.id, "tasks", taskId],
        queryFn: async () => {
            return await pb.collection('tasks').getOne<TaskModel>(taskId)
        },
        enabled: !!taskId
    })

    if (taskQuery.isLoading) {
        return <Loader/>
    }

    if (taskQuery.isError) {
        return <NotFound text={"Aufgabe nicht gefunden"}/>
    }

    return <TaskEditor project={project} task={taskQuery.data!}/>
}