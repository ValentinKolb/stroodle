import {ProjectModel, TaskModel} from "../../../../lib/models.ts";
import {Outlet, Route, Routes, useLocation, useParams} from "react-router-dom";
import NotFound from "../../../../components/NotFound.tsx";
import TaskList from "./_view";
import {useQuery} from "@tanstack/react-query";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {Loader} from "@mantine/core";
import EditTask from "./:taskId";

const _Tasks = ({project}: { project: ProjectModel }) => {
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

    return <EditTask project={project} task={taskQuery.data!}/>
}

export default function Tasks({project}: { project: ProjectModel }) {

    const location = useLocation()

    return <>
        <Routes location={location}>
            <Route index element={<TaskList project={project}/>}/>
            <Route path={":taskId"} element={<_Tasks project={project}/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Outlet/>
    </>
}