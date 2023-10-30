// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import onSound from "/sounds/switch-off.mp3";
import offSound from "/sounds/switch-on.mp3";
import popSound from "/sounds/pop.mp3"
import trashSound from "/sounds/trash.mp3"
import {usePB} from "./pocketbase.tsx";

export const useSwitchSound = () => {
    const [playOn] = useSound(onSound, {volume: 0.25, interrupt: true})
    const [playOff] = useSound(offSound, {volume: 0.25, interrupt: true})
    const {user} = usePB()


    return (on: boolean) => {
        if (!user?.sound) return
        if (on) {
            playOn()
        } else {
            playOff()
        }
    }
}


export const useNotificationSound = () => {
    const [play] = useSound(popSound, {volume: 0.25, interrupt: true})
    const {user} = usePB()

    return () => {
        if (!user?.sound) return
        play()
    }
}

export const useTrashSound = () => {
    const [play] = useSound(trashSound, {volume: 0.25, interrupt: true})
    const {user} = usePB()

    return () => {
        if (!user?.sound) return
        play()
    }
}