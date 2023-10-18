import {MessageModel, ProjectModel} from "../../../../lib/models.ts";
import {useMutation} from "@tanstack/react-query";
import TextEditor, {cleanHtmlString} from "../../../../components/input/Editor";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {useHotkeys} from "@mantine/hooks";
import {ActionIcon, ThemeIcon, Tooltip} from "@mantine/core";
import {IconArrowForward, IconPaperclip, IconSend, IconX} from "@tabler/icons-react";
import {scrollToMessage} from "./util.ts";
import Html from "../../../../components/Html";
import classes from "./newMessage.module.css";
import messageClasses from "./message.module.css";
import {vibrateShort} from "../../../../lib/uiUtil.tsx";
import {atom, useRecoilState} from "recoil";
import {useState} from "react";

const replyToState = atom<MessageModel | null>({
    key: 'replyToState', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
})

export const useReplyTo = () => {
    return useRecoilState(replyToState)
}

export default function NewMessage({project}: { project: ProjectModel }) {

    const {pb, user} = usePB()

    const [text, setText] = useState('')
    const [replyTo, setReplyTo] = useReplyTo()

    // todo
    // useEffect(() => {
    //    formValues.setFieldValue('replyTo', replyTo)
    //}, [formValues, replyTo])

    useHotkeys([
        ['mod+Enter', () => sendMessageMutation.mutate()],
    ], undefined, true);

    const sendMessageMutation = useMutation({
        mutationFn: async () => {
            return await pb.collection('messages').create({
                text: cleanHtmlString(text),
                replyTo: replyTo,
                author: user?.id,
                project: project.id,
                readBy: [user?.id]
            })
        },
        onSuccess: () => {
            vibrateShort()
            setText('')
            setReplyTo(null)
        }
    })

    return <>

        <div className={classes.container}>

            {
                replyTo &&
                <div className={classes.replyTo}>

                    <ThemeIcon variant={"transparent"} color={"gray"}>
                        <IconArrowForward/>
                    </ThemeIcon>

                    <Html
                        className={`one-line ${messageClasses.message} ${classes.replyToText}`}
                        onClick={() => scrollToMessage(replyTo!.id)}
                        data-author={replyTo.expand?.author?.id === user?.id}
                    >
                        {replyTo.text}
                    </Html>

                    <ActionIcon
                        variant={"transparent"}
                        aria-label={"Cancel Reply"}
                        onClick={() => setReplyTo(null)}
                    >
                        <IconX/>
                    </ActionIcon>
                </div>
            }

            <form
                className={classes.inputForm}
                onSubmit={(e) => {
                    e.preventDefault()
                    sendMessageMutation.mutate()
                }}>

                <ActionIcon
                    variant={"transparent"}
                    aria-label={"Options"}
                    color={"gray"}
                >
                    <IconPaperclip/>
                </ActionIcon>

                <TextEditor
                    style={{flex: 1}}
                    value={text}
                    onChange={(s) => setText(s)}
                    placeholder={"Nachricht schreiben"}
                    hideToolbar
                />

                <Tooltip label={"MOD + Enter"}>
                    <ActionIcon
                        loading={sendMessageMutation.isPending}
                        disabled={cleanHtmlString(text).length === 0}
                        aria-label={"Send Message"}
                        variant={"transparent"}
                        type={"submit"}
                    >
                        <IconSend/>
                    </ActionIcon>
                </Tooltip>
            </form>
        </div>

    </>
}