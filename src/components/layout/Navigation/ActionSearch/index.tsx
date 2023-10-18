import {ActionIcon, Badge, Button, Code, Group, Kbd, rem, Text} from '@mantine/core';
import '@mantine/spotlight/styles.css';
import {Spotlight, spotlight} from '@mantine/spotlight';
import {
    IconForklift,
    IconHash,
    IconLogout,
    IconMessagePlus,
    IconPencilPlus,
    IconSearch,
    IconTextPlus,
    IconUser,
    IconUsersGroup,
    TablerIconsProps
} from '@tabler/icons-react';
import {ReactElement, ReactNode, useState} from "react";
import classes from './index.module.css';

const actions: {
    group: string;
    actions: {
        id: string;
        label: ReactNode
        description: ReactNode
        onClick: () => void
        leftSection: (props: TablerIconsProps) => ReactElement<TablerIconsProps>
    }[]
}[] = [
    {
        group: 'Erstelle ...',
        actions: [

            {
                id: 'newMsg',
                description: <Group gap={"xs"}>
                    <Kbd size={"xs"}>{"@"}</Kbd>
                    <Badge variant="outline" color="gray" size="md" radius="sm"
                           leftSection={<IconUsersGroup style={{width: rem(12), height: rem(12)}}/>}>{"..."}</Badge>
                    <Badge variant="outline" color="gray" size="md" radius="sm"
                           leftSection={<IconHash style={{width: rem(12), height: rem(12)}}/>}>{"..."}</Badge>
                    <Badge variant="light" color="green" radius="sm">Nachricht</Badge>
                </Group>,
                label: 'Nachricht schreiben',
                onClick: () => console.log('newMsg'),
                leftSection: IconMessagePlus,
            },
            {
                id: 'newTodo',
                description: <Group gap={"xs"}>
                    <Kbd size={"xs"}>{"-"}</Kbd>
                    <Badge variant="outline" color="gray" size="md" radius="sm"
                           leftSection={<IconUsersGroup style={{width: rem(12), height: rem(12)}}/>}>{"..."}</Badge>
                    <Badge variant="outline" color="gray" size="md" radius="sm"
                           leftSection={<IconHash style={{width: rem(12), height: rem(12)}}/>}>{"..."}</Badge>
                    <Badge variant="light" color="green" radius="sm">Todo</Badge>
                </Group>,
                label: 'Neues Todo anlegen',
                onClick: () => console.log('newTodo'),
                leftSection: IconPencilPlus,
            },
            {
                id: 'newNote',
                description: <Group gap={"xs"}>
                    <Kbd size={"xs"}>{"$"}</Kbd>
                    <Badge variant="outline" color="gray" size="md" radius="sm"
                           leftSection={<IconUsersGroup style={{width: rem(12), height: rem(12)}}/>}>{"..."}</Badge>
                    <Badge variant="outline" color="gray" size="md" radius="sm"
                           leftSection={<IconHash style={{width: rem(12), height: rem(12)}}/>}>{"..."}</Badge>
                    <Badge variant="light" color="green" radius="sm">Notiz</Badge>
                </Group>,
                label: 'Neue Notiz erstellen',
                onClick: () => console.log('newNote'),
                leftSection: IconTextPlus,
            }
        ],
    },

    {
        group: 'Navigiere zu ...',
        actions: [{
            id: 'projects',
            label: 'Projekte',
            description: 'Projekte anlegen, bearbeiten, löschen',
            onClick: () => console.log('projects'),
            leftSection: IconForklift,
        },
            {
                id: 'account',
                label: 'Account',
                description: 'Account bearbeiten',
                onClick: () => console.log('account'),
                leftSection: IconUser,
            }
        ],
    },

    {
        group: 'Aktivitäten ...',
        actions: [
            {
                id: 'logout',
                label: 'Ausloggen',
                description: 'Auf diesem Gerät ausloggen',
                onClick: () => console.log('Documentation'),
                leftSection: IconLogout,
            }]
    },
];

export default function ActionSearch() {

    const [query, setQuery] = useState('');

    const items = actions
        .map((group) => (
            <Spotlight.ActionsGroup key={group.group} label={group.group}>
                {group.actions
                    .map((item) => (
                        <Spotlight.Action key={item.id} onClick={item.onClick}>
                            <Group wrap="nowrap" w="100%">
                                {<item.leftSection style={{width: rem(24), height: rem(24)}} stroke={1.5}/>}

                                <div style={{flex: 1}}>
                                    <Text>{item.label}</Text>

                                    {item.description && (
                                        <Text opacity={0.6} size="xs">
                                            {item.description}
                                        </Text>
                                    )}
                                </div>
                            </Group>
                        </Spotlight.Action>
                    ))
                }
            </Spotlight.ActionsGroup>
        ))

    return (
        <>
            <Button
                className={classes.btnDesktop}
                onClick={spotlight.open}
                variant="outline"
                color="gray.4"
                radius="sm"
                size={"xs"}
                leftSection={<IconSearch style={{width: rem(15), height: rem(15)}} stroke={1.5}/>}
                rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
            >
                Projekte, Todos, ...
            </Button>

            <ActionIcon
                className={classes.btnMobile}
                onClick={spotlight.open}
                variant="transparent"
                aria-label={"Search"}
            >
                <IconSearch/>
            </ActionIcon>

            <Spotlight.Root query={query} onQueryChange={setQuery}>
                <Spotlight.Search placeholder="Suchen..." leftSection={<IconSearch stroke={1.5}/>}/>
                <Spotlight.ActionsList>
                    {items.length > 0 ? items : <Spotlight.Empty>Keine Ergebnisse...</Spotlight.Empty>}
                </Spotlight.ActionsList>
            </Spotlight.Root>
        </>
    )
}