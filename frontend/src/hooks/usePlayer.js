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
const useTopPlayer =(season,seasonType,dataType,page,limit)=>{
    return useQuery({
        queryKey:["topPlayer",season,seasonType,dataType,page,limit],
        queryFn:async()=>playerServices.getTopPlayer(season,seasonType,dataType,page,limit)
    })
}
const usePlayer= (playerId)=>{
    return useQuery({
        queryKey:["player",playerId],
        queryFn:async()=>playerServices.getPlayerById(playerId)
    })
}

export{useplayerLeaders,useTodayMvp,useTopPlayer,usePlayer}