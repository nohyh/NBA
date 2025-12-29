import { useQuery } from "@tanstack/react-query";
import gameServices from "../services/gameServices";
const useGameByDate = (date) => {
    return useQuery({
        queryKey: ['games','byDate',date],
        queryFn: async () => await gameServices.getGameByDate(date).then(res => res.data),
    })
}//根据日期获取比赛
const useGameByTeam = (teamId) => {
    return useQuery({
        queryKey: ['games','byTeam',teamId],
        queryFn: async () => await gameServices.getGameByTeam(teamId).then(res => res.data),
    })
}//根据球队id获取球队的比赛
const useGameDetail = (gameId) => {
    return useQuery({
        queryKey: ['games','detail',gameId],
        queryFn: async () => await gameServices.getGameDetail(gameId).then(res => res.data),
    })
}//根据比赛id获取比赛的详情
export { useGameByDate,useGameByTeam,useGameDetail }