import {ProjectModel, TaskModel} from "../../../../../lib/models.ts";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {RichTextEditor, RichTextEditorContent} from "@mantine/tiptap";
import classes from "./index.module.css";
import {useMutation} from "@tanstack/react-query";
import {usePB} from "../../../../../lib/pocketbase.tsx";
import {useEffect, useRef} from "react";
import {queryClient} from "../../../../../main.tsx";
import MenuBar from "./MenuBar.tsx";
import {cleanHtmlString} from "../../../../../components/input/Editor";
import {useDraggable} from "react-use-draggable-scroll";
import {Underline} from "@tiptap/extension-underline";

export default function TaskEditor({task}: {
    project: ProjectModel,
    task: TaskModel,
}) {

    const {pb} = usePB()

    const ref =
        useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
    const {events} = useDraggable(ref, {
        isMounted: !!ref.current,
    })

    const editorId = `taskEditor-${task.id}`

    const updateTaskMutation = useMutation({
        mutationFn: async ({description}: { description: string }) => {
            return await pb.collection('tasks').update(task.id, {
                description: cleanHtmlString(description)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["project", task.project, "tasks", task.id]
            }).then(() =>
                queryClient.invalidateQueries({
                    queryKey: ['project', task.project, 'tasks']
                }).then(() =>
                    console.log("invalidate", ['project', task.projectId, 'tasks', task.id])
                )
            )
        }
    })

    const extensions = [
        StarterKit.configure({
            history: false,
        }),
        Underline,
    ]

    const editor = useEditor({
        extensions: extensions,
        editorProps: {
            attributes: {
                id: editorId
            }
        },
        content: task.description,
        onUpdate: ({editor}) => {
            updateTaskMutation.mutate({
                description: editor.getHTML()
            })
        }
    })

    useEffect(() => {
        return () => {
            const html = editor?.getHTML()
            if (html) {
                updateTaskMutation.mutate({
                    description: html
                })
            }
        }
    }, []);

    if (!editor) return <div className={"center"}>Laden ...</div>

    return <>
        <div
            aria-label={"editor"}
            className={`scrollbar ${classes.editorContainer}`}
            onClick={() => document.getElementById(editorId)?.focus()}
        >
            <RichTextEditor
                editor={editor}
                classNames={{
                    content: `${classes.content}`,
                    root: `${classes.root}`,
                }}
            >
                <RichTextEditorContent/>
            </RichTextEditor>
        </div>

        <div
            {...events}
            ref={ref}
            className={classes.menuBarContainer}
        >
            <MenuBar editor={editor}/>
        </div>
    </>
}