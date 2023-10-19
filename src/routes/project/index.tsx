import {useQuery} from "@tanstack/react-query";
import {ProjectModel} from "../../lib/models.ts";
import {usePB} from "../../lib/pocketbase.tsx";
import Header from "../../components/layout/Header";

import classes from './index.module.css';
import ProjectIcon from "../../components/ProjectIcon.tsx";
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import {Loader} from "@mantine/core";

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

        <div className={classes.content}>

            {query.data?.map((project) => (

                <CustomLink
                    to={`/project/${project.id}`}
                    key={project.id}
                    className={classes.projectLink}
                >

                    <ProjectIcon project={project}/>

                    <div className={classes.projectName}>
                        {project.name}
                    </div>

                </CustomLink>

            ))}

            {query.isPending && <Loader size={"sm"} ml={"md"} mt={"md"}/>}

            {query.data?.length === 0 &&
                <div className={"center"}>
                    Es wurden noch keine Projekte erstellt. Erstelle ein neues Projekt.
                </div>
            }
        </div>
    </div>
}