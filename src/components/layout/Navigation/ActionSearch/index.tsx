import {ActionIcon, Button, Code, Kbd, rem, Text} from '@mantine/core';
import '@mantine/spotlight/styles.css';
import {Spotlight, spotlight} from '@mantine/spotlight';
import {IconForklift, IconMessagePlus, IconSearch, IconSquareCheck, IconSquarePlus} from '@tabler/icons-react';
import {useState} from "react";
import classes from './index.module.css';
import {useParams} from "react-router-dom";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {useQuery} from "@tanstack/react-query";
import {ProjectModel, TaskModel} from "../../../../lib/models.ts";
import {useCustomNavigate} from "../Custom/util.ts";
import Html from '../../../Html/index.tsx';

const newMsgAction = (msg?: string) => ({
    id: 'newMsg',
    description: <span className={classes.group}>
        <Kbd size={"xs"}>{">"}</Kbd> {msg || "Nachricht"}
    </span>,
    label: 'Nachricht schreiben',
    onClick: () => console.log('newMsg'),
    leftSection: IconMessagePlus
})

const newTaskAction = (task?: string) => ({
    id: 'newTask',
    description: <span className={classes.group}>
        <Kbd size={"xs"}>{"-"}</Kbd> {task || "Aufgabe"}
    </span>,
    label: 'Aufgabe erstellen',
    onClick: () => console.log('newMsg'),
    leftSection: IconSquarePlus,
})

export default function ActionSearch() {

    const [query, setQuery] = useState('')

    const {projectId} = useParams() as { projectId?: string }

    const {pb} = usePB()
    const navigate = useCustomNavigate()

    const parseMsg = {
        match: query.match(/^>\s*(.*)/),
        data: query.replace(/^>\s*/, "")
    }

    const parseTask = {
        match: query.match(/^-\s*(.*)/),
        data: query.replace(/^-\s*/, "")
    }

    const searchProjectQuery = useQuery({
        queryKey: ['search', 'project', query],
        queryFn: async () => {
            return (await pb.collection('projects').getList<ProjectModel>(1, 5, {
                filter: `name ~ "${query}"`,
            })).items
        },
        enabled: query.length > 0,
        retry: false
    })

    const searchTaskQuery = useQuery({
        queryKey: ['search', 'task', query],
        queryFn: async () => {
            return (await pb.collection('tasks').getList<TaskModel>(1, 5, {
                filter: `description ~ "${query}"`,
            })).items
        },
        enabled: query.length > 0,
        retry: false
    })

    // todo create actions from search results

    const actions = []
    if (projectId) {
        if (parseMsg.match) {
            actions.push(
                newMsgAction(parseMsg.data)
            )
        } else if (parseTask.match) {
            actions.push(
                newTaskAction(parseTask.data)
            )
        } else if (query.length === 0) {
            actions.push(newMsgAction())
            actions.push(newTaskAction())
        } else {
            searchProjectQuery.refetch()
            searchTaskQuery.refetch()
        }
    }

    const items = actions
        .map((item) => (
            <Spotlight.Action
                key={item.id} onClick={item.onClick}
                className={classes.searchResultContainer}
            >
                {<item.leftSection style={{width: rem(24), height: rem(24)}} stroke={1.5}/>}

                {item.description && (
                    <Text opacity={0.6} size="xs">
                        {item.description}
                    </Text>
                )}
            </Spotlight.Action>
        ))

    const projectSearchResults = (searchProjectQuery.data || []).map((project: ProjectModel) => (
        <Spotlight.Action
            key={project.id}
            onClick={
                () => navigate(`/project/${project.id}`)
            }
            className={classes.searchResultContainer}
        >
            {<IconForklift style={{width: rem(24), height: rem(24)}} stroke={1.5}/>}
            <Html className={`${classes.searchResult} one-line`}>{project.name}</Html>
        </Spotlight.Action>
    ))

    const taskSearchResults = (searchTaskQuery.data || []).map((task: TaskModel) => (
        <Spotlight.Action
            key={task.id}
            onClick={
                () => navigate(`/project/${task.project}/tasks/${task.id}`)
            }
            className={classes.searchResultContainer}
        >
            {<IconSquareCheck style={{width: rem(24), height: rem(24)}} stroke={1.5}/>}
            <Html className={`${classes.searchResult} one-line`}>{task.description}</Html>
        </Spotlight.Action>
    ))


    const spotlightResults = [...items, ...projectSearchResults, ...taskSearchResults]

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
                <Spotlight.ActionsList className={classes.actionList}>
                    {spotlightResults.length > 0 ? spotlightResults :
                        <Spotlight.Empty>Keine Ergebnisse...</Spotlight.Empty>}
                </Spotlight.ActionsList>
            </Spotlight.Root>
        </>
    )
}