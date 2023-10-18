import {useQuery} from "@tanstack/react-query";
import {ActionIcon, Text} from "@mantine/core";
import {useRef, useState} from "react";
import {MessageModel, ProjectModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {Message} from "./Message.tsx";
import {useReplyTo} from "./NewMessage.tsx";
import {IconArrowDown} from "@tabler/icons-react";
import classes from "./messageList.module.css";

export default function MessageList({project}: { project: ProjectModel }) {

    const {pb, useSubscription} = usePB()

    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollBarRef = useRef<HTMLDivElement>(null)

    const [, setReplyTo] = useReplyTo()

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const handleScroll = () => {
        if (scrollBarRef.current) {
            const {scrollTop, clientHeight, scrollHeight} = scrollBarRef.current;
            setScrollPosition(Math.abs(scrollTop))
            const scrolledToTop = Math.abs(Math.abs(scrollTop) + clientHeight - scrollHeight) < 5; // Allow a tolerance of 5 pixels
            if (scrolledToTop && !messageQuery.isPending && page < totalPages) {
                setPage(p => p + 1)
            }
        }
    }

    const [messages, setMessages] = useState<MessageModel[]>([])

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

    const messageQuery = useQuery({
        queryKey: ['project', project.id, 'messages', page],
        queryFn: async () => {
            const response = await pb.collection('messages').getList<MessageModel>(1, 50, {
                sort: '-created',
                expand: 'replyTo,author',
                filter: `project="${project.id}"`,
                page: page,
                perPage: 10
            })
            updateMessages(response.items)
            setTotalPages(response.totalPages)
            return response
        }
    })

    useSubscription<MessageModel>({
        idOrName: 'messages',
        callback: async (data) => {
            if (data.record.project === project.id && data.action === "create") {
                const msg = await pb.collection("messages").getOne<MessageModel>(data.record.id, {expand: 'replyTo,author'})
                updateMessages([msg])
            }
        }
    }, [project.id])

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
        </div>

        {scrollPosition > 100 &&
            <>
                <ActionIcon
                    className={classes.scrollAffix}
                    variant={"filled"}
                    color={"gray"}
                    aria-label={"Scroll to Bottom"}
                    onClick={() => scrollBarRef.current?.scrollTo({top: 0, behavior: 'smooth'})}
                >
                    <IconArrowDown/>
                </ActionIcon>
            </>
        }
    </div>
}