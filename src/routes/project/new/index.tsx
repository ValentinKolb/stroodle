import {Alert, Button, Modal, Text, TextInput} from "@mantine/core";
import classes from "./index.module.css";
import {useForm} from "@mantine/form";
import {IconExclamationMark} from "@tabler/icons-react";
import {ProjectModel} from "../../../lib/models.ts";
import {useMutation} from "@tanstack/react-query";
import {usePB} from "../../../lib/pocketbase.tsx";
import {ClientResponseError} from "pocketbase";
import {queryClient} from "../../../main.tsx";
import z from "zod";
import {useMobile} from "../../../lib/uiUtil.tsx";
import {useCustomNavigate} from "../../../components/layout/Navigation/Custom/util.ts";


export default function NewProject() {

    const {pb, user} = usePB()
    const navigate = useCustomNavigate()

    const isMobile = useMobile()

    const formValues = useForm({
        initialValues: {
            name: "",
        },
        validate: {
            name: value => z.string().min(3).max(50).nonempty().safeParse(value).success ? null : "Name muss zwischen 3 und 50 Zeichen lang sein",
        }
    })

    const editProjectMutation = useMutation<ProjectModel, ClientResponseError>({
        mutationFn: async () => {
            const data = {
                name: formValues.values.name.trim(),
                emoji: '🚀',
                members: [user!.id],
            }

            return await pb.collection('projects').create<ProjectModel>(data)
        },
        onSuccess: (record) => {
            queryClient.invalidateQueries({queryKey: ['projects']}).then(() =>
                navigate(`/project/${record.id}`)
            )
        }
    })


    return <Modal opened onClose={() => navigate(-1)} withCloseButton={false} centered={isMobile} size={"xs"}>
        <form
            className={classes.container}
            onSubmit={formValues.onSubmit(() => editProjectMutation.mutate())}
        >
            <div className={classes.title}>
                Neues Projekt erstellen
            </div>

            <TextInput
                w={"100%"}
                placeholder="Mein Projekt"
                aria-label="project name"
                required
                {...formValues.getInputProps("name")}
            />

            <Text c={"dimmed"} size={"xs"}>
                Das Projekt wird automatisch mit dir als Mitglied erstellt.
                Alle Einstellungen können später geändert werden.
            </Text>

            {editProjectMutation.isError && (
                <Alert variant="light" color="red" title="Fehler" icon={<IconExclamationMark/>}>
                    Das Projekt konnte nicht erstellt werden. Bitte versuche es später erneut.
                </Alert>
            )}

            <Button
                loading={editProjectMutation.isPending}
                type={"submit"}
                color={"green"}
                variant={"subtle"}
            >
                Erstellen
            </Button>
        </form>
    </Modal>
}