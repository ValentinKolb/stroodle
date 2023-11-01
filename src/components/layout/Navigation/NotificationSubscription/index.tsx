import {usePB} from "../../../../lib/pocketbase.tsx";
import {Notifications, notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import {MessageModel, ProjectModel, UserModel} from "../../../../lib/models.ts";
import Html from "../../../Html/index.tsx";
import {BrandIconChat, BrandIconTask} from "../../../../lib/icons.tsx";
import {IconChevronRight} from "@tabler/icons-react";
import classes from "./index.module.css"
import {scrollToMessage} from "../../../../routes/project/:id/messages/util.ts";
import {CustomLink} from "../Custom/CustomLink.tsx";
import {useMatch, useParams} from "react-router-dom";
import ReactHowler from 'react-howler'

import popSound from "/sounds/pop.mp3"
import {useState} from "react";
import {useMobile} from "../../../../lib/uiUtil.tsx";
import {queryClient} from "../../../../main.tsx";

export default function NotificationSubscription() {

    const {useSubscription, pb} = usePB()

    const {projectId} = useParams<{ projectId: string }>()
    const matches = useMatch(`/project/${projectId}/messages/*`)
    const [playSound, setPlaySound] = useState(false)
    const {user} = usePB()
    const isMobile = useMobile()

    useSubscription<MessageModel>({
        idOrName: 'messages',
        callback: async (data) => {

            await queryClient.invalidateQueries({queryKey: ["all", "messages"]})

            console.log(data)
            if (!user?.notifications) return
            const message = data.record
            if (data.action === "create" && !(matches && message.project === projectId)) {
                const project = await pb.collection("projects").getOne<ProjectModel>(message.project)
                const author = await pb.collection("users").getOne<UserModel>(message.author)
                const link = scrollToMessage(message)
                notifications.show({
                    id: message.id,
                    title: (
                        <CustomLink
                            to={message.link || link}
                            className={classes.title}
                            onClick={() => notifications.hide(message.id)}
                            closeSideBar={isMobile}
                        >
                            {!message.systemMessage && <>
                                @{author.username}
                                <IconChevronRight size={12}/>
                            </>}
                            {project.name}
                        </CustomLink>
                    ),
                    message: (
                        <CustomLink
                            to={message.link || link}
                            onClick={() => notifications.hide(message.id)}
                            closeSideBar={isMobile}
                        >
                            <Html className={`one-line`}>{message.text}</Html>
                        </CustomLink>
                    ),
                    icon: message.systemMessage ? <BrandIconTask size={"xs"} color={"white"}/> :
                        <BrandIconChat size={"xs"} color={"white"}/>,
                    color: message.systemMessage ? "taskColor" : "messageColor",
                    autoClose: 1000,
                })
                if (user.sound) {
                    setPlaySound(true)
                }
            }
        }
    })

    return <>

        <ReactHowler
            volume={0.5}
            src={popSound}
            playing={playSound}
            onEnd={() => setPlaySound(false)}
        />

        <Notifications position={isMobile ? "top-center" : "top-right"} limit={2}/>
    </>

}