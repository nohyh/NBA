import {useQuery} from "@tanstack/react-query";
import teamServices from "../services/teamServices";

const useTeams =()=>{
    return useQuery({
        queryKey:['teams'],
        queryFn:()=>teamServices.getTeams().then(res=>res.data)
    })
}

const useTeamById =(id)=>{
    return useQuery({
        queryKey:['team',id],
        queryFn:()=>teamServices.getTeamById(id).then(res=>res.data)
    })
}
export {useTeams,useTeamById};