import {usePB} from "../../lib/pocketbase"
import {Redirect} from "wouter"
import {Box, Title} from "@mantine/core";

export default function Register() {

    const {user} = usePB()

    if (user != null) {
        return <Redirect to={"/"}/>
    }

    return <>

        <Box>

            <Title order={1}>
                Neuen Account erstellen
            </Title>

        </Box>

    </>
}