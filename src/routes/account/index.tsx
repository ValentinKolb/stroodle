import {
    ActionIcon,
    Avatar,
    Box,
    Divider,
    Flex,
    Group,
    Modal,
    Text,
    ThemeIcon,
    Tooltip,
    useMantineTheme
} from '@mantine/core';
import {usePB} from "../../lib/pocketbase.tsx";
import {
    IconAdjustments,
    IconChartArrowsVertical,
    IconDiscountCheck,
    IconLogout,
    IconPassword,
    IconPencil,
    IconQrcode,
    IconTrash,
    IconUserEdit
} from "@tabler/icons-react";
import ContactQRCard from "../../components/ContactQRCard.tsx";
import {Link, Outlet, Route, Routes} from "react-router-dom";
import Header from "../../components/layout/Header";
import classes from "./index.module.css";
import EditUserPassword from "./e/Password.tsx";
import EditUserDescription from "./e/Description.tsx";
import DeleteUser from "./e/Delete.tsx";
import EditUserAvatar from "./e/Avatar.tsx";
import {useMobile} from "../../lib/uiUtil.tsx";
import FieldLink from "../../components/FieldLink";
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import {CustomNavigate} from "../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {useCustomNavigate} from "../../components/layout/Navigation/Custom/util.ts";
import Html from '../../components/Html/index.tsx';

function AccountView() {

    const {pb, user, logout} = usePB()
    const theme = useMantineTheme()

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

        {user.email}

        <FieldLink legend={"Job"} to={"e/desc"}>
            {user.jobTitle}
        </FieldLink>

        <FieldLink legend={"Über dich"} to={"e/desc"}>
            {user.aboutMe ? <Html>{user.aboutMe}</Html> :
                <Text c={"dimmed"}>Klicke um eine Beschreibung hinzuzufügen ...</Text>}
        </FieldLink>

        <Box
            p={"lg"}
            style={() => ({
                height: "100wh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            })}
        >
            <Box
                p={"lg"}
                style={(theme) => ({
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                    borderRadius: theme.radius.md,
                    boxShadow: theme.shadows.md,
                    maxWidth: 500,
                })}
            >

                <Group>
                    <Text c={'teal'} size="xl" fw={600}>
                        @{user.username}
                    </Text>

                    <Tooltip label={"Verifiziert"}>
                        <IconDiscountCheck size={"1rem"} color={theme.colors.green[5]}/>
                    </Tooltip>
                </Group>

                <Flex gap={"xs"} ta={"center"}>

                    <Text ta="center" c="dimmed" fz="sm">
                        {user.email}
                    </Text>

                    <Text ta="center" c="dimmed" fz="sm">
                        {" • "}
                    </Text>

                    {
                        user.jobTitle && <> <Text ta="center" c="dimmed" fz="sm">
                            {user.jobTitle}
                        </Text>

                            <Text ta="center" c="dimmed" fz="sm">
                                {" • "}
                            </Text>
                        </>
                    }

                    <ActionIcon
                        component={Link}
                        to={"./qr"}
                        aria-label={"Show QR Code"}
                        variant="transparent"
                        radius="xl"
                        size="xs"
                        color={"gray"}
                    >
                        <IconQrcode size="1rem" stroke={1.5}/>
                    </ActionIcon>
                </Flex>

                {user.aboutMe && <>
                    <Divider
                        w={"100%"}
                        labelPosition="center"
                        color={"gray"}
                        variant="dotted"
                        label={<>
                            <Box ml={5}>Über dich</Box>
                        </>}
                    />
                    <Text fz="sm" c="dimmed">{user.aboutMe}</Text>
                </>}

                <Divider
                    w={"100%"}
                    labelPosition="center"
                    color={"gray"}
                    variant="dotted"
                    label={<>
                        <IconChartArrowsVertical size={12}/>
                        <Box ml={5}>Statistik</Box>
                    </>}
                />

                <Group justify="center" gap={30}>
                    <Box>
                        <Text ta="center" fz="lg" fw={500}>
                            20
                        </Text>
                        <Text ta="center" fz="sm" c="dimmed">
                            Projekte
                        </Text>
                    </Box>
                    <Box>
                        <Text ta="center" fz="lg" fw={500}>
                            42
                        </Text>
                        <Text ta="center" fz="sm" c="dimmed">
                            Offene ToDos
                        </Text>
                    </Box>
                    <Box>
                        <Text ta="center" fz="lg" fw={500}>
                            60
                        </Text>
                        <Text ta="center" fz="sm" c="dimmed">
                            Unbea. Nachr.
                        </Text>
                    </Box>
                </Group>

                <Divider
                    w={"100%"}
                    labelPosition="center"
                    color={"gray"}
                    variant="dotted"
                    label={<>
                        <IconAdjustments size={12}/>
                        <Box ml={5}>Einstellungen</Box>
                    </>}
                />

                <Group>
                    <Tooltip label={"Account"}>
                        <ActionIcon
                            component={Link}
                            replace
                            to={"./e/desc"}
                            variant="subtle"
                            aria-label={"Edit Account"}
                            color={"blue"}
                        >
                            <IconUserEdit/>
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label={"Passwort ändern"}>
                        <ActionIcon
                            component={Link}
                            replace
                            to={"./e/pwd"}
                            variant="subtle"
                            aria-label={"Change Password"}
                            color={"blue"}
                        >
                            <IconPassword/>
                        </ActionIcon>
                    </Tooltip>

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

                    <Divider orientation="vertical"/>

                    <Tooltip label={"Account löschen"} color={"red"}>
                        <ActionIcon
                            component={Link}
                            replace
                            to={"./e/delete"}
                            variant="subtle"
                            aria-label={"Delete Account"}
                            color={"red"}
                        >
                            <IconTrash/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Box>
        </Box>
    </div>
}

export default function Account() {
    const isMobile = useMobile()
    const navigate = useCustomNavigate()

    const close = () => navigate("/account")

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