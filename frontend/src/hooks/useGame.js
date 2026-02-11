import { useQuery } from "@tanstack/react-query";
import gameServices from "../services/gameServices";
import { getLocalDateString } from "../utils/date";
const useGameByDate = (date) => {
    const dateStr = date instanceof Date ? getLocalDateString(date) : date;
    return useQuery({
        queryKey: ['games', dateStr],
        queryFn: async () => await gameServices.getGameByDate(dateStr).then(res => res.data),
    })
}
const useGameByTeam = (teamId) => {
    return useQuery({
        queryKey: ['games', teamId],
        queryFn: async () => await gameServices.getGameByTeam(teamId).then(res => res.data),
    })
}
const useGameDetail = (gameId) => {
    return useQuery({
        queryKey: ['games', gameId],
        queryFn: async () => await gameServices.getGameDetail(gameId).then(res => res.data),
    })
}
export { useGameByDate, useGameByTeam, useGameDetail }