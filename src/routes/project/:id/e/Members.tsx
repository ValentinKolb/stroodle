import {ProjectModel, UserViewModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import {queryClient} from "../../../../main.tsx";
import classes from "./index.module.css";
import {Box, Button} from "@mantine/core";
import UserSearch from "../../../../components/input/UserSearch.tsx";
import {useForm} from "@mantine/form";
import {useMutation} from "@tanstack/react-query";
import {useCustomNavigate} from "../../../../components/layout/Navigation/Custom/util.ts";

export default function EditProjectMembers({project}: { project: ProjectModel }) {

    const {pb, user} = usePB()

    const navigate = useCustomNavigate()
    const close = () => navigate(`/project/${project.id}`)

    const formValues = useForm({
        initialValues: {
            members: (project.expand?.members || []) as UserViewModel[]
        }
    })

    const editMembersMutation = useMutation({
        mutationFn: async () => {
            await pb.collection('projects').update(project.id, {members: [user?.id, ...formValues.values.members.map(m => m.id)]})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['project', project.id]}).then(() =>
                close()
            )
        }
    })

    return <form
        className={classes.container}
        onSubmit={formValues.onSubmit(() => editMembersMutation.mutate())}
    >

        <div className={classes.title}>
            Projektmitglieder
        </div>

        <Box w={"100%"}>
            <UserSearch
                selectedUsers={formValues.values.members}
                setSelectedUsers={(users) => formValues.setFieldValue('members', users)}
            />
        </Box>
        <div className={classes.btnGroup}>
            <Button
                onClick={close}
                variant={"subtle"}
                color={"orange"}
                loading={editMembersMutation.isPending}
            >
                Abbrechen
            </Button>
            <Button
                variant={"subtle"}
                color={"green"}
                type={"submit"}
                loading={editMembersMutation.isPending}
            >
                Speichern
            </Button>
        </div>
    </form>
}
