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

    return (to: string | number, options?: NavigateOptions) => {

        console.log(location.state)

        options = {...options, replace: options?.replace ?? true, state: {...options?.state, from: location.pathname}}

        if (to === -1 && state?.from) {
            navigate(
                modifyQueryParam(state.from, searchParamsKey, hideSideMenuBar.toString())
                , options
            )
            return
        }

        if (typeof to === "number" && to == -1) {
            navigate(user ? "/project" : "/")
            return
        }

        if (typeof to === "number") {
            navigate(to)
            return
        }

        navigate(
            modifyQueryParam(to, searchParamsKey, hideSideMenuBar.toString())
            , options
        )
    }
}