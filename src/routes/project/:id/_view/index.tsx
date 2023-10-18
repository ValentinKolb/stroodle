import {List, Text} from "@mantine/core";
import {ProjectModel, UserModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import UserAvatar from "../../../../components/UserAvatar.tsx";
import FieldLink from "../../../../components/FieldLink";

export default function ProjectView({project}: { project: ProjectModel }) {

    const {user} = usePB()

    return <>

        <FieldLink legend={"Beschreibung"} to={"e/desc"}>
            <Text>
                {project.description ? project.description : "Klicken um eine Beschreibung hinzuzufügen ..."}
            </Text>
        </FieldLink>

        <FieldLink legend={"Teilnehmende"} to={"e/members"}>
            <List>
                {(project.expand?.members || []).map((member: UserModel) =>
                    <List.Item
                        key={member.id}
                        icon={<UserAvatar user={member} size={"md"}/>}
                    >
                        <Text size={"sm"}>
                            @{member.username}
                            {member.id === user?.id &&
                                " (Du)"
                            }
                        </Text>
                    </List.Item>
                )}
            </List>
        </FieldLink>
    </>
}