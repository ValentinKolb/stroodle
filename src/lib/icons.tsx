import {ThemeIcon, ThemeIconProps} from "@mantine/core";
import {IconCheckbox, IconFiles, IconFlag, IconMessage2, IconNote} from "@tabler/icons-react";


export const BrandIconTopic = (props: ThemeIconProps) => (
    <ThemeIcon
        variant={"transparent"} {...props}
    >
        <IconFlag/>
    </ThemeIcon>
)

export const BrandIconChat = (props: ThemeIconProps) => (
    <ThemeIcon
        color={"messageColor"} variant={"transparent"} {...props}
    >
        <IconMessage2/>
    </ThemeIcon>
)

export const BrandIconTask = (props: ThemeIconProps) => (
    <ThemeIcon
        color={"taskColor"} variant={"transparent"} {...props}
    >
        <IconCheckbox/>
    </ThemeIcon>
)

export const BrandIconNotes = (props: ThemeIconProps) => (
    <ThemeIcon
        color={"noteColor"} variant={"transparent"} {...props}
    >
        <IconNote/>
    </ThemeIcon>
)

export const BrandIconFiles = (props: ThemeIconProps) => (
    <ThemeIcon
        color={"fileColor"} variant={"transparent"} {...props}
    >
        <IconFiles/>
    </ThemeIcon>
)