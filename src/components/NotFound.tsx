import {Button, Image, Text, ThemeIcon} from '@mantine/core';

import {IconMoodSad} from "@tabler/icons-react";
import {usePB} from "../lib/pocketbase.tsx";
import {CustomLink} from "./layout/Navigation/Custom/CustomLink.tsx";


export default function NotFound({text}: { text?: string }) {
    const {user} = usePB()
    return (
        <div className={"center"}>
            {!text && <Image
                src={"/logo.svg"}
                maw={100}
                mah={100}
            />}
            <Text c={"dimmed"}>{text ?? "404 - Nicht gefunden"}</Text>
            <ThemeIcon color={"orange"} variant={"transparent"}>
                <IconMoodSad/>
            </ThemeIcon>
            <CustomLink to={user ? "/project" : "/"}>
                <Button variant={"transparent"}>
                    Zurück
                </Button>
            </CustomLink>
        </div>
    )
}