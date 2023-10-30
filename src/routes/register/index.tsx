import {usePB} from "../../lib/pocketbase.tsx"
import {
    Alert,
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    Divider,
    Group,
    Image,
    Loader,
    Paper,
    PasswordInput,
    Text,
    Textarea,
    TextInput,
    ThemeIcon,
    Title,
    Tooltip
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useState} from "react";
import {
    IconArrowBigLeftLines,
    IconArrowBigRightLines,
    IconAt,
    IconCheck,
    IconMoodSadDizzy,
    IconX
} from "@tabler/icons-react";
import Slide from "../../components/layout/Slide.tsx";
import z from "zod";
import {useMutation} from "@tanstack/react-query";
import {ClientResponseError} from "pocketbase";
import PasswordStrengthMeter, {getPasswordStrength} from "../../components/input/PasswordStrengthMeter.tsx";
import {CustomNavigate} from "../../components/layout/Navigation/Custom/CustomNavigate.tsx";
import {CustomLink} from "../../components/layout/Navigation/Custom/CustomLink.tsx";
import {FieldDiv} from "../../components/FieldLink";

/**
 * Register page
 */
export default function Register() {

    const {user, register, pb, login} = usePB()

    // controls over stepper
    const [active, setActive] = useState(0)
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

    // mutation to check if username is already taken
    const usernameExists = useMutation({
        mutationFn: async (username: string) => {
            const resultList = await pb.collection('usernames').getList(1, 1, {
                filter: `username="${username}"`,
            })
            return resultList.totalItems > 0;
        }
    })

    const formValues = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            aboutMe: '',
            jobTitle: '',
            terms: false,
        },
        validate: (values) => (
            active === 0 ?
                {
                    username: usernameExists.data === true ? "Der Name ist bereits vergeben" : !z.string().min(3).safeParse(values.username).success && "Dein Anzeigename muss mindestens 3 Zeichen lang sein",
                    email: !z.string().email().safeParse(values.email).success && "Bitte gib eine gültige Email Adresse an",
                    aboutMe: !z.string().max(500).safeParse(values.aboutMe).success && "Die Beschreibung darf maximal 500 Zeichen lang sein",
                    jobTitle: !z.string().max(50).safeParse(values.jobTitle).success && "Der Jobtitel darf maximal 50 Zeichen lang sein",
                } : {
                    password: getPasswordStrength(values.password) !== 100 && "Ungültiges Passwort",
                    passwordConfirm: values.password !== values.passwordConfirm && "Die Passwörter stimmen nicht überein",
                    terms: !z.boolean().safeParse(values.terms).success && "Du musst die AGB akzeptieren",
                }
        )
    })

    // mutation to create the account
    const createAccountMutation = useMutation<void, ClientResponseError>({
        mutationFn: async () => {
            await register({
                username: formValues.values.username,
                email: formValues.values.email,
                aboutMe: formValues.values.aboutMe || null,
                jobTitle: formValues.values.jobTitle || null,
                password: formValues.values.password,
                passwordConfirm: formValues.values.passwordConfirm,
                terms: formValues.values.terms,
                notifications: true,
                sound: true,
            })
            await pb.collection("users").requestVerification(formValues.values.email)
            await login(formValues.values.email, formValues.values.password)
        },
        onError: (error) => {
            console.error(error.data)
        }
    })

    // if user is logged in, redirect to /account
    if (user != null) {
        return <CustomNavigate to={"/account"}/>
    }

    return <>
        <Box
            p={"lg"}
            style={() => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxHeight: "100%",
                // overflow: "auto",
            })}
        >
            <Image maw={200} mx="auto" src="/woman-waving.svg" alt="Man waving" mb={"xl"}/>

            <Box mb={"xl"}>
                <Title
                    mb={"20"}
                    ta="center"
                    style={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                >
                    Und neu hier?
                </Title>

                <Text c="dimmed" size="sm" ta="center">
                    Oder kennen wir uns schon?{' '}
                    <Anchor size="sm" component={CustomLink} to={"/login"}>
                        Hier einloggen
                    </Anchor>
                </Text>
            </Box>

            <form onSubmit={formValues.onSubmit(() => {
                createAccountMutation.mutate()
            })}>
                <Slide active={active}
                       childProps={{
                           px: "lg",
                           py: "xs",
                       }}
                >
                    <FieldDiv legend={""}>
                        <TextInput
                            label="Anzeigename"
                            placeholder="Wie sollen wir Dich nennen?"
                            description={"Dieser Name wird öffentlich angezeigt."}
                            required
                            mb={"sm"}
                            {...formValues.getInputProps("username")}
                            onChange={(event) => {
                                formValues.setFieldValue("username", event.currentTarget.value)
                                usernameExists.mutate(event.currentTarget.value)
                            }}
                            leftSection={<IconAt size={"1rem"}/>}
                            rightSection={
                                <Tooltip
                                    label={usernameExists.data ? "Der Name ist bereits vergeben" : "Der Name ist noch frei"}
                                    c={usernameExists.data ? "red" : "green"}
                                >
                                    <Center>
                                        {usernameExists.isPending ?
                                            <Loader c="green" size="xs"/> : usernameExists.data ?
                                                <ThemeIcon variant="light" radius="xl" c="red" size={"sm"}>
                                                    <IconX/>
                                                </ThemeIcon> :
                                                <ThemeIcon variant="light" radius="xl" c="green" size={"sm"}>
                                                    <IconCheck/>
                                                </ThemeIcon>
                                        }
                                    </Center>
                                </Tooltip>
                            }

                        />
                        <TextInput
                            label="Email"
                            placeholder="you@example.dev"
                            description={"Außer uns sieht niemand diese Email. Versprochen!"}
                            required
                            mb={"sm"}
                            {...formValues.getInputProps("email")}
                        />
                        <TextInput
                            label="Dein Job"
                            placeholder="Was machst Du beruflich?"
                            description={"Lass andere wissen, was Du beruflich machst."}
                            mb={"sm"}
                            {...formValues.getInputProps("jobTitle")}
                        />
                        <Textarea
                            label="Über Dich"
                            placeholder="Was macht Dich aus?"
                            description={"Hier kannst Du anderen Nutzern etwas über Dich erzählen."}
                            autosize
                            minRows={3}
                            maxRows={6}
                            {...formValues.getInputProps("aboutMe")}
                        />
                    </FieldDiv>

                    <Paper withBorder shadow="xs" p={"lg"} radius="md">
                        <PasswordInput
                            label="Passwort"
                            placeholder="Passwort"
                            required
                            mb={"sm"}
                            {...formValues.getInputProps("password")}
                        />

                        <PasswordInput
                            label="Passwort wiederholen"
                            placeholder="Passwort wiederholen"
                            required
                            mb={"sm"}
                            {...formValues.getInputProps("passwordConfirm")}
                        />

                        <PasswordStrengthMeter password={formValues.values.password}
                                               passwordConfirm={formValues.values.passwordConfirm}/>

                        <Divider mb={"sm"}/>

                        <Checkbox
                            label="Ich akzeptiere die AGB"
                            required
                            {...formValues.getInputProps("terms", {type: "checkbox"})}
                        />

                        {createAccountMutation.isError && <>
                            <Alert
                                mt={"sm"}
                                icon={<IconMoodSadDizzy size="1rem"/>} title="Bummer!" c="red"
                            >
                                <Text c={"dimmed"}>
                                    {createAccountMutation.error.response?.data?.email ?
                                        " Deine Email ist bereits vergeben oder nicht valide." :
                                        createAccountMutation.error.response?.data?.username ?
                                            "Dein Anzeigename ist bereits vergeben oder nicht valide." :
                                            "Es ist ein Fehler aufgetreten."
                                    }
                                </Text>
                            </Alert>
                        </>}
                    </Paper>
                </Slide>

                <Group justify="center" mt="xl">
                    {active != 0 &&
                        <Button
                            leftSection={<IconArrowBigLeftLines/>}
                            variant="subtle"
                            c={"gray"}
                            disabled={active == 0}
                            onClick={prevStep}
                            aria-label={"Previous Step"}
                        >
                            Zurück
                        </Button>
                    }
                    {active == 0 &&
                        <Button
                            rightSection={<IconArrowBigRightLines/>}
                            variant={"subtle"}
                            onClick={() => {
                                !formValues.validate().hasErrors && nextStep()
                            }}
                            c={"green"}
                            aria-label={"Next Step"}
                        >
                            Weiter
                        </Button>
                    }
                    {active == 1 &&
                        <Button
                            rightSection={<IconCheck/>}
                            variant={"subtle"}
                            c={"green"}
                            aria-label={"Register"}
                            type={"submit"}
                            loading={createAccountMutation.isPending}
                        >
                            Registrieren
                        </Button>
                    }
                </Group>
            </form>
        </Box>
    </>
}