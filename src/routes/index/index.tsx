import {Box, Button, Group, Image, List, rem, Text, ThemeIcon} from '@mantine/core'
import {IconCheck, IconForklift, IconLogin, IconUser, IconUserPlus} from '@tabler/icons-react'
import {usePB} from "../../lib/pocketbase.tsx";

import classes from './index.module.css'
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";

export default function Home() {

    const {user} = usePB()

    return (
        <div className={classes.container}>
            <div className={classes.contentContainer}>

                {/*Title*/}
                <Group>
                    <Image
                        src={"/logo-square.svg"}
                        alt={"Stroodle Logo"}
                        className={classes.titleImage}
                    />
                    <Box className={classes.title}>
                        <Text span variant={"gradient"} gradient={{from: "cyan", to: "blue", deg: 45}} inherit>
                            Stroodle
                        </Text>
                        <Text span c={"cyan"} inherit>
                            {"."}
                        </Text>
                        <Text span variant={"gradient"} gradient={{from: "blue", to: "cyan", deg: 45}} inherit>
                            me
                        </Text>
                    </Box>
                </Group>

                {/* Tablet & Mobile Image */}
                <Image
                    src={"/woman-sitting-robot.svg"}
                    className={classes.imgMobile}
                />

                {/*Subtitle*/}
                <Text className={classes.subtitle}>
                    Projektmanagement so einfach wie Chatten.
                </Text>

                {/*Description*/}
                <Text c="dimmed">
                    Ein zentraler Chat ist der Dreh- und Angelpunkt für dein gesamtes Team.
                    Schluss mit verwirrenden E-Mail-Threads, verlorenen Dateien und Verzögerungen.
                    Projektmanagement wird zur Unterhaltung.
                </Text>

                {/*Buttons*/}
                <div className={classes.btnGroup}>
                    {user == null ? <>
                            <CustomLink to={"/register"}>
                                <Button variant={"transparent"} leftSection={<IconUserPlus/>}>
                                    Registrieren
                                </Button>
                            </CustomLink>
                            <CustomLink to={"/login"}>
                                <Button variant={"transparent"} color={"green"} leftSection={<IconLogin/>}>
                                    Einloggen
                                </Button>
                            </CustomLink>
                        </>
                        :
                        <>
                            <CustomLink to={"/project"}>
                                <Button variant={"transparent"} leftSection={<IconForklift/>}>
                                    Projekte
                                </Button>
                            </CustomLink>
                            <CustomLink to={"/account"}>
                                <Button variant="transparent" color={"green"} leftSection={<IconUser/>}>
                                    Account
                                </Button>
                            </CustomLink>
                        </>
                    }
                </div>

                {/*Features-List*/}
                <List
                    miw={"45%"}
                    spacing="sm"
                    size="sm"
                    icon={
                        <ThemeIcon size={20} radius="xl">
                            <IconCheck size={rem(12)} stroke={1.5}/>
                        </ThemeIcon>
                    }
                >
                    <List.Item>
                        <b>Zentralisierter Chat</b> - Der Chat ist dein zentraler Ort für alles, was mit dem
                        Projekt zu tun hat.
                    </List.Item>
                    <List.Item>
                        <b>Automatisierter Zugriff</b> - Füge Personen zum Chat hinzu und sie haben sofort
                        Zugriff auf Projektinfos.
                    </List.Item>
                    <List.Item>
                        <b>Einfachheit und Flexibilität</b> - Manage kleine und große Projekte gleichermaßen
                        einfach.
                    </List.Item>
                </List>
            </div>

            <Image
                src={"/woman-sitting.svg"}
                className={classes.imgDesktop}
            />
        </div>
    )
}