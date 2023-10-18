import {Box, Button, Image, Text, Title, useMantineTheme} from "@mantine/core";
import {usePB} from "../lib/pocketbase.tsx";
import {IconHandRock, IconX} from "@tabler/icons-react";
import {CustomNavigate} from "./layout/Navigation/Custom/CustomNavigate.tsx";

/**
 * Displays a QR code that can be scanned to add the user to a project
 * @param close optional function to close a modal if displayed in one
 */
export default function ContactQRCard({close}: {
    close?: () => void
}) {

    const theme = useMantineTheme()
    const {user} = usePB()

    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }

    return <Box
        style={(theme) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.spacing.lg,
        })}
    >
        <Title fz={20}
               ta={"center"}
        >

            Hi <IconHandRock size={"1rem"} color={theme.colors.indigo[5]}/>, scanne den Code um mich zu deinem Projekt
            hinzuzufügen

        </Title>

        <Box
            m={"xl"}
            p={"md"}
            style={(theme) => ({
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
                width: "70%",
                height: "auto",

            })}
        >
            <Image
                src={`https://it-tools.stuve.uni-ulm.de/api/qr?url=${encodeURIComponent("stroodle.me/c/" + user.username)}&color_dark=${encodeURIComponent(theme.colors.indigo[5])}&mode=svg`}
                alt="Contact QR Code"
            />
            <Text
                fw={500}
                ta={"center"}
                fz={20}
                variant={"gradient"}
                gradient={{from: 'indigo', to: 'cyan', deg: 45}}
            >
                @{user.username}
            </Text>
        </Box>

        {close &&
            <Button
                rightSection={<IconX/>}
                variant={"subtle"}
                onClick={close}
                c={"gray"}
                aria-label={"close QR code"}
            >
                Schließen
            </Button>
        }
    </Box>
}