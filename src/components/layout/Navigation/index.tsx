import {Box, Group, ThemeIcon, Title, UnstyledButton} from '@mantine/core';
import classes from './index.module.css';
import SideNav from "./SideNav";
import ActionSearch from "./ActionSearch";
import {IconMenu2, IconMenuDeep} from "@tabler/icons-react";
import {Outlet} from "react-router-dom";
import {useSideMenuBar} from "../../../lib/uiUtil.tsx";
import NotificationSubscription from "./NotificationSubscription";
import {CustomLink} from "./Custom/CustomLink.tsx";


export default function Navigation() {

    const {hideSideMenuBar, toggleSideMenuBar} = useSideMenuBar()

    return <div className={classes.container}>
        <NotificationSubscription/>

        {/* Desktop Menu */}
        <header className={classes.header}>
            <Group gap={"xs"}>
                <UnstyledButton onClick={toggleSideMenuBar}>
                    <Group>
                        <ThemeIcon
                            aria-label={"Toggle sidebar"}
                            variant="transparent"
                        >
                            {hideSideMenuBar ? <IconMenu2/> : <IconMenuDeep/>}
                        </ThemeIcon>
                    </Group>
                </UnstyledButton>
                <CustomLink to={"/project"}>
                    <Title c={"blue"} size={'xl'}>
                        Stroodle.me
                    </Title>
                </CustomLink>
            </Group>
            <ActionSearch/>
        </header>

        {/* Body */}
        {
            <div className={classes.contentContainer}>
                <Box mod={{closed: hideSideMenuBar}} className={classes.sideNav}>
                    <SideNav/>
                </Box>
                <Box mod={{closed: hideSideMenuBar}} className={classes.content}>
                    {/* Content */}
                    <Outlet/>
                </Box>
            </div>
        }
    </div>
}