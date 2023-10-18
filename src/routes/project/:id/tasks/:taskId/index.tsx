import {ProjectModel, TaskModel} from "../../../../../lib/models.ts";
import {useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Underline} from "@tiptap/extension-underline";
import {RichTextEditor, RichTextEditorContent} from "@mantine/tiptap";
import classes from "./index.module.css";
import {useMutation} from "@tanstack/react-query";
import {usePB} from "../../../../../lib/pocketbase.tsx";

export default function EditTask({task}: { project: ProjectModel, task: TaskModel }) {

    const {pb} = usePB()

    const updateTaskMutation = useMutation({
        mutationFn: async ({description}: { description: string }) => {
            return await pb.collection('tasks').update(task.id, {description})
        }
    })

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: task.description,
        onUpdate: ({editor}) => {
            updateTaskMutation.mutate({
                description: editor.getHTML()
            })
        }
    })

    /*
    useSubscription<TaskModel>({
            idOrName: "tasks",
            callback: (event) => {
                if (!editor || event.record.id !== task.id) return;
                const value = event.record.description
                if (editor.getHTML() === value) return
                const {from, to} = editor.state.selection
                editor.commands.setContent(value, false)
                editor.commands.setTextSelection({from, to})
                queryClient.invalidateQueries({queryKey: ["project", task.project, "tasks", task.id]})
            }
        },
        [editor, task])
     */

    return <>
        <div className={`scrollbar`}>
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
    </>
}