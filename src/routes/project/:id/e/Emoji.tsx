import {useForm} from "@mantine/form";
import {ProjectModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {useMutation} from "@tanstack/react-query";
import {queryClient} from "../../../../main.tsx";
import classes from "./index.module.css";
import {Avatar, Button} from "@mantine/core";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {useCustomNavigate} from "../../../../components/layout/Navigation/Custom/util.ts";

export default function EditProjectEmoji({project}: { project: ProjectModel }) {

    const {pb} = usePB()

    const navigate = useCustomNavigate()
    const close = () => navigate(`/project/${project.id}`)


    const formValues = useForm({
        initialValues: {
            emoji: project.emoji || ""
        }
    })

    const editEmojiMutation = useMutation({
        mutationFn: async () => {
            await pb.collection('projects').update(project.id, {emoji: formValues.values.emoji.trim()})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['project', project.id]}).then(() =>
                close()
            )
        }
    })

    return <form
        onSubmit={formValues.onSubmit(() => editEmojiMutation.mutate())}
        className={classes.container}
    >
        <div className={classes.title}>
            Projekt-Emoji
        </div>

        <Avatar size={"xl"} >
            {formValues.values.emoji}
        </Avatar>

        <Picker
            data={data}
            previewPosition={"none"}
            skinTonePosition={"none"}
            navPosition={"none"}
            theme={"light"}
            icons={"outline"}
            onEmojiSelect={(emoji: { native: string }) => {
                formValues.setFieldValue('emoji', emoji.native)
            }}
        />

        <div className={classes.btnGroup}>
            <Button
                onClick={close}
                variant={"subtle"}
                color={"orange"}
            >
                Abbrechen
            </Button>

            <Button
                variant={"subtle"}
                color={"green"}
                type={"submit"}
                loading={editEmojiMutation.isPending}
            >
                Speichern
            </Button>
        </div>
    </form>
}
