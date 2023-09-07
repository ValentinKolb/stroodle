import {
    Image,
    Title,
    Button,
    Text,
    List,
    ThemeIcon,
    rem, Box, SpacingValue,
} from '@mantine/core'
import {IconCheck, IconLogin, IconUserPlus} from '@tabler/icons-react'
import {Link, Redirect} from "wouter";
import {usePB} from "../../lib/pocketbase";

const TABLET_BREAKPOINT: SpacingValue = 'md'
const MOBIL_BREAKPOINT: SpacingValue = 'xs'

export default function Home() {

    const {user} = usePB()

    if (user != null) {
        return <Redirect to={"/test"}/>
    }

    return (
        <Box
            px={"xl"}
            py={"auto"}
            sx={(theme) => ({
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "row",
                gap: theme.spacing.xl,
                justifyContent: "center",
                alignItems: "center",

                [theme.fn.smallerThan(TABLET_BREAKPOINT)]: {
                    alignItems: "flex-start",
                },

            })}
        >

            <Box sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.xl,
                maxWidth: rem(480),
                [theme.fn.smallerThan('md')]: {
                    maxWidth: '100%',
                    marginRight: 0,
                },
            })}>

                <Title
                    mx={"auto"}
                    order={1}
                    sx={(theme) => ({
                        lineHeight: 1.2,
                        fontSize: rem(50),
                        fontWeight: 900,
                        transition: 'all 0.2s ease',
                        [theme.fn.smallerThan(MOBIL_BREAKPOINT)]: {
                            fontSize: rem(40),
                        }
                    })}
                >

                    <Text span variant="gradient" gradient={{from: 'blue', to: 'cyan', deg: 45}}>Stroodle</Text>
                    <Text span c={"blue"}>.</Text>
                    <Text span variant="gradient" gradient={{from: 'cyan', to: 'blue', deg: 45}}>me</Text>

                </Title>

                <Image
                    src={"/woman-sitting-robot.svg"}
                    sx={(theme) => ({
                        display: 'none',
                        [theme.fn.smallerThan(TABLET_BREAKPOINT)]: {
                            display: 'block',
                        }
                    })}
                />

                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.xl,
                        [theme.fn.smallerThan(TABLET_BREAKPOINT)]: {
                            flexDirection: 'row',
                        },
                        [theme.fn.smallerThan("sm")]: {
                            flexDirection: 'column',
                        }
                    })}
                >

                    <Box sx={
                        (theme) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing.xl,
                        })
                    }>
                        <Title
                            order={2}
                            sx={(theme) => ({
                                lineHeight: 1.2,
                                fontSize: rem(36),
                                fontWeight: 900,
                                transition: 'all 0.2s ease',

                                [theme.fn.smallerThan('sm')]: {
                                    fontSize: rem(20),
                                }
                            })}>

                            Projektmanagement so {" "}
                            <Text span sx={(theme) => ({
                                position: 'relative',
                                backgroundColor: theme.fn.variant({
                                    variant: 'light',
                                    color: theme.primaryColor
                                }).background,
                                borderRadius: theme.radius.md,
                                padding: `${rem(4)} ${rem(12)}`,
                            })}>
                                einfach
                            </Text>
                            {" "} wie Chatten.

                        </Title>

                        <Text color="dimmed">
                            Ein zentraler Chat ist der Dreh- und Angelpunkt für dein gesamtes Team.
                            Schluss mit verwirrenden E-Mail-Threads, verlorenen Dateien und Verzögerungen.
                            Projektmanagement wird zur Unterhaltung.
                        </Text>
                    </Box>


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
                            Projekt zu tun hat. Kein lästiges Hin- und Herschalten mehr.
                        </List.Item>
                        <List.Item>
                            <b>Automatisierter Zugriff</b> - Füge Teammitglieder zum Chat hinzu und sie haben sofort
                            Zugriff auf alle wichtigen Projektinfos wie To-Dos, Dateien und Termine.
                        </List.Item>
                        <List.Item>
                            <b>Einfachheit und Flexibilität</b> - Egal, ob du Entwickler bist oder nicht – die App
                            ist für alle da. Manage kleine und große Projekte gleichermaßen einfach.
                        </List.Item>
                    </List>
                </Box>

                <Box sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    gap: theme.spacing.xl,
                })}>
                    <Link href={"/register"}>
                        <Button
                            radius="xl"
                            size="md"
                            variant="gradient" gradient={{from: "blue", to: "cyan", deg: 45}}
                            leftIcon={<IconUserPlus/>}
                        >
                            Registrieren
                        </Button>
                    </Link>
                    <Link href={"/login"}>
                        <Button
                            variant="default"
                            radius="xl"
                            size="md"
                            leftIcon={<IconLogin/>}
                        >
                            Einloggen
                        </Button>
                    </Link>
                </Box>

            </Box>

            <Image
                maw={rem(480)}
                src={"/woman-sitting.svg"}
                sx={(theme) => ({
                    [theme.fn.smallerThan(TABLET_BREAKPOINT)]: {
                        display: 'none',
                    }
                })}
            />
        </Box>
    )
}