import {ProjectModel} from "../lib/models.ts";
import {Avatar, AvatarProps} from "@mantine/core";

export default function ProjectIcon({project, ...props}: { project: ProjectModel } & AvatarProps) {
    return <>
        <Avatar
            radius={"xl"}
            variant={"light"}
            color={"teal"}
            src={undefined}
            {...props}
        >
            {project.emoji ? project.emoji : project.name[0]}
        </Avatar>
    </>
}