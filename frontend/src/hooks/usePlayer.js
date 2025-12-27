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
const usePlayerByTeam = (teamId)=>{
    return useQuery({
        queryKey:["playerByTeam",teamId],
        queryFn:async()=>playerServices.getPlayerByTeam(teamId)
    })
}
const useSearchPlayer = (search)=>{
    return useQuery({
        queryKey:["searchPlayer",search],
        queryFn:async()=>playerServices.searchPlayer(search),
        enabled :!!search
    })
}

export{useplayerLeaders,useTodayMvp,useTopPlayer,usePlayer,usePlayerByTeam,useSearchPlayer}