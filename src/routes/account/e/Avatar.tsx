import {usePB} from "../../../lib/pocketbase.tsx";
import {useForm} from "@mantine/form";
import {useMutation} from "@tanstack/react-query";
import {Alert, Button, Image, Title} from "@mantine/core";
import ImageSelect from "../../../components/input/ImageSelect.tsx";
import classes from "./index.module.css";
import {IconAlertCircle, IconCheck, IconPhotoX, IconX} from "@tabler/icons-react";
import {CustomNavigate} from "../../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {useCustomNavigate} from "../../../components/layout/Navigation/Custom/util.ts";

const EditUserAvatar = () => {

    const {pb, user, refresh} = usePB()
    const navigate = useCustomNavigate()

    const formValues = useForm({
        initialValues: {
            avatar: null as File | null
        }
    })

    const changeAvatarMutation = useMutation({
        mutationFn: async () => {
            if (formValues.values.avatar) {
                const data = new FormData()
                data.append("avatar", formValues.values.avatar)
                await pb.collection("users").update(user!.id, data)
            }
        },
        onSuccess: async () => {
            await refresh()
            navigate("/account", {discardFromState: true})
        }
    })

    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }

    return <form
        className={classes.container}
        onSubmit={formValues.onSubmit(() => changeAvatarMutation.mutate())}
    >

        <Title className={classes.title}>
            Profilbild ändern
        </Title>

        {
            formValues.values.avatar ?
                <Image
                    className={classes.image}
                    src={URL.createObjectURL(formValues.values.avatar)}
                    alt={"Avatar"}
                />
                :
                <ImageSelect
                    onChange={(file) => formValues.setFieldValue("avatar", file[0])}
                    fileCount={formValues.values.avatar ? 1 : 0}
                    maxFileCount={1}
                />
        }

        {changeAvatarMutation.isError && (
            <Alert icon={<IconAlertCircle size="1rem"/>} c="red">
                Dein Profilbild konnte nicht geändert werden. Bitte versuche es später erneut.
            </Alert>
        )}

        <div className={classes.btnGroup}>
            {
                formValues.values.avatar ?
                    <Button
                        leftSection={<IconPhotoX/>}
                        variant={"subtle"}
                        c={"red"}
                        onClick={formValues.reset}
                    >
                        Anderes Bild
                    </Button>
                    :
                    <Button
                        leftSection={<IconX/>}
                        variant={"subtle"}
                        c={"red"}
                        onClick={() => navigate("/account", {discardFromState: true})}
                    >
                        Abbrechen
                    </Button>
            }

            <Button
                leftSection={<IconCheck/>}
                variant={"subtle"}
                c={"green"}
                type={"submit"}
                loading={changeAvatarMutation.isPending}
            >
                Speichern
            </Button>
        </div>
    </form>
}

export default EditUserAvatar