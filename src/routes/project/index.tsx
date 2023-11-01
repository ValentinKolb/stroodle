import {useMutation, useQuery} from "@tanstack/react-query";
import {MessageModel, ProjectModel, TaskModel} from "../../lib/models.ts";
import {usePB} from "../../lib/pocketbase.tsx";
import Header from "../../components/layout/Header";

import classes from './index.module.css';
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import {Button, Loader, Modal, Select, SelectProps, Text, Title, UnstyledButton} from "@mantine/core";
import {IconChevronRight, IconForklift, IconSearch, IconSend, IconSquarePlus} from "@tabler/icons-react";
import {BrandIconChat, BrandIconTask} from "../../lib/icons.tsx";
import Html from "../../components/Html/index.tsx";
import UserAvatar from "../../components/UserAvatar.tsx";
import {useCustomNavigate} from "../../components/layout/Navigation/Custom/util.ts";
import React, {useRef, useState} from "react";
import TextEditor, {cleanHtmlString, htmlStringIsEmpty, textContent} from "../../components/input/Editor";
import {useForm} from "@mantine/form";
import {spotlight} from "@mantine/spotlight";
import {queryClient} from "../../main.tsx";
import {scrollToMessage} from "./:id/messages/util.ts";
import {formateChatDate} from "../../lib/dateUtil.ts";
import {useDraggable} from "react-use-draggable-scroll";

const QuickAction = ({icon, label, onClick}: {
    icon: React.ReactNode,
    label: string,
    onClick: () => void
}) => (
    <UnstyledButton aria-label={label} className={classes.quickAction} onClick={onClick}>
        {icon}
    </UnstyledButton>
)

const ProjectDropDown = (props: SelectProps) => {
    const {pb} = usePB()
    const projectQuery = useQuery({
        queryKey: ['all', 'projects'],
        queryFn: async () => {
            return await pb.collection('projects').getFullList<ProjectModel>()
        }
    })

    return <>
        <Select
            placeholder="Wähle ein Projekt aus"
            defaultDropdownOpened={false}
            data={
                (projectQuery.data || [])
                    .map((project) => ({
                        value: project.id,
                        label: project.name
                    }))
            }
            {...props}
        />
    </>
}

const QuickActions = () => {

    const {user, pb} = usePB()
    const navigate = useCustomNavigate()

    const [showNewMsgModal, setShowNewMsgModal] = useState(false)
    const [showNewTaskModal, setShowNewTaskModal] = useState(false)

    const newMsgFormValues = useForm({
        initialValues: {
            project: "" as string | null,
            message: ""
        }
    })

    const newTaskFormValues = useForm({
        initialValues: {
            project: "" as string | null,
            description: ""
        }
    })

    const createTaskMutation = useMutation({
        mutationFn: async () => {
            const task = await pb.collection('tasks').create<TaskModel>({
                description: newTaskFormValues.values.description,
                done: false,
                project: newTaskFormValues.values.project,
            })

            await pb.collection('messages').create({
                text: `Neue Aufgabe erstellt: ${(textContent(newTaskFormValues.values.description) || "").slice(1, 10)}...`,
                project: newTaskFormValues.values.project,
                author: user?.id ?? "",
                systemMessage: true,
                link: `/project/${newTaskFormValues.values.project}/tasks/${task.id}`,
            })
        },
        onSuccess: () => {
            newTaskFormValues.reset()
            queryClient.invalidateQueries({queryKey: ["project", newTaskFormValues.values.project, "tasks"]})
            setShowNewTaskModal(false)
        }
    })

    const sendNewMsgMutation = useMutation({
        mutationFn: async () => {
            if (htmlStringIsEmpty(newMsgFormValues.values.message) || !newMsgFormValues.values.project) {
                throw new Error("Invalid input")
            }
            await pb.collection('messages').create({
                project: newMsgFormValues.values.project,
                text: cleanHtmlString(newMsgFormValues.values.message),
                author: user!.id,
            })
        },
        onSuccess: () => {
            setShowNewMsgModal(false)
            newMsgFormValues.reset()
        }
    })

    return <>
        <Modal opened={showNewMsgModal} withCloseButton={false} onClose={() => setShowNewMsgModal(false)}>
            <form className={classes.modalContainer}

                  onSubmit={newMsgFormValues.onSubmit(() => {
                      sendNewMsgMutation.mutate()
                  })}
            >

                <div className={classes.modalTitle}>
                    Neue Nachricht
                </div>

                <ProjectDropDown
                    value={newMsgFormValues.values.project}
                    onChange={(value) => {
                        newMsgFormValues.setFieldValue("project", value)
                    }}
                />

                <TextEditor
                    placeholder={"Nachricht"}
                    value={newMsgFormValues.values.message}
                    onChange={(value) => {
                        newMsgFormValues.setFieldValue("message", value)
                    }}/>

                <Button
                    leftSection={<IconSend/>}
                    type={"submit"}
                    color={"green"}
                    variant={"subtle"}
                    loading={sendNewMsgMutation.isPending}
                >
                    Nachricht senden
                </Button>

            </form>
        </Modal>
        <Modal opened={showNewTaskModal} withCloseButton={false} onClose={() => setShowNewTaskModal(false)}>
            <form className={classes.modalContainer}
                  onSubmit={newTaskFormValues.onSubmit(() => {
                      createTaskMutation.mutate()
                  })}
            >

                <div className={classes.modalTitle}>
                    Neue Aufgabe
                </div>

                <ProjectDropDown
                    value={newTaskFormValues.values.project}
                    onChange={(value) => {
                        newTaskFormValues.setFieldValue("project", value)
                    }}
                />

                <TextEditor
                    placeholder={"Beschreibung"}
                    value={newTaskFormValues.values.description}
                    onChange={(value) => {
                        newTaskFormValues.setFieldValue("description", value)
                    }}
                />

                <Button
                    leftSection={<IconSquarePlus/>}
                    type={"submit"}
                    color={"green"}
                    variant={"subtle"}
                    loading={createTaskMutation.isPending}
                >
                    Aufgabe erstellen
                </Button>
            </form>
        </Modal>
        <div className={classes.quickActions}>
            <QuickAction
                icon={<BrandIconChat/>}
                label={"Neue Nachricht"}
                onClick={() => {
                    setShowNewMsgModal(true)
                }}
            />

            <QuickAction
                icon={<BrandIconTask/>}
                label={"Neue Aufgabe"}
                onClick={() => {
                    setShowNewTaskModal(true)
                }}
            />

            <QuickAction
                icon={<IconForklift/>}
                label={"Neues Projekt"}
                onClick={() => {
                    navigate("/project/new")
                }}
            />

            <QuickAction
                icon={<IconSearch/>}
                label={"Suchen"}
                onClick={() => {
                    spotlight.open()
                }}
            />

            <QuickAction
                icon={<UserAvatar size={"sm"} user={user!}/>}
                label={"Account"}
                onClick={() => {
                    navigate("/account")
                }}
            />
        </div>
    </>
}

