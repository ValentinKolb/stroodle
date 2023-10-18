import {ActionIcon, Loader, rem, ThemeIcon, UnstyledButton,} from '@mantine/core';
import {IconChevronLeft, IconChevronRight, IconForklift, IconPlus, IconUser,} from '@tabler/icons-react';
import classes from './index.module.css';
import {ProjectModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {ClientResponseError} from "pocketbase";
import {useQuery} from "@tanstack/react-query";
import UserAvatar from "../../../UserAvatar.tsx";
import {useMobile, useSideMenuBar} from "../../../../lib/uiUtil.tsx";
import {CustomLink} from "../Custom/CustomLink.tsx";
import ProjectLink from "./ProjectLink";

export default function SideNav() {

    const {pb, user} = usePB()

    const {closeSideMenuBar} = useSideMenuBar()

    const isMobile = useMobile()

    const projectQuery = useQuery<ProjectModel[], ClientResponseError>({
        queryKey: ['projects'],
        queryFn: async () => await pb.collection('projects').getFullList<ProjectModel>()
    })

    return (
        <nav className={classes.navbar}>
            <div className={classes.projectsHeader}>
                <ThemeIcon variant="transparent" className={classes.projectIcon}>
                    <IconForklift/>
                </ThemeIcon>

                <CustomLink to={'/project'} closeSideBar={isMobile} className={classes.projectTitle}>
                    Projekte
                </CustomLink>

                <CustomLink to={"/project/new"}>
                    <ActionIcon
                        className={classes.createProjectBtn}
                        variant="default" size={18}
                    >
                        <IconPlus style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
                    </ActionIcon>
                </CustomLink>
            </div>

            <div className={"scrollbar"}>
                {
                    projectQuery.isPending ?
                        <Loader size={"sm"} ml={"md"} mt={"md"}/>
                        :
                        (projectQuery.data || []).map((project) => (
                            <ProjectLink
                                key={project.id}
                                project={project}
                            />)
                        )
                }
            </div>

            <div className={classes.desktopFooter}>
                <UnstyledButton
                    aria-label={"Toggle sidebar"}
                    onClick={closeSideMenuBar}
                    variant="transparent"
                    size={"xl"}
                >
                    <IconChevronLeft/>
                </UnstyledButton>

                <CustomLink to={"/account"}>
                    <UserAvatar user={user!} size={"sm"}/>
                </CustomLink>
            </div>

            <div className={classes.mobileFooter}>
                <CustomLink to={"/project"} closeSideBar={isMobile} aria-label={"all projects"}>
                    <ThemeIcon
                        variant="transparent"
                        size={"xl"}
                    >
                        <IconForklift/>
                    </ThemeIcon>
                </CustomLink>
                <CustomLink to={"/project/new"} aria-label={"new project"}>
                    <ThemeIcon
                        variant="transparent"
                        size={"xl"}
                    >
                        <IconPlus/>
                    </ThemeIcon>
                </CustomLink>

                <CustomLink to={"/account"} closeSideBar={isMobile} aria-label={"project"}>
                    <ThemeIcon
                        variant="transparent"
                        size={"xl"}
                    >
                        <IconUser/>
                    </ThemeIcon>
                </CustomLink>

                <ActionIcon
                    aria-label={"toggle sidebar"}
                    onClick={closeSideMenuBar}
                    variant="transparent"
                    size={"xl"}
                >
                    <IconChevronRight/>
                </ActionIcon>
            </div>
        </nav>
    )
}