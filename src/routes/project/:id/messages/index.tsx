import {ProjectModel} from "../../../../lib/models.ts";
import NewMessage from "./NewMessage.tsx";
import MessageList from "./MessageList.tsx";
import "./index.module.css"

export default function Messages({project}: { project: ProjectModel }) {


    return <>
        <MessageList project={project}/>
        <NewMessage project={project}/>
    </>
}