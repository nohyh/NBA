import { useQuery } from "@tanstack/react-query";
import gameServices from "../services/gameServices";
const useGameByDate = (date) => {
    return useQuery({
        queryKey: ['games',date],
        queryFn: async () => await gameServices.getGameByDate(date).then(res => res.data),
    })
}
const useGameByTeam = (teamId) => {
    return useQuery({
        queryKey: ['games',teamId],
        queryFn: async () => await gameServices.getGameByTeam(teamId).then(res => res.data),
    })
}
const useGameDetail = (gameId) => {
    return useQuery({
        queryKey: ['games',gameId],
        queryFn: async () => await gameServices.getGameDetail(gameId).then(res => res.data),
    })
}
export { useGameByDate,useGameByTeam,useGameDetail }