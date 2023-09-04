import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {registerSW} from "virtual:pwa-register";
import {MantineProvider} from '@mantine/core';

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
         <MantineProvider withGlobalStyles withNormalizeCSS>
        <App/>
         </MantineProvider>
    </React.StrictMode>,
)
