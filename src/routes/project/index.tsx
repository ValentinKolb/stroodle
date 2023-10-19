import {useQuery} from "@tanstack/react-query";
import {ProjectModel, UserModel} from "../../lib/models.ts";
import {usePB} from "../../lib/pocketbase.tsx";
import Header from "../../components/layout/Header";
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import classes from "./:id/index.module.css";
import ProjectIcon from "../../components/ProjectIcon.tsx";
import {Avatar, ThemeIcon, Tooltip} from "@mantine/core/lib";
import {IconPencil} from "@tabler/icons-react";
import UserAvatar from "../../components/UserAvatar.tsx";

export default function ProjectOverview() {

    const {pb} = usePB()

    const projectsQuery = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            return await pb.collection('projects').getList<ProjectModel>(1, 100, {
                expand: 'members'
            })
        }
    })

    return <>
         <Header
                    label={projectQuery.data.name}
                    href={`/project/${projectId}`}
                    leftSection={
                        <CustomLink replace to={"e/icon"}>
                            <div className={classes.iconContainer}>
                                <ProjectIcon
                                    project={projectQuery.data}
                                />
                                <ThemeIcon
                                    className={classes.iconEditBtn}
                                    size={"xs"}
                                    variant={"filled"}
                                    color={"blue"}
                                    radius={"xl"}
                                >
                                    <IconPencil/>
                                </ThemeIcon>
                            </div>
                        </CustomLink>
                    }
                    rightSection={
                        <Avatar.Group>
                            {projectQuery.data.expand!.members!.slice(0, showNoOfMembers).map((member: UserModel) =>
                                <Tooltip label={`@${member.username}`} key={member.id}>
                                    <UserAvatar user={member} color={"blue"}/>
                                </Tooltip>
                            )}

                            {projectQuery.data.expand!.members!.length > showNoOfMembers &&
                                <Tooltip
                                    label={`${projectQuery.data.expand!.members!.length - showNoOfMembers} weitere Teilnehmende`}>
                                    <Avatar
                                        color={"blue"}>+{projectQuery.data.expand!.members!.length - showNoOfMembers}</Avatar>
                                </Tooltip>
                            }
                        </Avatar.Group>
                    }
                />
    </>
}