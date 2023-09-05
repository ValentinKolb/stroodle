import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {registerSW} from "virtual:pwa-register";
import {MantineProvider} from '@mantine/core';
import {PocketProvider} from "../lib/pocketbase";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PocketProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <App/>
            </MantineProvider>
        </PocketProvider>
    </React.StrictMode>,
)
