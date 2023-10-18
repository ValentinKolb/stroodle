import {Box, Group, ThemeIcon, Title, UnstyledButton} from '@mantine/core';
import classes from './index.module.css';
import SideNav from "./SideNav";
import ActionSearch from "./ActionSearch";
import {IconMenu2, IconMenuDeep} from "@tabler/icons-react";
import {Outlet} from "react-router-dom";
import {useSideMenuBar} from "../../../lib/uiUtil.tsx";


export default function Navigation() {

    const {hideSideMenuBar, toggleSideMenuBar} = useSideMenuBar()

    return <div className={classes.container}>
        {/* Desktop Menu */}
        <header className={classes.header}>
            <UnstyledButton onClick={toggleSideMenuBar}>
                <Group gap={"xs"}>
                    <ThemeIcon
                        aria-label={"Toggle sidebar"}
                        variant="transparent"
                    >
                        {hideSideMenuBar ? <IconMenu2/> : <IconMenuDeep/>}
                    </ThemeIcon>
                    <Title c={"blue"} size={'xl'}>
                        Stroodle.me
                    </Title>
                </Group>
            </UnstyledButton>
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