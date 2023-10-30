import {useQuery} from "@tanstack/react-query";
import {ProjectModel} from "../../lib/models.ts";
import {usePB} from "../../lib/pocketbase.tsx";
import Header from "../../components/layout/Header";

import classes from './index.module.css';
import ProjectIcon from "../../components/ProjectIcon.tsx";
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import {Loader, Text, ThemeIcon} from "@mantine/core";
import {IconArrowDown} from "@tabler/icons-react";
import {BrandIconChat, BrandIconTask} from "../../lib/icons.tsx";
import Html from "../../components/Html/index.tsx";

export default function ProjectOverview() {

    const {pb} = usePB()

    const query = useQuery({
        queryKey: ['all', 'projects'],
        queryFn: async () => {
            return await pb.collection('projects').getFullList<ProjectModel>()
        }
    })

    return <div className={classes.container}>
        <Header
            label={"Dashboard"}
            href={`/project`}
        />

        {query.isPending && <Loader size={"sm"} ml={"md"} mt={"md"}/>}

        {query.data?.length === 0 &&
            <Text className={"center"} c={"dimmend"}>
                Es wurden noch keine Projekte erstellt. Erstelle ein neues Projekt.
            </Text>
        }

        <div className={`scrollbar`}>
            <div className={`${classes.content}`}>
                {query.data?.map((project) => (

                    <div
                        key={project.id}
                        className={classes.projectContainer}
                    >

                        <ProjectIcon project={project}/>

                        <CustomLink
                            to={`/project/${project.id}`}
                            className={classes.projectName}
                        >
                            {project.name}
                        </CustomLink>

                        <Html className={"one-line"}>
                            {project.description || ""}
                        </Html>

                        <div className={classes.btnGroup}>
                            <ThemeIcon
                                className={classes.projectButton}
                                variant={"light"}
                            >
                                <IconArrowDown/>
                            </ThemeIcon>

                            <CustomLink className={classes.icon} to={`/project/${project.id}/messages`}>
                                <BrandIconChat/>
                            </CustomLink>

                            <CustomLink className={classes.icon} to={`/project/${project.id}/tasks`}>
                                <BrandIconTask/>
                            </CustomLink>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}