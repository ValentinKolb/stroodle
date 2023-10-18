import {UserModel} from "../lib/models.ts";
import {Avatar, AvatarProps} from "@mantine/core";
import {usePB} from "../lib/pocketbase.tsx";
import React from "react";


const UserAvatar = React.forwardRef(({user, ...props}: { user: UserModel } & AvatarProps, ref: any) => {
    const {pb} = usePB()
    const avatarSrc = user.avatar ? pb.files.getUrl(user, user.avatar) : null

    return <Avatar
        ref={ref}
        src={avatarSrc}
        alt={user.username}
        color={"teal"}
        radius="xl"
        {...props}
    >
        {user.username.slice(0, 2).toUpperCase()}
    </Avatar>
})

UserAvatar.displayName = 'UserAvatar'

export default UserAvatar