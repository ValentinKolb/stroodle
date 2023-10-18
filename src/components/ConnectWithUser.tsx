import {usePB} from "../lib/pocketbase";
import {useParams} from "react-router-dom";
import {CustomNavigate} from "./layout/Navigation/Custom/CustomNavigate.tsx";

export default function ConnectWithUser() {

    const {username} = useParams()

    const {user} = usePB()

    if (user?.username === username) {
        return <CustomNavigate to={"/account"}/>
    }

    return <>
        connect with {username}
    </>

}