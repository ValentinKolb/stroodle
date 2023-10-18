import {usePB} from "../../../lib/pocketbase.tsx";
import {useForm} from "@mantine/form";
import z from "zod";
import {useMutation} from "@tanstack/react-query";
import {Alert, Button, TextInput, Title} from "@mantine/core";
import {IconAlertCircle, IconCheck, IconX} from "@tabler/icons-react";
import classes from "./index.module.css";
import {CustomNavigate} from "../../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {useCustomNavigate} from "../../../components/layout/Navigation/Custom/util.ts";
import TextEditor, {cleanHtmlString} from "../../../components/input/Editor";

const EditUserDescription = () => {
    const {user, pb, refresh} = usePB()
    const navigate = useCustomNavigate()

    const formValues = useForm({
        initialValues: {
            jobTitle: user?.jobTitle || "",
            aboutMe: user?.aboutMe || "",
        },
        validate: (values) => (
            {jobTitle: !z.string().max(50).safeParse(values.jobTitle).success && "Der Jobtitel darf maximal 50 Zeichen lang sein",}
        ),
    })

    const editMutation = useMutation({
        mutationFn: async () => (
            await pb.collection("users").update(user!.id, {
                jobTitle: formValues.values.jobTitle || null,
                aboutMe: cleanHtmlString(formValues.values.aboutMe) || null,
            })
        ),
        onSuccess: async () => {
            await refresh()
            navigate("/account")
        }
    })

    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }

    return <form className={classes.container} onSubmit={formValues.onSubmit(() => editMutation.mutate())}>
        <Title className={classes.title}>
            Account bearbeiten
        </Title>
        <TextInput
            label="Dein Job"
            placeholder="Was machst Du beruflich?"
            description={"Lass andere wissen, was Du beruflich machst."}
            mb={"sm"}
            {...formValues.getInputProps("jobTitle")}
        />
        <TextEditor
            label="Über Dich"
            placeholder="Was macht Dich aus?"
            description={"Hier kannst Du anderen Nutzern etwas über Dich erzählen."}
            onChange={(s) => formValues.setFieldValue("aboutMe", s)}
            value={formValues.values.aboutMe}
            error={formValues.errors.aboutMe}
        />
        {editMutation.isError && (
            <Alert icon={<IconAlertCircle size="1rem"/>} c="red">
                Dein Profil konnte nicht bearbeitet werden. Bitte versuche es später erneut.
            </Alert>
        )}
        <div className={classes.btnGroup}>
            <Button
                leftSection={<IconX/>}
                variant={"subtle"}
                c={"red"}
                onClick={() => navigate("/account")}
            >
                Abbrechen
            </Button>
            <Button
                leftSection={<IconCheck/>}
                variant={"subtle"}
                c={"green"}
                type={"submit"}
                loading={editMutation.isPending}
            >
                Speichern
            </Button>
        </div>
    </form>
}
export default EditUserDescription