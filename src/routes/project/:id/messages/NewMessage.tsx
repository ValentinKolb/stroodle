import {MessageModel, ProjectModel} from "../../../../lib/models.ts";
import {useMutation} from "@tanstack/react-query";
import TextEditor, {cleanHtmlString, htmlStringIsEmpty} from "../../../../components/input/Editor";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {useHotkeys} from "@mantine/hooks";
import {ActionIcon, FileButton, Text, ThemeIcon, Tooltip} from "@mantine/core";
import {IconArrowForward, IconPaperclip, IconSend, IconX} from "@tabler/icons-react";
import {scrollToMessage} from "./util.ts";
import Html from "../../../../components/Html";
import classes from "./newMessage.module.css";
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
    const [file, setFile] = useState<File | null>(null)

    useHotkeys([
        ['mod+Enter', () => sendMessageMutation.mutate()],
    ], undefined, true)

    const sendMessageMutation = useMutation({
        mutationFn: async () => {
            if (htmlStringIsEmpty(text)) throw new Error("Message is empty")

            return await pb.collection('messages').create({
                text: cleanHtmlString(text),
                author: user!.id,
                project: project.id,
                file: file,
                fileName: file?.name || null,
                ...(replyTo && {
                    replyTo: replyTo?.id,
                })
            })
        },
        onSuccess: () => {
            vibrateShort()
            setText('')
            setReplyTo(null)
            setFile(null)
        }
    })

    return <>

        <div className={classes.container}>

            {
                file &&
                <div className={classes.replyTo}>
                    <ThemeIcon variant={"transparent"} color={"blue"}>
                        <IconPaperclip/>
                    </ThemeIcon>

                    <Text truncate className={classes.file}>
                        {file.name}
                    </Text>

                    <ActionIcon
                        variant={"transparent"}
                        aria-label={"Remove File"}
                        onClick={() => setFile(null)}
                    >
                        <IconX/>
                    </ActionIcon>
                </div>
            }

            {
                replyTo &&
                <div className={classes.replyTo}>

                    <ThemeIcon variant={"transparent"} color={"gray"}>
                        <IconArrowForward/>
                    </ThemeIcon>

                    <Html
                        className={`one-line ${classes.message} ${classes.replyToText}`}
                        onClick={() => scrollToMessage(replyTo!)}
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

                <FileButton onChange={setFile}>
                    {(props) => (
                        <ActionIcon
                            variant={"transparent"}
                            aria-label={"Attach File(s)"}
                            {...props}
                        >
                            <IconPaperclip/>
                        </ActionIcon>
                    )}
                </FileButton>

                <TextEditor
                    style={{flex: 1}}
                    value={text}
                    onChange={(s) => setText(s)}
                    placeholder={"Nachricht schreiben"}
                    hideToolbar
                />

                <Tooltip label={"⌘ ⏎"}>
                    <ActionIcon
                        loading={sendMessageMutation.isPending}
                        disabled={htmlStringIsEmpty(text)}
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