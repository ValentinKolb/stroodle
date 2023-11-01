import {ProjectModel} from "../../../../lib/models.ts";
import {Outlet, Route, Routes, useLocation} from "react-router-dom";
import NotFound from "../../../../components/NotFound.tsx";
import TaskList from "./_view";
import EditTask from "./:taskId";
import {useMediaQuery} from "@mantine/hooks";
import classes from "./index.module.css";
import {IconMoodWink2} from "@tabler/icons-react";
import {ThemeIcon, Title} from "@mantine/core";

export default function Tasks({project}: { project: ProjectModel }) {

    const location = useLocation()

    const largeDisplay = useMediaQuery('(min-width: 1600px)')

    if (largeDisplay) {
        return <>
            <div className={classes.splitViewContainer}>
                <div>
                    <TaskList project={project}/>
                </div>
                <div>
                    <Routes location={location}>
                        <Route path={":taskId"} element={<EditTask project={project}/>}/>
                        <Route index element={
                            <div className={"center"}>
                                <ThemeIcon
                                    variant={"transparent"}
                                    c={"dimmed"}
                                    size={"xl"}
                                >
                                    <IconMoodWink2/>
                                </ThemeIcon>
                                <Title order={2} c={"dimmed"}>Wähle (d)eine Aufgabe aus </Title>
                            </div>
                        }/>
                    </Routes>
                </div>
            </div>


        </>
    }

    return <>
        <Routes location={location}>
            <Route index element={<TaskList project={project}/>}/>
            <Route path={":taskId"} element={<EditTask project={project}/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Outlet/>
    </>
}