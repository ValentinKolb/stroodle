import {ActionIcon, Button, Code, Kbd, rem, Text} from '@mantine/core';
import '@mantine/spotlight/styles.css';
import {Spotlight, spotlight} from '@mantine/spotlight';
import {
    IconForklift,
    IconMessage,
    IconMessagePlus,
    IconPaperclip,
    IconSearch,
    IconSquareCheck,
    IconSquarePlus
} from '@tabler/icons-react';
import {useState} from "react";
import classes from './index.module.css';
import {useParams} from "react-router-dom";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {MessageModel, ProjectModel, TaskModel} from "../../../../lib/models.ts";
import {useCustomNavigate} from "../Custom/util.ts";
import Html from '../../../Html/index.tsx';
import {useCreateTaskMutation} from "../../../../routes/project/:id/tasks/_view";


export default function ActionSearch() {

    const [query, setQuery] = useState('')

    const {projectId} = useParams() as { projectId?: string }

    const {pb, user} = usePB()
    const navigate = useCustomNavigate()

    const parseMsg = {
        match: query.match(/^\s*>\s*(.*)/),
        data: query.replace(/^\s*>\s*/, "")
    }

    const parseTask = {
        match: query.match(/^\s*-\s*(.*)/),
        data: query.replace(/^\s*-\s*/, "")
    }

    const searchProjectQuery = useQuery({
        queryKey: ['search', 'project', query],
        queryFn: async () => {
            const q = encodeURIComponent(query)
            return (await pb.collection('projects').getList<ProjectModel>(1, 5, {
                filter: `name ~ "${q}"`,
            })).items
        },
        enabled: query.length > 0,
        retry: false
    })

    const searchTaskQuery = useQuery({
        queryKey: ['search', 'task', query],
        queryFn: async () => {
            const q = encodeURIComponent(query)
            return (await pb.collection('tasks').getList<TaskModel>(1, 5, {
                filter: `description ~ "${q}"`,
                expand: 'project'
            })).items
        },
        enabled: query.length > 0,
        retry: false
    })

    const searchMessagesQuery = useQuery({
        queryKey: ['search', 'message', query],
        queryFn: async () => {
            const q = encodeURIComponent(query)
            return (await pb.collection('messages').getList<MessageModel>(1, 5, {
                filter: `text ~ "${q}" && systemMessage = false`,
                expand: 'author,project'
            })).items
        },
        enabled: query.length > 0,
        retry: false
    })

    const searchFilesQuery = useQuery({
        queryKey: ['search', 'file', query],
        queryFn: async () => {
            const q = encodeURIComponent(query)
            return (await pb.collection('messages').getList<MessageModel>(1, 5, {
                filter: `fileName ~ "${q}" && systemMessage = false`,
                expand: 'author,project'
            })).items
        },
        enabled: query.length > 0,
        retry: false
    })

    const sendMessagesMutation = useMutation({
        mutationFn: async () => {
            return await pb.collection('messages').create({
                author: user!.id,
                text: `<p>${parseMsg.data}</p>`,
                project: projectId,
            })
        }
    })

    const createTaskMutation = useCreateTaskMutation({
        projectId: projectId!,
    })

    const newMsgAction = (msg?: string) => ({
        id: 'newMsg',
        description: <span className={classes.group}>
        <Kbd size={"xs"}>{">"}</Kbd> {msg || "Nachricht"}
    </span>,
        label: 'Nachricht schreiben',
        onClick: sendMessagesMutation.mutate,
        leftSection: IconMessagePlus
    })

    const newTaskAction = (task?: string) => ({
        id: 'newTask',
        description: <span className={classes.group}>
        <Kbd size={"xs"}>{"-"}</Kbd> {task || "Aufgabe"}
    </span>,
        label: 'Aufgabe erstellen',
        onClick: () => createTaskMutation.mutate({
            description: `<p>${parseMsg.data.replace(/^\s*-\s*/, "")}</p>`,
            deadline: null
        }),
        leftSection: IconSquarePlus,
    })

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
            searchMessagesQuery.refetch()
        }
    }

    const items = actions
        .map((item) => (
            <Spotlight.Action
                key={item.id} onClick={() => item.onClick()}
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
            {<IconForklift style={{minWidth: rem(24), minHeight: rem(24)}} stroke={1.5}/>}
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
            {<IconSquareCheck style={{minWidth: rem(24), minHeight: rem(24)}} stroke={1.5}/>}

            <Text>
                {task.expand?.project?.name}
            </Text>

            <Html className={`${classes.searchResult} one-line`}>{task.description}</Html>
        </Spotlight.Action>
    ))

    const messageSearchResults = (searchMessagesQuery.data || []).map((message: MessageModel) => (
        <Spotlight.Action
            key={message.id}
            onClick={
                () => navigate(`/project/${message.project}/messages?scrollToId=${message.id}`)
            }
            className={classes.searchResultContainer}
        >
            {<IconMessage style={{minWidth: rem(24), minHeight: rem(24)}} stroke={1.5}/>}

            <Text>
                @{message.expand!.author!.username} <span className={"dimmed"}>in</span> {message.expand?.project?.name}
            </Text>

            <Html className={`${classes.searchResult} one-line`}>{message.text}</Html>
        </Spotlight.Action>
    ))

    const fileSearchResults = (searchFilesQuery.data || []).map((message: MessageModel) => (
        <Spotlight.Action
            key={message.id}
            onClick={
                () => navigate(`/project/${message.project}/messages?scrollToId=${message.id}`)
            }
            className={classes.searchResultContainer}
        >
            {<IconPaperclip style={{minWidth: rem(24), minHeight: rem(24)}} stroke={1.5}/>}

            <Text style={{whiteSpace: "nowrap"}}>
                @{message.expand!.author!.username} <span className={"dimmed"}>in</span> {message.expand?.project?.name}
            </Text>

            <Text truncate>
                {message.fileName}
            </Text>
        </Spotlight.Action>
    ))


    const spotlightResults = [
        ...items,
        ...projectSearchResults,
        ...taskSearchResults,
        ...messageSearchResults,
        ...fileSearchResults
    ]

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