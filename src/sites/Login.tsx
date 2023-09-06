import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Image,
    Box
} from '@mantine/core';
import {usePB} from "../../lib/pocketbase";
import {Redirect} from "wouter"
import {useMutation} from "@tanstack/react-query";
import {useForm} from '@mantine/form';
import {Link} from "wouter"

export default function Login() {

    const {login, user} = usePB()

    const loginForm = useForm({
        initialValues: {
            email: '',
            password: '',
        }
    })

    const loginMutation = useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            loginForm.clearErrors()
            await login(data.email, data.password)
        },
        onError: () => {
            loginForm.setFieldError("email", "Falsche Email oder Passwort")
            loginForm.setFieldError("password", "Falsche Email oder Passwort")
        }
    })


    if (user != null) {
        return <Redirect to={"/"}/>
    }

    return (
        <Container size={420} my={40}>
            <Image maw={240} mx="auto" src="/logo.png" alt="Stroodle.me logo" mb={"xl"}/>

            <Box mb={"xl"}>
                <Title
                    mb={"20"}
                    align="center"
                    sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
                >
                    Willkommen zurück!
                </Title>

                <Text color="dimmed" size="sm" align="center">
                    Hast Du noch keinen Account?{' '}
                    <Anchor size="sm" component={Link} href={"/register"}>
                        Account erstellen
                    </Anchor>
                </Text>
            </Box>

            <Paper withBorder shadow="md" p={"lg"} radius="md">
                <form onSubmit={loginForm.onSubmit((data) => loginMutation.mutate(data))}>
                    <TextInput
                        label="Email"
                        placeholder="you@example.dev"
                        required
                        {...loginForm.getInputProps("email")}
                        mb={"sm"}
                    />
                    <PasswordInput
                        label="Passwort"
                        placeholder="123abc"
                        required
                        {...loginForm.getInputProps("password")}
                        mb={"lg"}
                    />
                    <Group position="apart" mb={"sm"}>
                        <Checkbox label="Angemeldet bleiben?"/>
                        <Anchor component="button" size="sm">
                            Passwort vergessen?
                        </Anchor>
                    </Group>

                    <Button fullWidth loading={loginMutation.isLoading} type={"submit"}>
                        Einloggen
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}