import {useState} from 'react';
import {Collapse, Group, rem, Text, UnstyledButton} from '@mantine/core';
import {IconChevronRight} from '@tabler/icons-react';
import classes from './index.module.css';
import {ProjectModel} from "../../../../../lib/models.ts";
import ProjectIcon from "../../../../ProjectIcon.tsx";
import {CustomLink} from "../../Custom/CustomLink.tsx";
import {useMobile} from "../../../../../lib/uiUtil.tsx";

export default function ProjectLink({project}: { project: ProjectModel }) {
    const [opened, setOpened] = useState(false);
    const isMobile = useMobile()

    return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group justify="space-between" gap={"xs"} style={{width: "100%"}}>
                    <ProjectIcon
                        radius="sm" size="sm"
                        project={project}
                    />
                    <Text className={classes.projectName} truncate>{project.name}</Text>
                    <IconChevronRight
                        className={classes.chevron}
                        stroke={1.5}
                        style={{
                            marginLeft: "auto",
                            width: rem(16),
                            height: rem(16),
                            transform: opened ? 'rotate(-90deg)' : 'none',
                        }}
                    />
                </Group>
            </UnstyledButton>
            <Collapse in={opened}>
                {[
                    {
                        label: 'Übersicht',
                        link: `/project/${project.id}`
                    },
                    {
                        label: 'Nachrichten',
                        link: `/project/${project.id}/messages`
                    },
                    {
                        label: 'Aufgaben',
                        link: `/project/${project.id}/tasks`
                    }
                ].map((link) => (
                    <Text
                        component={CustomLink}
                        className={classes.link}
                        to={link.link}
                        key={link.label}
                        closeSideBar={isMobile}
                    >
                        {link.label}
                    </Text>
                ))}
            </Collapse>
        </>
    )
}