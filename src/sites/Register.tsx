import { usePB} from "../../lib/pocketbase"
import {Link, Redirect} from "wouter"
import {
    Anchor,
    Box,
    Button, Center,
    Checkbox, Divider,
    Group, Image,
    Paper,
    PasswordInput,
    Text,
    Textarea,
    TextInput, TextProps,
    Title
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useState} from "react";
import {IconArrowBigLeftLines, IconArrowBigRightLines, IconCheck, IconX} from "@tabler/icons-react";
import Slide from "../../components/Slide";
import z from "zod";
import StrengthMeter from "../../components/StrengthMeter";
import {useMutation} from "@tanstack/react-query";

function PasswordRequirement({meets, label, ...props}: { meets: boolean; label: string } & TextProps) {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm" {...props}>
            <Center inline>
                {meets ? <IconCheck size={15} stroke={1.5}/> : <IconX size={15} stroke={1.5}/>}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    )
}

const PASSWORD_REQUIREMENTS = [
    {re: /[0-9]/, label: 'Enthält Zahlen'},
    {re: /[a-z]/, label: 'Enthält Kleinbuchstaben'},
    {re: /[A-Z]/, label: 'Enthält Großbuchstaben'},
    {re: /[\W_]/, label: 'Enthält Symbole'},
]

function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;
    PASSWORD_REQUIREMENTS.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    })
    return Math.max(100 - (100 / (PASSWORD_REQUIREMENTS.length + 1)) * multiplier, 0);
}

export default function Register() {

    const {user, register, pb, login} = usePB()

    const [active, setActive] = useState(0)
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

    const formValues = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            aboutMe: '',
            terms: false,
        },
        validate: (values) => (
            active === 0 ?
                {
                    username: !z.string().min(3).safeParse(values.username).success && "Der Anzeigename muss mindestens 3 Zeichen lang sein",
                    email: !z.string().email().safeParse(values.email).success && "Bitte gib eine gültige Email Adresse an",
                    aboutMe: !z.string().max(500).safeParse(values.aboutMe).success && "Die Beschreibung darf maximal 500 Zeichen lang sein",
                } : {
                    password: getStrength(values.password) !== 100 && "Ungültiges Passwort",
                    passwordConfirm: values.password !== values.passwordConfirm && "Die Passwörter stimmen nicht überein",
                    terms: !z.boolean().safeParse(values.terms).success && "Du musst die AGB akzeptieren",
                }
        ),
    })

    // todo error handling

    const createAccountMutation = useMutation(async () => {
            await register({
                username: formValues.values.username,
                email: formValues.values.email,
                aboutMe: formValues.values.aboutMe || undefined,
                password: formValues.values.password,
                passwordConfirm: formValues.values.passwordConfirm,
                terms: formValues.values.terms,
            })
            await pb.collection("users").requestVerification(formValues.values.email)
            await login(formValues.values.email, formValues.values.password)
        }
    )

    if (user != null) {
        return <Redirect to={"/test"}/>
    }

    const passwordStrength = getStrength(formValues.values.password)

    return <>

        <Box
            p={"lg"}
            sx={() => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}
        >
            <Image maw={200} mx="auto" src="/woman-waving.svg" alt="Man waving" mb={"xl"}/>

            <Box mb={"xl"}>
                <Title
                    mb={"20"}
                    align="center"
                    sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                >
                    Und neu hier?
                </Title>

                <Text color="dimmed" size="sm" align="center">
                    Oder kennen wir uns schon?{' '}
                    <Anchor size="sm" component={Link} href={"/login"}>
                        Hier einloggen
                    </Anchor>
                </Text>
            </Box>

            <form onSubmit={formValues.onSubmit((values) => {

                console.log(values)

                createAccountMutation.mutate()

            })}>
                <Slide active={active}
                       childProps={{
                           px: "lg",
                           py: "xs",
                       }}
                >
                    <Paper withBorder shadow="xs" p={"lg"} radius="md">

                        <TextInput
                            label="Anzeigename"
                            placeholder="Wie sollen wir Dich nennen?"
                            description={"Dieser Name wird öffentlich angezeigt."}
                            required
                            mb={"sm"}
                            {...formValues.getInputProps("username")}
                        />
                        <TextInput
                            label="Email"
                            placeholder="you@example.dev"
                            description={"Außer uns sieht niemand diese Email. Versprochen."}
                            required
                            mb={"sm"}
                            {...formValues.getInputProps("email")}
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
                    </Paper>

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

                        <StrengthMeter mt="xs" mb="sm" strength={passwordStrength}
                                       enabled={formValues.values.password.length > 0}/>

                        <PasswordRequirement label="Hat mindestens 6 Zeichen"
                                             meets={formValues.values.password.length > 5}/>
                        {
                            PASSWORD_REQUIREMENTS.map((requirement, index) => (
                                <PasswordRequirement key={index} label={requirement.label}
                                                     meets={requirement.re.test(formValues.values.password)}/>
                            ))
                        }
                        <PasswordRequirement
                            mb={"sm"}
                            meets={formValues.values.password === formValues.values.passwordConfirm && !!formValues.values.password}
                            label={"Die Passwörter stimmen überein"}
                        />

                        <Divider mb={"sm"}/>

                        <Checkbox
                            label="Ich akzeptiere die AGB"
                            required
                            {...formValues.getInputProps("terms", {type: "checkbox"})}
                        />
                    </Paper>
                </Slide>

                <Group position="center" mt="xl">
                    {active != 0 &&
                        <Button
                            leftIcon={<IconArrowBigLeftLines/>}
                            variant="subtle"
                            color={"gray"}
                            disabled={active == 0}
                            onClick={prevStep}
                            aria-label={"Previous Step"}
                        >
                            Zurück
                        </Button>
                    }
                    {active == 0 &&
                        <Button
                            rightIcon={<IconArrowBigRightLines/>}
                            variant={"subtle"}
                            onClick={() => {
                                !formValues.validate().hasErrors && nextStep()
                            }}
                            color={"green"}
                            aria-label={"Next Step"}
                        >
                            Weiter
                        </Button>
                    }
                    {active == 1 &&
                        <Button
                            rightIcon={<IconCheck/>}
                            variant={"subtle"}
                            color={"green"}
                            aria-label={"Register"}
                            type={"submit"}
                            loading={createAccountMutation.isLoading}
                        >
                            Registrieren
                        </Button>
                    }
                </Group>
            </form>
        </Box>
    </>
}