import {
    Anchor,
    Box,
    Button,
    Container,
    Divider,
    Image,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import {usePB} from "../../lib/pocketbase.tsx";
import {useMutation} from "@tanstack/react-query";
import {useForm} from '@mantine/form';
import z from "zod";
import {IconMailCheck} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {CustomNavigate} from "../../components/layout/Navigation/Custom/CustomNavigate.tsx";

export default function Login() {

    const {login, user, pb} = usePB()

    const formValues = useForm({
        initialValues: {
            email: '',
            password: '',
        }
    })

    const loginMutation = useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            formValues.clearErrors()
            await login(data.email, data.password)
        },
        onError: () => {
            formValues.setFieldError("email", "Falsche Email oder Passwort")
            formValues.setFieldError("password", "Falsche Email oder Passwort")
        }
    })

    const requestPasswordReset = useMutation({
        mutationFn: async (email: string) => {
            await pb.collection('users').requestPasswordReset(email)
        }
    })

    if (user != null) {
        return <CustomNavigate to={"/project"}/>
    }

    return (
        <Container size={420} my={40}>
            <Image maw={300} mx="auto" src="/man-waving.svg" alt="Man waving" mb={"xl"}/>

            <Box mb={"xl"}>
                <Title
                    mb={"20"}
                    ta="center"
                    style={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                >
                    Willkommen zurück!
                </Title>

                <Text c="dimmed" size="sm" ta="center">
                    Hast Du noch keinen Account?{' '}
                    <Anchor size="sm" component={Link} to={"/register"}>
                        Account erstellen
                    </Anchor>
                </Text>
            </Box>

            <Paper withBorder shadow="md" p={"lg"} radius="md">
                <form onSubmit={formValues.onSubmit((data) => loginMutation.mutate(data))}>
                    <TextInput
                        label="Email"
                        placeholder="you@example.dev"
                        required
                        {...formValues.getInputProps("email")}
                        mb={"sm"}
                    />
                    <PasswordInput
                        label="Passwort"
                        placeholder="123abc"
                        required
                        {...formValues.getInputProps("password")}
                        mb={"lg"}
                    />
                    <Divider
                        mb={"lg"}
                        labelPosition={"center"}
                        label={
                            <Button
                                variant={"transparent"}
                                size="xs"
                                color={
                                    requestPasswordReset.isSuccess ? "green" : "blue"
                                }
                                loading={requestPasswordReset.isPending}
                                leftSection={
                                    requestPasswordReset.isSuccess ? <IconMailCheck size={"1rem"}/> : null
                                }
                                onClick={() => {
                                    if (!z.string().email().safeParse(formValues.values.email).success) {
                                        formValues.setFieldError("email", "Bitte gib eine gültige Email an um dein Passwort zurückzusetzen.")
                                        return
                                    }
                                    requestPasswordReset.mutate(formValues.values.email)
                                }}
                            >
                                Passwort vergessen?
                            </Button>
                        }
                    />

                    {requestPasswordReset.isSuccess &&
                        <Text c={"green"} mb={"lg"} size={"xs"} >
                            Passwort zurückgesetzt. Bitte checke Deine Emails.
                        </Text>
                    }

                    <Button fullWidth loading={loginMutation.isPending} type={"submit"}>
                        Einloggen
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}