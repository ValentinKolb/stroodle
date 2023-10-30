import {ProjectModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {queryClient} from "../../../../main.tsx";
import classes from "./index.module.css";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "@mantine/form";
import {useCustomNavigate} from "../../../../components/layout/Navigation/Custom/util.ts";
import {useEffect} from "react";
import TextEditor, {cleanHtmlString} from "../../../../components/input/Editor";

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
            await pb.collection('projects')
                .update(project.id, {
                    description: cleanHtmlString(formValues.values.description)
                })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['project', project.id]}).then(() =>
                close()
            )
        }
    })

    useEffect(() => {
        editDescMutation.mutate()
    }, [formValues.values.description, editDescMutation]);

    return <div
        className={classes.container}
    >
        <div className={classes.title}>
            Projektbeschreibung
        </div>

        <TextEditor
            value={formValues.values.description}
            onChange={s => formValues.setFieldValue('description', s)}
            fullToolbar
            placeholder={"Projekt Beschreibung hinzuzufügen ..."}
            maxHeight={"50vh"}
        />
    </div>
}