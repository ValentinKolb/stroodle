import {ProjectModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {queryClient} from "../../../../main.tsx";
import classes from "./index.module.css";
import {Button, Textarea} from "@mantine/core";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "@mantine/form";
import {useCustomNavigate} from "../../../../components/layout/Navigation/Custom/util.ts";

export default function EditProjectDescription({project}: { project: ProjectModel }) {

    const {pb} = usePB()

    const navigate = useCustomNavigate()
    const close = () => navigate(`/project/${project.id}`)

    const formValues = useForm({
        initialValues: {
            description: project.description || ""
        }
    })

    const editDescMutation = useMutation({
        mutationFn: async () => {
            await pb.collection('projects').update(project.id, {description: formValues.values.description.trim()})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['project', project.id]}).then(() =>
                close()
            )
        }
    })

    return <form
        className={classes.container}
        onSubmit={formValues.onSubmit(() => editDescMutation.mutate())}
    >
        <div className={classes.title}>
            Projektbeschreibung
        </div>
        <Textarea
            w={"100%"}
            autosize
            minRows={5}
            maxRows={10}
            {...formValues.getInputProps('description')}
        />
        <div className={classes.btnGroup}>
            <Button
                onClick={close}
                variant={"subtle"}
                color={"orange"}
                loading={editDescMutation.isPending}
            >
                Abbrechen
            </Button>
            <Button
                variant={"subtle"}
                color={"green"}
                type={"submit"}
                loading={editDescMutation.isPending}
            >
                Speichern
            </Button>
        </div>
    </form>
}