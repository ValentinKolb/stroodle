import {usePB} from "../../../lib/pocketbase.tsx";
import {useMutation} from "@tanstack/react-query";
import {Alert, Box, Button, Image, PasswordInput, Text} from "@mantine/core";
import {IconArrowBack, IconExclamationMark} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import PasswordStrengthMeter, {getPasswordStrength} from "../../../components/input/PasswordStrengthMeter.tsx";
import {useParams} from "react-router-dom";
import {CustomLink} from "../../../components/layout/Navigation/Custom/CustomLink.tsx";
import {CustomNavigate} from "../../../components/layout/Navigation/Custom/CustomNavigate.tsx";

export default function PasswordReset() {

    const {token} = useParams()
    const {pb} = usePB()

    const formValues = useForm({
        initialValues: {
            email: '',
            password: '',
            passwordConfirm: '',
        },
        validate: (values) => (
            {
                password: getPasswordStrength(values.password) !== 100 && "Ungültiges Passwort",
                passwordConfirm: values.password !== values.passwordConfirm && "Die Passwörter stimmen nicht überein",
            }
        ),
    })

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: { password: string, passwordConfirm: string }) => {
            await pb.collection('users').confirmPasswordReset(token!, data.password, data.passwordConfirm)
        }
    })

    if (resetPasswordMutation.isSuccess) {
        return <CustomNavigate to={"/login"}/>
    }

    return <Box
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
            <Image maw={300} mx="auto" src="/man-waving.svg" alt="Man waving"/>
            { /* case no token, prompt user to check email for link */
                token === null ? <>
                        <Text
                            size="xl"
                            fw={900}
                            variant="gradient"
                            gradient={{from: 'blue', to: 'cyan', deg: 90}}
                        >
                            Bitte checke Deine Emails und klicke auf den Link, um Dein Passwort zurückzusetzen.
                        </Text>
                    </>
                    :
                    /* case token could not be verified */
                    resetPasswordMutation.isError ? <>
                            <Alert variant="light" color="red" title="Fehler" icon={<IconExclamationMark/>}>
                                Deine Verifizierung ist fehlgeschlagen. Bitte versuche es erneut.
                            </Alert>
                            <CustomLink to={"/login"}>
                                <Button leftSection={<IconArrowBack/>} variant={"transparent"}>Zurück zum Login</Button>
                            </CustomLink>
                        </>
                        :
                        /* set new password */
                        <>
                            <Text
                                ta={"center"}
                                fw={800}
                                size="xl"
                                variant={"gradient"}
                                gradient={{from: 'indigo', to: 'cyan', deg: 45}}
                            >
                                Passwort zurücksetzen
                            </Text>

                            <Box
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "md",
                                    justifyContent: "center",

                                }}
                                w={300}
                                component={"form"}
                                onSubmit={formValues.onSubmit((values) => {
                                    resetPasswordMutation.mutate(values)
                                })}
                            >
                                <PasswordInput
                                    label="Neues Passwort"
                                    placeholder="Neues Passwort"
                                    required
                                    {...formValues.getInputProps("password")}
                                />

                                <PasswordInput
                                    label="Neues Passwort wiederholen"
                                    placeholder="Neues Passwort wiederholen"
                                    required
                                    {...formValues.getInputProps("passwordConfirm")}
                                />

                                <PasswordStrengthMeter
                                    password={formValues.values.password}
                                    passwordConfirm={formValues.values.passwordConfirm}
                                />

                                <Button
                                    loading={resetPasswordMutation.isPending}
                                    type={"submit"}
                                >
                                    Passwort zurücksetzen
                                </Button>
                            </Box>
                        </>
            }
        </Box>
    </Box>
}