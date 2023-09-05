import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {registerSW} from "virtual:pwa-register";
import {MantineProvider} from '@mantine/core';
import {PocketProvider} from "../lib/pocketbase";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <PocketProvider>
                <MantineProvider withGlobalStyles withNormalizeCSS>
                    <App/>
                </MantineProvider>
            </PocketProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
