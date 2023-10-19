import {NavigateOptions, useLocation, useNavigate} from "react-router-dom";
import {useSideMenuBar} from "../../../../lib/uiUtil.tsx";
import {usePB} from "../../../../lib/pocketbase.tsx";

export const modifyQueryParam = (path: string, paramName: string, newValue: string) => {
    // Split path and query
    const [basePath, queryString] = path.split('?');

    // Create a URLSearchParams object
    const searchParams = new URLSearchParams(queryString);

    // Set (or add) the parameter
    searchParams.set(paramName, newValue);

    // Return modified path
    return `${basePath}?${searchParams.toString()}`;
}
export const useCustomNavigate = () => {
    const {user} = usePB()
    const {state} = useLocation()
    const navigate = useNavigate()
    const location = useLocation()
    const {searchParamsKey, hideSideMenuBar} = useSideMenuBar()

    return (to: string | number, options?: NavigateOptions & { discardFromState?: boolean }) => {

        options = {
            ...options, replace: options?.replace ?? true, state: {
                ...options?.state,
                from: options?.discardFromState ? options.state : location.pathname
            }
        }

        if (to === -1 && state?.from) {
            if (options.discardFromState) {
                navigate(-1)
            } else {
                navigate(modifyQueryParam(state.from, searchParamsKey, hideSideMenuBar.toString()), options)
            }
            return
        }

        if (typeof to === "number" && to == -1) {
            navigate(user ? "/project" : "/", {})
            return
        }

        if (typeof to === "number") {
            navigate(to)
            return
        }

        navigate(
            modifyQueryParam(to, searchParamsKey, hideSideMenuBar.toString()), options
        )
    }
}