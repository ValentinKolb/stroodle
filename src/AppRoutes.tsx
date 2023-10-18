import {usePB} from "./lib/pocketbase.tsx";
import Home from "./routes/index";
import Login from "./routes/login";
import Register from "./routes/register";
import Verification from "./routes/account/confirm/verification.tsx";
import PasswordReset from "./routes/account/confirm/password-reset.tsx";
import Account from "./routes/account";
import ConnectWithUser from "./components/ConnectWithUser.tsx";
import Project from "./routes/project/:id";
import NewProject from "./routes/project/new";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import {LoadingOverlay} from "@mantine/core";
import NotFound from "./components/NotFound.tsx";
import Header from "./components/layout/Header";
import {IconForklift} from "@tabler/icons-react";
import {CustomNavigate} from "./components/layout/Navigation/Custom/CustomNavigate.tsx";

/**
 * ProtectedRoutes component that redirects to /login if the user is not logged in
 * and to the account verification page if the user is loggend in but not verified.
 *
 * If the user is logged in and verified, the Navigation component is rendered with an outlet.
 */
const ProtectedRoutes = () => {
    const {user} = usePB()
    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }
    if (!user.verified) {
        return <CustomNavigate to={"/account/confirm/verification"}/>
    }
    return <Navigation/>
}

// Create the router
export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route index element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/account/confirm/verification/:token?" element={<Verification/>}/>
            <Route path="/account/confirm/password-reset/:token?" element={<PasswordReset/>}/>
            <Route path="/c/:username" element={<ConnectWithUser/>}/>
            <Route element={<ProtectedRoutes/>}>
                <Route path="/account/*" element={<Account/>}/>
                <Route path="/project">
                    <Route index element={<Header leftSection={<IconForklift/>} label={"Dashboard"}/>}/>
                    <Route path="new/*" element={<NewProject/>}/>
                    <Route path=":projectId/*" element={<Project/>}/>
                </Route>
            </Route>
            <Route path={"*"} element={<NotFound/>}/>
        </>
    )
)

const AppRoutes = () => <RouterProvider router={router} fallbackElement={<LoadingOverlay/>}/>
export default AppRoutes