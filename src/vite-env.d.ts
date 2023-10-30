declare module 'virtual:pwa-register/react' {
    // @ts-expect-error ignore when React is not installed
    import type {Dispatch, SetStateAction} from 'react'
    import type {RegisterSWOptions} from 'vite-plugin-pwa/types'

    export type {RegisterSWOptions}

    export function useRegisterSW(options?: RegisterSWOptions): {
        needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
        offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
}

declare module '*.module.css';
declare module '*.css';
declare module '*.mp3';