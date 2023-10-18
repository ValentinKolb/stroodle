import {useQuery} from "@tanstack/react-query";
import {Avatar, LoadingOverlay, Modal, Text, ThemeIcon, ThemeIconProps, Tooltip} from "@mantine/core";
import classes from "./index.module.css";
import {IconEye, IconPencil,} from "@tabler/icons-react";
import {ClientResponseError} from "pocketbase";
import {useMediaQuery} from "@mantine/hooks";
import {Outlet, Route, Routes, useLocation, useParams} from "react-router-dom";
import Messages from "./messages";
import Tasks from "./tasks";
import Index from "./_view";
import {useMobile} from "../../../lib/uiUtil.tsx";
import {BrandIconChat, BrandIconNotes, BrandIconTask} from "../../../lib/icons.tsx";
import {usePB} from "../../../lib/pocketbase.tsx";
import {ProjectModel, UserModel} from "../../../lib/models.ts";
import NotFound from "../../../components/NotFound.tsx";
import Header from "../../../components/layout/Header";
import ProjectIcon from "../../../components/ProjectIcon.tsx";
import UserAvatar from "../../../components/UserAvatar.tsx";
import EditProjectEmoji from "./e/Emoji.tsx";
import EditProjectMembers from "./e/Members.tsx";
import EditProjectDescription from "./e/Description.tsx";
import {CustomLink} from "../../../components/layout/Navigation/Custom/CustomLink.tsx";
import {useCustomNavigate} from "../../../components/layout/Navigation/Custom/util.ts";


/**
 * This shows the navigation links for the project page.
 */
const NavLinks = ({projectId}: { projectId: string }) => {

    const isMobile = useMobile()

    const links = [
        {
            label: "Übersicht",
            path: "",
            icon: (props: ThemeIconProps) => <ThemeIcon variant={"transparent"} {...props}><IconEye/></ThemeIcon>,
            color: "blue"
        },
        {label: "Nachrichten", path: "messages", icon: BrandIconChat, color: "messageColor"},
        {label: "Aufgaben", path: "tasks", icon: BrandIconTask, color: "taskColor"},
        {label: "Notizen", path: "notes", icon: BrandIconNotes, color: "noteColor"},
    ]

    return <>
        <div className={classes.navLinkContainer}>
            {
                links.map(link => (
                    <CustomLink
                        className={classes.navLink}
                        to={`/project/${projectId}/${link.path}`}
                        key={link.path}
                    >
                        {({isActive}) => (
                            <>
                                <link.icon size={isMobile ? "md" : "sm"} color={isActive ? link.color : "gray"}/>
                                {!isMobile &&
                                    <Text size={"xs"} c={isActive ? link.color : ""}>
                                        {link.label}
                                    </Text>
                                }
                            </>
                        )}
                    </CustomLink>
                ))
            }
        </div>
    </>
}

export default function Project() {

    const {pb} = usePB()
    const {projectId} = useParams() as { projectId: string }
    const location = useLocation()
    const navigate = useCustomNavigate()
    const close = () => navigate(`/project/${projectId}`)

    const isMobile = useMediaQuery(`(max-width: 576px)`)
    const showNoOfMembers = isMobile ? 2 : 5

    const projectQuery = useQuery<ProjectModel, ClientResponseError>({
        queryKey: ['project', projectId],
        queryFn: async () => {
            return await pb.collection('projects').getOne<ProjectModel>(projectId, {expand: 'members'})
        },
        retry: false
    })

    if (projectQuery.isError) {
        return <NotFound text={"Das Project konnte nicht gefunden werden."}/>
    }

    if (projectQuery.isPending || projectQuery.data === undefined) {
        return <LoadingOverlay/>
    }

    return (
        <>
            <div className={classes.container}>
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

                <NavLinks projectId={projectId}/>

                <Routes location={location}>
                    <Route index element={<Index project={projectQuery.data}/>}/>
                    <Route path="tasks" element={<Tasks project={projectQuery.data}/>}/>
                    <Route path="messages" element={<Messages project={projectQuery.data}/>}/>

                    <Route path="e/desc" element={
                        <Modal centered={isMobile} opened onClose={close} withCloseButton={false}>
                            <EditProjectDescription project={projectQuery.data}/>
                        </Modal>
                    }/>

                    <Route path="e/icon" element={
                        <Modal size={"sm"} centered={isMobile} opened onClose={close} withCloseButton={false}
                               lockScroll={false}>
                            <EditProjectEmoji project={projectQuery.data}/>
                        </Modal>
                    }/>

                    <Route path="e/members" element={
                        <Modal size={"sm"} centered={isMobile} opened onClose={close} withCloseButton={false}>
                            <EditProjectMembers project={projectQuery.data}/>
                        </Modal>
                    }/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
                <Outlet/>
            </div>
        </>
    )
}