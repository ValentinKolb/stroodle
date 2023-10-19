import {ProjectModel, TaskModel} from "../../../../../lib/models.ts";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {RichTextEditor, RichTextEditorContent} from "@mantine/tiptap";
import classes from "./index.module.css";
import {useMutation} from "@tanstack/react-query";
import {usePB} from "../../../../../lib/pocketbase.tsx";
import {ActionIcon} from "@mantine/core";
import {IconDeviceFloppy} from "@tabler/icons-react";
import {useEffect} from "react";
import {queryClient} from "../../../../../main.tsx";
import MenuBar from "./MenuBar.tsx";
import {cleanHtmlString} from "../../../../../components/input/Editor";


export default function TaskEditor({task}: { project: ProjectModel, task: TaskModel }) {

    const {pb} = usePB()

    const editorId = `taskEditor-${task.id}`

    const updateTaskMutation = useMutation({
        mutationFn: async ({description}: { description: string }) => {
            return await pb.collection('tasks').update(task.id, {
                description: cleanHtmlString(description)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['project', task.projectId, 'tasks', task.id]
            })
            queryClient.invalidateQueries({
                queryKey: ['project', task.projectId, 'tasks']
            })

            console.log("invalidate", ['project', task.projectId, 'tasks', task.id])
        }
    })

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
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

        <div className={classes.menuBarContainer}>
            <MenuBar editor={editor}/>

            <div className={classes.iconGroup}>
                <ActionIcon
                    aria-label={"save"}
                    className={classes.icon}
                >
                    <IconDeviceFloppy/>
                </ActionIcon>
            </div>
        </div>
    </>
}