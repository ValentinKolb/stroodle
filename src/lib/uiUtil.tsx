import {useMediaQuery} from "@mantine/hooks";
import {useSearchParams} from "react-router-dom";

export const useMobile = () => {
    return useMediaQuery(`(max-width: 576px)`)
}
export const useSideMenuBar = () => {

    const searchParamsKey = "hideSideMenuBar"
    const [searchParams, setSearchParams] = useSearchParams({
        [searchParamsKey]: "true"
    })
    const isMobile = useMobile()

    const hideSideMenuBar = searchParams.get(searchParamsKey) === "true"
    const setSideMenuBar = (value: boolean) => setSearchParams((old) => {
            old.set(searchParamsKey, value.toString())
            return old
        },
        {replace: !isMobile}
    )

    const openSideMenuBar = () => setSideMenuBar(false)

    const closeSideMenuBar = () => setSideMenuBar(true)

    const toggleSideMenuBar = () => setSideMenuBar(!hideSideMenuBar)

    return {
        searchParamsKey,
        hideSideMenuBar,
        closeSideMenuBar,
        openSideMenuBar,
        toggleSideMenuBar
    }
}

export const vibrateShort = () => {
    if ("vibrate" in navigator) {
        navigator.vibrate(100);  // Vibrate for 100 milliseconds
    } else {
        console.warn("Vibration API not supported by this browser.");
    }
}