const Message = ({message}: { message: MessageModel }) => {
    return <CustomLink to={scrollToMessage(message)} className={classes.message}>
        <div>
            @{message.expand!.author!.username}
            <IconChevronRight size={12}/>
            {message.expand!.project!.name}
        </div>

        <Html className={"one-line"}>
            {message.text}
        </Html>

        <div className={classes.time}>
            {formateChatDate(new Date(message.created))}
        </div>
    </CustomLink>
}

const RecentMessages = () => {

    const {pb} = usePB()

    const messageQuery = useQuery({
        queryKey: ['all', 'messages'],
        queryFn: async () => {
            const res = await pb.collection('messages')
                .getList<MessageModel>(1, 20, {
                    sort: "-created",
                    expand: "author,project",
                    filter: `systemMessage=false`
                })
            return res.items
        }
    })

    return (
        <div className={`${classes.recentMessages} scrollbar`}>
            {
                (messageQuery.data || []).map((message) => (
                    <Message key={message.id} message={message}/>
                ))
            }
        </div>
    )
}

const Projects = () => {
    const {pb} = usePB()

    const query = useQuery({
        queryKey: ['all', 'projects'],
        queryFn: async () => {
            return await pb.collection('projects').getFullList<ProjectModel>()
        }
    })

    const ref =
        useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
    const {events} = useDraggable(ref, {
        isMounted: !!ref.current,
    })

    return <>
        {query.isPending && <Loader size={"sm"} ml={"md"} mt={"md"}/>}

        {query.data?.length === 0 &&
            <Text className={"center"} c={"dimmend"}>
                Es wurden noch keine Projekte erstellt. Erstelle ein neues Projekt.
            </Text>
        }

        <div
            className={`${classes.projects}`}
            {...events}
            ref={ref}
        >
            {query.data?.map((project) => (
                <div key={project.id} className={classes.projectContainer}>
                    <div className={classes.projectEmoji}>
                        {project.emoji}
                    </div>

                    <CustomLink
                        to={`/project/${project.id}`}
                        className={classes.projectName}
                    >
                        {project.name}
                    </CustomLink>

                    <Text>
                        {
                            textContent(project.description || "")!.slice(1, 20)
                        }

                        {
                            textContent(project.description || "")!.length > 20 &&
                            "..."
                        }
                    </Text>

                    <div className={classes.btnGroup}>
                        <CustomLink to={`/project/${project.id}/messages`}>
                            <BrandIconChat/>
                        </CustomLink>

                        <CustomLink to={`/project/${project.id}/tasks`}>
                            <BrandIconTask/>
                        </CustomLink>
                    </div>
                </div>
            ))}
        </div>
    </>
}

export default function ProjectOverview() {

    const {user} = usePB()

    return <div className={classes.container}>
        <Header
            label={`👋 @${user?.username}`}
            href={`/project`}
        />

        <Title order={3} c={"dimmed"}>
            Schnellzugriff
        </Title>

        <QuickActions/>

        <Title order={3} c={"dimmed"}>
            Projekte
        </Title>

        <Projects/>

        <Title order={3} c={"dimmed"}>
            Aktuellste Nachrichten
        </Title>

        <RecentMessages/>
    </div>
}