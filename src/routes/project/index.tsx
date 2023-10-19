import {useQuery} from "@tanstack/react-query";
import {ProjectModel} from "../../lib/models.ts";
import {usePB} from "../../lib/pocketbase.tsx";
import Header from "../../components/layout/Header";

export default function ProjectOverview() {

    const {pb} = usePB()

    useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            return await pb.collection('projects').getList<ProjectModel>(1, 100, {
                expand: 'members'
            })
        }
    })

    return <>
        <Header
            label={"Dashboard"}
            href={`/project`}
        />
    </>
}