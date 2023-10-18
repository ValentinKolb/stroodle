import {usePB} from "../../../lib/pocketbase.tsx";
import {useForm} from "@mantine/form";
import PasswordStrengthMeter, {getPasswordStrength} from "../../../components/input/PasswordStrengthMeter.tsx";
import {useMutation} from "@tanstack/react-query";
import {Alert, Button, Divider, PasswordInput, Title} from "@mantine/core";
import {IconAlertCircle, IconCheck, IconX} from "@tabler/icons-react";
import classes from "./index.module.css";
import {CustomNavigate} from "../../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {useCustomNavigate} from "../../../components/layout/Navigation/Custom/util.ts";

const EditUserPassword = () => {
    const {user, pb, refresh} = usePB()
    const navigate = useCustomNavigate()

    const formValues = useForm({
        initialValues: {
            oldPassword: '',
            password: '',
            passwordConfirm: '',
        },
        validate: (values) => (
            {
                password: getPasswordStrength(values.password) !== 100 && "Ungültiges Passwort",
                passwordConfirm: values.password !== values.passwordConfirm && "Die Passwörter stimmen nicht überein",
            }
        ),
    })

    const editMutation = useMutation({
        mutationFn: async () => (
            await pb.collection("users").update(user!.id, formValues.values)
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
            Passwort ändern
        </Title>

        <PasswordInput
            label="Altes Passwort"
            placeholder="Altes Passwort"
            required
            {...formValues.getInputProps("oldPassword")}
        />

        <Divider/>

        <PasswordInput
            label="Neues Passwort"
            placeholder="Neues Passwort"
            required
            {...formValues.getInputProps("password")}
        />

        <PasswordInput
            label="Neues Passwort wiederholen"
            placeholder="Neues Passwort wiederholen"
            required
            {...formValues.getInputProps("passwordConfirm")}
        />

        <PasswordStrengthMeter
            password={formValues.values.password}
            passwordConfirm={formValues.values.passwordConfirm}
        />

        {editMutation.isError && (
            <Alert icon={<IconAlertCircle size="1rem"/>} color="red">
                Dein Passwort konnte nicht geändert werden. Ist das alte Passwort korrekt?
            </Alert>
        )}

        <div className={classes.btnGroup}>
            <Button
                leftSection={<IconX/>}
                variant={"subtle"}
                color={"red"}
                onClick={() => navigate("/account")}
            >
                Abbrechen
            </Button>

            <Button
                leftSection={<IconCheck/>}
                variant={"subtle"}
                color={"green"}
                type={"submit"}
                loading={editMutation.isPending}
            >
                Ändern
            </Button>
        </div>
    </form>
}
export default EditUserPassword