import {NavLink, NavLinkProps, useLocation} from "react-router-dom";
import {useSideMenuBar} from "../../../../lib/uiUtil.tsx";
import {modifyQueryParam} from "./util.ts";

export function CustomLink({closeSideBar, ...props}: { closeSideBar?: boolean } & NavLinkProps) {

    const {searchParamsKey, hideSideMenuBar} = useSideMenuBar()
    const location = useLocation()

    return <NavLink
        preventScrollReset={true}
        {...props}
        to={
            modifyQueryParam(
                props.to as string,
                searchParamsKey,
                closeSideBar ? "true" : hideSideMenuBar.toString())
        }
        state={{...props.state, from: location.pathname + location.search + location.hash}}
        replace={closeSideBar ? false : (props.replace ?? true)}
    />
}