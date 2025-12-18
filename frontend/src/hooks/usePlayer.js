import {useQuery} from "@tanstack/react-query";
import playerServices from "../services/playerServices";
const useplayerLeaders =(limit,type)=>{
    return useQuery({
        queryKey:["playerLeaders",limit,type],
        queryFn:async()=>playerServices.getLeaders(type,limit)
    })
}
const useTodayMvp =()=>{
    return useQuery({
        queryKey:["todayMvp"],
        queryFn:async()=>playerServices.getMvpOfToday()
    })
}

export{useplayerLeaders,useTodayMvp}