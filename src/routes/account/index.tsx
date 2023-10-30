import {ActionIcon, Avatar, Divider, Modal, Text, ThemeIcon, Tooltip} from '@mantine/core';
import {usePB} from "../../lib/pocketbase.tsx";
import {
    IconLogout,
    IconMessageCircle,
    IconMessageCircleOff,
    IconPencil,
    IconReload,
    IconTrash,
    IconVolume,
    IconVolumeOff
} from "@tabler/icons-react";
import ContactQRCard from "../../components/ContactQRCard.tsx";
import {Outlet, Route, Routes} from "react-router-dom";
import Header from "../../components/layout/Header";
import classes from "./index.module.css";
import EditUserPassword from "./e/Password.tsx";
import EditUserDescription from "./e/Description.tsx";
import DeleteUser from "./e/Delete.tsx";
import EditUserAvatar from "./e/Avatar.tsx";
import {useMobile} from "../../lib/uiUtil.tsx";
import FieldLink, {FieldDiv} from "../../components/FieldLink";
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import {CustomNavigate} from "../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {useCustomNavigate} from "../../components/layout/Navigation/Custom/util.ts";
import Html from '../../components/Html/index.tsx';
import {useMutation} from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import onSound from "/sounds/rising-pops.mp3"
import offSound from "/sounds/disable-sound.mp3"
import {useSwitchSound} from "../../lib/sound.ts";

function AccountView() {

    const {pb, user, logout, refresh} = usePB()

    const [playOn] = useSound(onSound, {volume: 0.25, interrupt: true})
    const [playOff] = useSound(offSound, {volume: 0.25, interrupt: true})
    const switchSound = useSwitchSound()

    const toggleNotificationsMutation = useMutation({
        mutationFn: async () => {
            switchSound(!!user!.notifications)
            return pb.collection("users").update(user!.id, {notifications: !user!.notifications})
        },
        onSuccess: refresh
    })

    const toggleSoundMutation = useMutation({
        mutationFn: async () => {
            user?.sound ? playOff() : playOn()
            return pb.collection("users").update(user!.id, {sound: !user!.sound})
        },
        onSuccess: refresh
    })

    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }

    return <div className={classes.container}>


        <Header
            label={
                <span className={classes.title}>
                    {`@${user.username}`}
                </span>
            }
            leftSection={
                <CustomLink to={"e/avatar"} replace aria-label={"Edit Avatar"}>
                    <div className={classes.avatarContainer}>
                        <Avatar
                            radius={"xl"}
                            c="cyan"
                            variant={"light"}
                            src={pb.getFileUrl(user, user.avatar || "")}
                            alt={user.username}
                        >
                            {user.avatar === null && user.username.slice(0, 2)}
                        </Avatar>
                        <ThemeIcon
                            className={classes.avatarEditBtn}
                            size={"xs"}
                            variant={"filled"}
                            color={"cyan"}
                            radius={"xl"}
                        >
                            <IconPencil/>
                        </ThemeIcon>
                    </div>
                </CustomLink>
            }
        />

        <FieldDiv legend={"Email"}>
            {user.email}
        </FieldDiv>

        <FieldLink legend={"Job"} to={"e/desc"}>
            {user.jobTitle}
        </FieldLink>

        <FieldLink legend={"Über dich"} to={"e/desc"}>
            {user.aboutMe ? <Html>{user.aboutMe}</Html> :
                <Text c={"dimmed"}>Klicke um eine Beschreibung hinzuzufügen ...</Text>}
        </FieldLink>

        <div className={classes.group}>
            <Tooltip label={user.notifications ? "Benachrichtigungen aus" : "Benachrichtigungen ein"}>
                <ActionIcon
                    variant="subtle"
                    onClick={() => toggleNotificationsMutation.mutate()}
                    aria-label={"Notifications"}
                    color={"blue"}
                    loading={toggleNotificationsMutation.isPending}
                >
                    {user.notifications ? <IconMessageCircle/> : <IconMessageCircleOff/>}
                </ActionIcon>
            </Tooltip>

            <Tooltip label={user.sound ? "Töne aus" : "Töne ein"}>
                <ActionIcon
                    variant="subtle"
                    onClick={() => toggleSoundMutation.mutate()}
                    aria-label={"Sounds"}
                    color={"blue"}
                    loading={toggleSoundMutation.isPending}
                >
                    {user.sound ? <IconVolume/> : <IconVolumeOff/>}
                </ActionIcon>
            </Tooltip>

            <Divider orientation={"vertical"}/>

            <Tooltip label={"Ausloggen"}>
                <ActionIcon
                    variant="subtle"
                    onClick={logout}
                    aria-label={"Logout"}
                    color={"blue"}
                >
                    <IconLogout/>
                </ActionIcon>
            </Tooltip>

            <Tooltip label={"Account neu laden"}>
                <ActionIcon
                    variant="subtle"
                    aria-label={"Reload Account"}
                    color={"teal"}
                    onClick={refresh}
                >
                    <IconReload/>
                </ActionIcon>
            </Tooltip>

            <Tooltip label={"Account löschen"} color={"red"}>
                <ActionIcon
                    component={CustomLink}
                    replace
                    to={"./e/delete"}
                    variant="subtle"
                    aria-label={"Delete Account"}
                    color={"red"}
                >
                    <IconTrash/>
                </ActionIcon>
            </Tooltip>

        </div>
    </div>
}

export default function Account() {
    const isMobile = useMobile()
    const navigate = useCustomNavigate()

    const close = () => navigate("/account", {discardFromState: true})

    return <>

        {isMobile && <AccountView/>}

        <Routes>
            {
                !isMobile && <Route index element={
                    <Modal opened onClose={() => navigate(-1)} withCloseButton={false}>
                        <AccountView/>
                    </Modal>
                }/>
            }

            <Route path={"qr"} element={(
                <Modal opened onClose={close} withCloseButton={false}>
                    <ContactQRCard close={close}/>
                </Modal>
            )}/>

            <Route path={"e/pwd"} element={(
                <Modal opened onClose={close} withCloseButton={false}>
                    <EditUserPassword/>
                </Modal>
            )}/>

            <Route path={"e/desc"} element={(
                <Modal opened onClose={close} withCloseButton={false}>
                    <EditUserDescription/>
                </Modal>
            )}/>

            <Route path={"e/avatar"} element={(
                <Modal opened onClose={close} withCloseButton={false}>
                    <EditUserAvatar/>
                </Modal>
            )}/>

            <Route path={"e/delete"} element={(
                <Modal opened onClose={close} withCloseButton={false} size={"xs"}>
                    <DeleteUser/>
                </Modal>
            )}/>
        </Routes>

        <Outlet/>
    </>
}