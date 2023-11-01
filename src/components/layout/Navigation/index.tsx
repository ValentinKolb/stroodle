import {Box, Group, Image, Text, ThemeIcon, UnstyledButton} from '@mantine/core';
import classes from './index.module.css';
import SideNav from "./SideNav";
import ActionSearch from "./ActionSearch";
import {IconChevronLeft, IconChevronRight, IconMenuDeep} from "@tabler/icons-react";
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

                    {hideSideMenuBar ?
                        <Group gap={0}>
                            <ThemeIcon
                                aria-label={"Toggle sidebar"}
                                variant="transparent"
                                size={"md"}
                                color={"teal"}
                            >
                                <IconMenuDeep/>
                            </ThemeIcon>

                            <ThemeIcon
                                aria-label={"Toggle sidebar"}
                                variant="transparent"
                                size={"md"}
                                color={"teal"}
                            >
                                <IconChevronRight/>
                            </ThemeIcon>
                        </Group>
                        :
                        <Group gap={0}>
                            <ThemeIcon
                                aria-label={"Toggle sidebar"}
                                variant="transparent"
                                size={"md"}
                                color={"teal"}
                            >
                                <IconMenuDeep/>
                            </ThemeIcon>

                            <ThemeIcon
                                aria-label={"Toggle sidebar"}
                                variant="transparent"
                                size={"md"}
                                color={"teal"}
                            >
                                <IconChevronLeft/>
                            </ThemeIcon>

                        </Group>
                    }
                </UnstyledButton>
                <CustomLink to={"/project"}>
                    <Group gap={"xs"}>
                        <Image
                            h={20}
                            w={20}
                            src={"/logo-square.svg"}
                        />
                        <Text
                            fw={800}
                            size={'xl'}
                            variant="gradient"
                            gradient={{from: 'blue', to: 'teal', deg: 90}}
                        >
                            Stroodle.me
                        </Text>
                    </Group>
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