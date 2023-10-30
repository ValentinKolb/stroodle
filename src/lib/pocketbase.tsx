import {createContext, DependencyList, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react"
import PocketBase, {RecordSubscription} from 'pocketbase'
import ms from "ms";
import {useIdle, useInterval} from "@mantine/hooks";
import jwtDecode from "jwt-decode";
import {UserModel} from "./models.ts";

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export type PocketbaseError = { response: { data: { [key: string]: { message: string } } } }

const PocketContext = createContext({})

const PocketData = (baseUrl: string) => {
    const pb = useMemo(() => new PocketBase(baseUrl), [baseUrl])
    const idle = useIdle(2000, {initialState: false})

    const [token, setToken] = useState(pb.authStore.token);
    const [user, setUser] = useState(pb.authStore.model);

    useEffect(() => {
        return pb.authStore.onChange((token, model) => {
            setToken(token)
            setUser(model)
        });
    }, [pb])

    const refreshUser = useCallback(async () => {
        await pb.collection("users").authRefresh()
    }, [pb])

    useEffect(() => {
        if (!idle) return
        refreshUser()
    }, [refreshUser, idle])

    const register = useCallback(async (data: Pick<UserModel, "username" | "email" | "aboutMe" | "terms" | "jobTitle" | "notifications" | "sound"> & {
        password: string,
        passwordConfirm: string
    }) => {
        return await pb
            .collection("users")
            .create({emailVisibility: false, ...data});
    }, [pb])

    const loginWithPassword = useCallback(async (email: string, password: string) => {
        return await pb.collection("users").authWithPassword(email, password);
    }, [pb])


    const logout = useCallback(() => {
        pb.authStore.clear();
    }, [pb])

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return;
        const decoded = jwtDecode<{ exp: number }>(token);
        const tokenExpiration = decoded.exp;
        const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
        if (tokenExpiration < expirationWithBuffer) {
            await pb.collection("users").authRefresh();
        }
    }, [pb, token]);

    const useSubscription = <T, >({idOrName, topic = "*", callback}: {
        idOrName: string,
        topic?: string,
        callback: (data: RecordSubscription<T>) => void
    }, deps?: DependencyList | undefined) => {
        useEffect(() => {
            pb.collection(idOrName).subscribe<T>(topic, callback)
            return () => {
                pb.collection(idOrName).unsubscribe(topic)
            }
        }, deps ? deps : []);
    }

    useInterval(refreshSession, token ? twoMinutesInMs : Infinity)

    return {
        register,
        login: loginWithPassword,
        logout,
        user: user as UserModel | null,
        token,
        pb,
        refresh: refreshUser,
        useSubscription
    }
}

export const PocketBaseProvider = ({children, baseUrl}: { children: ReactNode, baseUrl: string }) => {
    const data = PocketData(baseUrl)
    return (
        <PocketContext.Provider
            value={data}
        >
            {children}
        </PocketContext.Provider>
    )
}

export const usePB = () => {
    const pb = useContext(PocketContext)
    if (!pb) {
        throw new Error("usePB must be used inside PocketProvider")
    }
    return pb as ReturnType<typeof PocketData>
}
