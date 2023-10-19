import {ActionIcon, Avatar, Modal, Text, ThemeIcon, Tooltip} from '@mantine/core';
import {usePB} from "../../lib/pocketbase.tsx";
import {IconLogout, IconPencil, IconReload, IconTrash} from "@tabler/icons-react";
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

function AccountView() {

    const {pb, user, logout, refresh} = usePB()

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
                <Modal centered={isMobile} opened onClose={close} withCloseButton={false}>
                    <ContactQRCard close={close}/>
                </Modal>
            )}/>

            <Route path={"e/pwd"} element={(
                <Modal centered={isMobile} opened onClose={close} withCloseButton={false}>
                    <EditUserPassword/>
                </Modal>
            )}/>

            <Route path={"e/desc"} element={(
                <Modal centered={isMobile} opened onClose={close} withCloseButton={false}>
                    <EditUserDescription/>
                </Modal>
            )}/>

            <Route path={"e/avatar"} element={(
                <Modal centered={isMobile} opened onClose={close} withCloseButton={false}>
                    <EditUserAvatar/>
                </Modal>
            )}/>

            <Route path={"e/delete"} element={(
                <Modal centered={isMobile} opened onClose={close} withCloseButton={false} size={"xs"}>
                    <DeleteUser/>
                </Modal>
            )}/>
        </Routes>

        <Outlet/>
    </>
}