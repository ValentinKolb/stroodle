import {NavLink, NavLinkProps, useLocation} from "react-router-dom";
import {useSideMenuBar} from "../../../../lib/uiUtil.tsx";
import {modifyQueryParam} from "./util.ts";
import {forwardRef} from "react";

type CustomLinkProps = {
    closeSideBar?: boolean,
    discardFromState?: boolean
} & NavLinkProps;

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
    ({closeSideBar, ...props}, ref) => {

        const {searchParamsKey, hideSideMenuBar} = useSideMenuBar();
        const location = useLocation();

        const state = {
            ...props.state,
            from: props.discardFromState ? props.state.from : location.pathname + location.search + location.hash
        }

        return (
            <NavLink
                preventScrollReset={true}
                {...props}
                to={
                    modifyQueryParam(
                        props.to as string,
                        searchParamsKey,
                        closeSideBar ? "true" : hideSideMenuBar.toString()
                    )
                }
                state={state}
                replace={closeSideBar ? false : (props.replace ?? true)}
                ref={ref} // Passing the ref down to NavLink
            />
        );
    }
)

CustomLink.displayName = "CustomLink";

