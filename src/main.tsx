import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import React from "react";
import ReactDOM from "react-dom/client";
import {createTheme, DEFAULT_THEME, LoadingOverlay, MantineProvider, mergeMantineTheme} from "@mantine/core";
import {registerSW} from "virtual:pwa-register";
import {PocketBaseProvider, usePB} from "./lib/pocketbase.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./global.css"
import {RecoilRoot} from "recoil";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useParams} from "react-router-dom";
import {CustomNavigate} from "./components/layout/Navigation/Custom/CustomNavigate.tsx";
import Navigation from "./components/layout/Navigation";
import Home from "./routes/index";
import Login from "./routes/login";
import Register from "./routes/register";
import Verification from "./routes/account/confirm/verification.tsx";
import PasswordReset from "./routes/account/confirm/password-reset.tsx";
import ConnectWithUser from "./components/ConnectWithUser.tsx";
import Account from "./routes/account";
import ProjectOverview from "./routes/project";
import NewProject from "./routes/project/new";
import Project from "./routes/project/:id";
import NotFound from "./components/NotFound.tsx";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
})

const themeOverride = createTheme({
    primaryColor: 'blue',
    colors: {
        messageColor: DEFAULT_THEME.colors.green,
        taskColor: DEFAULT_THEME.colors.cyan,
        noteColor: DEFAULT_THEME.colors.yellow,
        fileColor: DEFAULT_THEME.colors.grape,
    }
});

const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);

/**
 * ProtectedRoutes component that redirects to /login if the user is not logged in
 * and to the account verification page if the user is loggend in but not verified.
 *
 * If the user is logged in and verified, the Navigation component is rendered with an outlet.
 */
const ProtectedRoutes = () => {
    const {user} = usePB()
    const {token} = useParams()

    if (user == null) {
        return <CustomNavigate to={"/login"}/>
    }
    if (!user.verified) {
        // todo: redirect to /account/confirm/verification but keep the token
        return <CustomNavigate to={`/account/confirm/verification${token ? "/" + token : ""}`}/>
    }
    return <>
        <Navigation/>
    </>
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
                    <Route index element={<ProjectOverview/>}/>
                    <Route path="new/*" element={<NewProject/>}/>
                    <Route path=":projectId/*" element={<Project/>}/>
                </Route>
            </Route>
            <Route path={"*"} element={<NotFound/>}/>
        </>
    )
)

export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <PocketBaseProvider baseUrl={"https://backend.stroodle.me"}>
                    <MantineProvider theme={theme}>
                        <RouterProvider router={router} fallbackElement={<LoadingOverlay/>}/>
                    </MantineProvider>
                </PocketBaseProvider>
            </QueryClientProvider>
        </RecoilRoot>
    </React.StrictMode>
)