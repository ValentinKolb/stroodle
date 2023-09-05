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
    Image
} from '@mantine/core';
import {usePB} from "../../lib/pocketbase";
import {Redirect} from "wouter"
import {useMutation} from "@tanstack/react-query";
import {useForm} from '@mantine/form';

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
            await login(data.email, data.password)
        }
    })

    if (user != null) {
        return <Redirect to={"/"}/>
    }

    return (
        <Container size={420} my={40}>

            <Image maw={300} mx="auto" src="public/logo.png" alt="Stroodle.me logo"/>

            <Title
                mt={30}
                align="center"
                sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
            >
                Willkommen zurück!
            </Title>

            <Text color="dimmed" size="sm" align="center" mt={5}>
                Hast Du noch keinen Account?{' '}
                <Anchor size="sm" component="button">
                    Account erstellen
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={loginForm.onSubmit((data) => loginMutation.mutate(data))}>
                    <TextInput label="Email" placeholder="you@example.dev" required/>
                    <PasswordInput label="Passwort" placeholder="123abc" required mt="md"/>
                    <Group position="apart" mt="lg">
                        <Checkbox label="Angemeldet bleiben?"/>
                        <Anchor component="button" size="sm">
                            Passwort vergessen?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" loading={loginMutation.isLoading} type={"submit"}>
                        Einloggen
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}