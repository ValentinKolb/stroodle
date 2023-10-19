import {usePB} from "../../../lib/pocketbase.tsx";
import {useMutation} from "@tanstack/react-query";
import {Alert, Button, TextInput, Title} from "@mantine/core";
import {IconAlertCircle, IconCheck, IconTrash} from "@tabler/icons-react";
import classes from "./index.module.css";
import {useState} from "react";
import {CustomNavigate} from "../../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {useCustomNavigate} from "../../../components/layout/Navigation/Custom/util.ts";

const DeleteUser = () => {
    const {user, pb, refresh} = usePB()
    const navigate = useCustomNavigate()

    const [deleteConfirm, setDeleteConfirm] = useState("")

    const editMutation = useMutation({
        mutationFn: async () => (
            deleteConfirm === user!.username && await pb.collection("users").delete(user!.id)
        ),
        onSuccess: async () => {
            await refresh()
            navigate("/register" , {discardFromState: true})
        }
    })

    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }

    return <form
        className={classes.container}
        onSubmit={(e) => {
            e.preventDefault()
            if (deleteConfirm === user.username) editMutation.mutate()
        }}
    >
        <Title className={classes.title} c={"red"}>
            Account löschen
        </Title>

        <TextInput
            label="Bestätige mit Deinem Nutzernamen"
            description={"Das löschen Deines Accounts kann nicht rückgängig gemacht werden!"}
            placeholder={user.username}
            required
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.currentTarget.value)}
        />

        {editMutation.isError && (
            <Alert icon={<IconAlertCircle size="1rem"/>} color="red">
                Dein Account konnte nicht gelöscht werden. Bitte versuche es später erneut.
            </Alert>
        )}

        <div className={classes.btnGroup}>
            <Button
                leftSection={<IconTrash/>}
                variant={"subtle"}
                color={"red"}
                type={"submit"}
                loading={editMutation.isPending}
                disabled={deleteConfirm !== user.username}
            >
                Löschen
            </Button>

            <Button
                leftSection={<IconCheck/>}
                variant={"subtle"}
                color={"green"}
                onClick={() => navigate("/account", {discardFromState: true})}
            >
                Abbrechen
            </Button>
        </div>
    </form>
}

export default DeleteUser