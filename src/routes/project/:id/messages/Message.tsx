import {forwardRef, HTMLProps} from "react";
import {MessageModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import classes from "./message.module.css";
import Html from "../../../../components/Html";
import {formateChatDate} from "../../../../lib/dateUtil.ts";
import {ThemeIcon} from "@mantine/core";
import {IconArrowForward} from "@tabler/icons-react";
import {CustomLink} from "../../../../components/layout/Navigation/Custom/CustomLink.tsx";
import {scrollToMessage} from "./util.ts";
import {useSearchParams} from "react-router-dom";

export const Message = forwardRef<HTMLDivElement, { message: MessageModel } & HTMLProps<HTMLDivElement>>(
    ({message, ...props}, ref) => {
        const {user} = usePB()
        const [searchParams] = useSearchParams()
        const scrollToId = searchParams.get("scrollToId")

        return (
            <div
                className={`${classes.container}`}
                data-author={message.author === user?.id}
                data-reply={!!message.replyTo}
                data-hightlight={message.id === scrollToId}
            >

                {
                    message.replyTo && (
                        <CustomLink
                            to={scrollToMessage(message.expand!.replyTo!)}
                            className={`${classes.message} ${classes.reply}`}
                            data-author={message.expand?.replyTo?.author === user?.id}
                        >

                            <ThemeIcon variant={"transparent"} c={"inherit"} size={"xs"}>
                                <IconArrowForward/>
                            </ThemeIcon>

                            <Html className={`one-line`}>
                                {message.expand!.replyTo!.text}
                            </Html>
                        </CustomLink>

                    )
                }
                <div
                    className={classes.message}
                    {...props}
                    ref={ref}

                >
                    <div className={classes.author}>
                        @{message.expand?.author?.username}
                    </div>
                    <Html className={classes.text}>
                        {message.text}
                    </Html>

                    <div className={classes.time} data-author={message.author === user?.id}>
                        {formateChatDate(new Date(message.created))}
                    </div>
                </div>
            </div>
        )
    }
)

// It's useful to set the `displayName` property on the component for debugging purposes.
Message.displayName = 'Message';
