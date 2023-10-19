import {Navigate, NavigateProps} from "react-router-dom";
import {useSideMenuBar} from "../../../../lib/uiUtil.tsx";
import {modifyQueryParam} from "./util.ts";

export function CustomNavigate(props: NavigateProps ) {

    const {searchParamsKey, hideSideMenuBar} = useSideMenuBar()

    return <Navigate
        {...props}
        to={modifyQueryParam(props.to as string, searchParamsKey, hideSideMenuBar.toString())}
        replace={props.replace ?? true}
    />
}