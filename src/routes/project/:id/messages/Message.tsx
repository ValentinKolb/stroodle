import {forwardRef, HTMLProps} from "react";
import {MessageModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import classes from "./message.module.css";
import Html from "../../../../components/Html";
import {formateChatDate} from "../../../../lib/dateUtil.ts";
import {scrollToMessage} from "./util.ts";
import {ThemeIcon} from "@mantine/core";
import {IconArrowForward} from "@tabler/icons-react";

export const Message = forwardRef<HTMLDivElement, { message: MessageModel } & HTMLProps<HTMLDivElement>>(
    ({message, ...props}, ref) => {
        const {user} = usePB();
        return (
            <div
                className={`${classes.container}`}
                data-author={message.author === user?.id}
                data-reply={!!message.replyTo}
            >

                {
                    message.replyTo && (
                        <div
                            onClick={() => scrollToMessage(message.replyTo!)}
                            className={`${classes.message} ${classes.reply}`}
                            data-author={message.expand?.replyTo?.author === user?.id}
                        >

                            <ThemeIcon variant={"transparent"} c={"inherit"} size={"xs"}>
                                <IconArrowForward/>
                            </ThemeIcon>

                            <Html className={`one-line`}>
                                {message.expand!.replyTo!.text}
                            </Html>
                        </div>

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
                    <div className={classes.time}>
                        {formateChatDate(new Date(message.created))}
                    </div>
                </div>
            </div>
        )
    }
)

// It's useful to set the `displayName` property on the component for debugging purposes.
Message.displayName = 'Message';
