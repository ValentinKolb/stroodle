import {usePB} from "../../../lib/pocketbase.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Alert, Box, Button, Group, Image, LoadingOverlay, Text} from "@mantine/core";
import {IconExclamationMark, IconMail, IconMailCheck, IconReload} from "@tabler/icons-react";
import {useParams} from "react-router-dom";
import {CustomLink} from "../../../components/layout/Navigation/Custom/CustomLink.tsx";
import {CustomNavigate} from "../../../components/layout/Navigation/Custom/CustomNavigate.tsx";

export default function Verification() {

    const {token} = useParams()
    const {pb, refresh, user} = usePB()

    // query to verify the token automatically if it is present
    const verifyQuery = useQuery({
        queryKey: ['verify', token],
        queryFn: async () => {
            await pb.collection('users').confirmVerification(token || "")
            await refresh()
            return true
        },
        retry: false,
        enabled: token !== undefined,
    })

    // mutation to resend the verification email
    const resendVerification = useMutation({
        mutationFn: async () => {
            await pb.collection('users').requestVerification(user!.email)
        },
    })

    console.log(token)

    // redirect to /login if user is not logged in
    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }

    // redirect to /account if user is already verified
    if (user?.verified) {
        return <CustomNavigate to={"/account"}/>
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
        {/*Display loading overlay is the query is loading*/}
        <LoadingOverlay visible={verifyQuery.isPending && token !== undefined}/>
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
            { /* case no token, prompt user to check email for link */
                token === undefined && <>
                    <Image maw={300} mx="auto" src="/man-waving.svg" alt="Man waving" mb={"xl"}/>
                    <Text
                        size="xl"
                        fw={900}
                        variant="gradient"
                        gradient={{from: 'blue', to: 'cyan', deg: 90}}
                    >
                        Bitte checke Deine Emails und klicke auf den Link, um deine Email zu verifizieren.
                    </Text>
                    <Button
                        onClick={() => resendVerification.mutate()}
                        loading={resendVerification.isPending}
                        disabled={resendVerification.isPending}
                        variant={"subtle"}
                        c={resendVerification.isSuccess ? "green" : "blue"}
                        leftSection={resendVerification.isSuccess ? <IconMailCheck/> : <IconMail/>}
                    >
                        Link erneut senden
                    </Button>
                </>
            }
            { /* case token could not be verified */
                verifyQuery.isError && <>

                    <Alert variant="light" c="red" title="Fehler" icon={<IconExclamationMark/>}>
                        Deine Verifizierung ist fehlgeschlagen. Bitte versuche es erneut.
                    </Alert>

                    <Group>
                        <Button
                            onClick={() => verifyQuery.refetch()}
                            loading={verifyQuery.isPending}
                            disabled={verifyQuery.isPending}
                            variant={"subtle"}
                            c={"gray"}
                            leftSection={<IconReload/>}
                        >
                            Nochmal versuchen
                        </Button>

                        <Button
                            onClick={() => resendVerification.mutate()}
                            loading={resendVerification.isPending}
                            disabled={resendVerification.isPending}
                            variant={"subtle"}
                            c={resendVerification.isSuccess ? "green" : "blue"}
                            leftSection={resendVerification.isSuccess ? <IconMailCheck/> : <IconMail/>}
                        >
                            Link erneut senden
                        </Button>
                    </Group>

                </>
            }
            { /* case token was successfully verified - normally user should be automatically redirected to /account */
                verifyQuery.isSuccess && <>
                    <Alert variant="light" c="green" title="Erfolg" icon={<IconMailCheck/>}>
                        Deine Email wurde erfolgreich verifiziert.
                        <CustomLink to={"/account"}>
                            <Button
                                loading={verifyQuery.isPending}
                                disabled={verifyQuery.isPending}
                                variant={"light"}
                                c={"blue"}
                            >
                                Weiter
                            </Button>
                        </CustomLink>
                    </Alert>
                </>
            }
        </Box>
    </Box>
}