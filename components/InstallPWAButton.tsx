import {useEffect, useState} from "react";
import {Button} from "@mantine/core";

const InstallPWAButton = () => {
    const [supportsPWA, setSupportsPWA] = useState(false)
    const [promptInstall, setPromptInstall] = useState(null)

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault()
            console.log("we are being triggered :D")
            setSupportsPWA(true)
            setPromptInstall(e)
        };
        window.addEventListener("beforeinstallprompt", handler)

        return () => window.removeEventListener("transitionend", handler)
    }, []);

    const onClick = (evt: any) => {
        evt.preventDefault()
        if (!promptInstall) {
            return;
        }
        // @ts-ignore
        promptInstall.prompt()
    };
    if (!supportsPWA) {
        return "Does not support PWA"
    }
    return (
        <Button
            className="link-button"
            id="setup_button"
            aria-label="Install app"
            title="Install app"
            onClick={onClick}
        >
            App installieren
        </Button>
    )
}

export default InstallPWAButton

