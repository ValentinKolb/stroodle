import {useMutation, useQuery} from "@tanstack/react-query";
import {ActionIcon, Indicator, Loader, Text} from "@mantine/core";
import {useRef, useState} from "react";
import {MessageModel, ProjectModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {Message} from "./Message.tsx";
import {useReplyTo} from "./NewMessage.tsx";
import {IconArrowDown} from "@tabler/icons-react";
import classes from "./messageList.module.css";
import {useScrollToElement} from "./util.ts";

export default function MessageList({project}: { project: ProjectModel }) {

    const {pb, useSubscription} = usePB()

    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollBarRef = useRef<HTMLDivElement>(null)
    const [scrollToNew, setScrollToNew] = useState(false)
    const showScrollBottom = scrollPosition > 100

    const [, setReplyTo] = useReplyTo()

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // this function does two things:
    // 1. stores the scroll position of the message list in scrollPosition, which is used by the scroll to bottom button
    // 2. loads more messages when the user scrolls to the top of the message list
    const handleScroll = () => {
        if (scrollBarRef.current) {
            const {scrollTop, clientHeight, scrollHeight} = scrollBarRef.current;
            setScrollPosition(Math.abs(scrollTop))
            const scrolledToTop = Math.abs(Math.abs(scrollTop) + clientHeight - scrollHeight) < 5; // Allow a tolerance of 5 pixels
            if (scrolledToTop && !messageLoadMutation.isPending && page <= totalPages) {
                messageLoadMutation.mutate(page + 1)
            }
            if (scrollPosition < 100 && initalMessageQuery.isSuccess) {
                setScrollToNew(false)
            }
        }
    }

    const [messages, setMessages] = useState<MessageModel[]>([])

    // this function appends new messages to the list of messages maintaining the order
    const updateMessages = (newMessages: MessageModel[]) => {
        setMessages(oldMessages =>
            [...oldMessages, ...newMessages]
                .filter((message, index, self) => {
                    return self.findIndex(m => m.id === message.id) === index
                })
                .sort((a, b) => {
                    return (new Date(b.created).getTime() - new Date(a.created).getTime())
                })
        )
    }

    const perPage = 10
    // initial load of messages
    const initalMessageQuery = useQuery({
        queryKey: ['messages', project.id],
        queryFn: async () => {
            const response = await pb.collection('messages').getList<MessageModel>(1, 50, {
                sort: '-created',
                expand: 'replyTo,author',
                filter: `project="${project.id}"`,
                page: page,
                perPage: perPage
            })
            setPage(page)
            updateMessages(response.items)
            setTotalPages(response.totalPages)
            return response
        }
    })

    const messageLoadMutation = useMutation({
        mutationFn: async (page: number) => {
            const response = await pb.collection('messages').getList<MessageModel>(1, 50, {
                sort: '-created',
                expand: 'replyTo,author',
                filter: `project="${project.id}"`,
                page: page,
                perPage: perPage
            })
            setPage(page)
            updateMessages(response.items)
            setTotalPages(response.totalPages)
            return response
        }
    })

    // this subscription updates the message list when a new message is created
    useSubscription<MessageModel>({
        idOrName: 'messages',
        callback: async (data) => {
            if (data.record.project === project.id && data.action === "create") {
                const msg = await pb.collection("messages").getOne<MessageModel>(data.record.id, {expand: 'replyTo,author'})
                updateMessages([msg])
                setScrollToNew(true)
            }
        }
    }, [project.id])

    // this hook scrolls to the message with the id in the url
    // careful: don't use other hook data inside the hook, because it will cause an infinite loop (other hook data only is updated after this hook is finished)
    useScrollToElement(async (scrollToMessageId) => {
        let currentPage = page
        let res: MessageModel[] = messages

        while (res.map(m => m.id).find(id => id === scrollToMessageId) === undefined) {
            if (currentPage > totalPages) {
                return false
            }
            currentPage += 1
            res = (await messageLoadMutation.mutateAsync(currentPage)).items
        }
        return true
    })

    return <div className={classes.container}>
        <div
            className={`${classes.messages} scrollbar`}
            ref={scrollBarRef}
            onScroll={handleScroll}
        >
            {
                messages.length === 0 &&
                <div className={"center"}>
                    <Text c={"dimmed"} size={"xs"}>
                        Hier gibt es noch keine Nachrichten. Schreibe die erste Nachricht!
                    </Text>
                </div>
            }
            {
                messages.map((message, index) => (
                    <Message
                        data-id={message.id}
                        onClick={() => setReplyTo(message)}
                        aria-label={"Reply to Message"}
                        key={`${message.id}-${index}`}
                        message={message}
                    />
                ))
            }
            {
                messageLoadMutation.isPending &&
                <div className={"center"}>
                    <Loader size={"sm"}/>
                </div>
            }
        </div>

        {showScrollBottom &&
            <>
                <ActionIcon
                    className={classes.scrollAffix}
                    variant={"filled"}
                    color={"gray"}
                    aria-label={"Scroll to Bottom"}
                    onClick={() => {
                        setScrollToNew(false)
                        scrollBarRef.current?.scrollTo({top: 0, behavior: 'smooth'})
                    }}
                >
                    <Indicator color={"green"} processing disabled={!scrollToNew}>
                        <IconArrowDown/>
                    </Indicator>
                </ActionIcon>
            </>
        }
    </div>
}