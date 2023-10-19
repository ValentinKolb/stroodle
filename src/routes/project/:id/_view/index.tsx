import {Text, TextInput, ThemeIcon} from "@mantine/core";
import {ProjectModel, UserModel} from "../../../../lib/models.ts";
import {usePB} from "../../../../lib/pocketbase.tsx";
import UserAvatar from "../../../../components/UserAvatar.tsx";
import FieldLink, {FieldDiv} from "../../../../components/FieldLink";
import classes from "./index.module.css";
import {CustomLink} from "../../../../components/layout/Navigation/Custom/CustomLink.tsx";
import {IconUserEdit} from "@tabler/icons-react";
import {useState} from "react";

export default function ProjectView({project}: { project: ProjectModel }) {

    const {user} = usePB()

    const [userSearch, setUserSearch] = useState("")

    const users = (project.expand?.members || []).filter((member: UserModel) => {
        return member.username.startsWith(userSearch.replace("@", ""))
    })

    return <>

        <FieldLink legend={"Beschreibung"} to={"e/desc"}>
            <Text>
                {project.description ? project.description : "Klicken um eine Beschreibung hinzuzufügen ..."}
            </Text>
        </FieldLink>

        <FieldDiv legend={"Teilnehmende"} scrollable>
            <TextInput
                placeholder={"Suchen"}
                variant={"unstyled"}
                size={"sm"}
                value={userSearch}
                onChange={(e) => setUserSearch(e.currentTarget.value)}
                rightSection={
                    <CustomLink to={"e/members"} className={"center"}>
                        <ThemeIcon variant={"transparent"}>
                            <IconUserEdit/>
                        </ThemeIcon>
                    </CustomLink>
                }
            />

            <ul className={classes.list}>
                {users.map((member: UserModel) =>
                    <li key={member.id} className={classes.listItem}>
                        <UserAvatar user={member} size={"md"}/>
                        <div className={classes.username}>
                            @{member.username}
                            {member.id === user?.id &&
                                " (Du)"
                            }
                        </div>
                    </li>
                )}
            </ul>
        </FieldDiv>
    </>
}