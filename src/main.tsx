import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./AppRoutes.tsx";
import {createTheme, DEFAULT_THEME, MantineProvider, mergeMantineTheme} from "@mantine/core";
import {registerSW} from "virtual:pwa-register";
import {PocketBaseProvider} from "./lib/pocketbase.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./global.css"
import {RecoilRoot} from "recoil";

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


export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <PocketBaseProvider baseUrl={"https://backend.stroodle.me"}>
                    <MantineProvider theme={theme}>
                        <AppRoutes/>
                    </MantineProvider>
                </PocketBaseProvider>
            </QueryClientProvider>
        </RecoilRoot>
    </React.StrictMode>
)