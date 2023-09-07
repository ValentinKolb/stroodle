import {Button} from "@mantine/core";
import {usePB} from "../../lib/pocketbase";
import {Link} from "wouter";

export default function Test() {
    const {user, logout} = usePB()
    return <>
        {user ?
            <Button onClick={logout} color={"red"}>
                Logout
            </Button>
            :
            <Link to={"/login"}>
                <Button>
                    Login
                </Button>
            </Link>
        }
    </>
}