import {ProjectModel} from "../../../../lib/models.ts";
import {Outlet, Route, Routes, useLocation} from "react-router-dom";
import NotFound from "../../../../components/NotFound.tsx";
import TaskList from "./_view";
import EditTask from "./:taskId";


export default function Tasks({project}: { project: ProjectModel }) {

    const location = useLocation()

    return <>
        <Routes location={location}>
            <Route index element={<TaskList project={project}/>}/>
            <Route path={":taskId"} element={<EditTask project={project}/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Outlet/>
    </>
}