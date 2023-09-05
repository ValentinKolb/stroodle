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

export default function Login() {
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
                <TextInput label="Email" placeholder="you@example.dev" required/>
                <PasswordInput label="Passwort" placeholder="123abc" required mt="md"/>
                <Group position="apart" mt="lg">
                    <Checkbox label="Mich merken?"/>
                    <Anchor component="button" size="sm">
                        Passwort vergessen?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl">
                    Einloggen
                </Button>
            </Paper>
        </Container>
    )
}