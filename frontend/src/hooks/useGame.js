import { useQuery } from "@tanstack/react-query";
import gameServices from "../services/gameServices";
const useGameByDate = (date) => {
    return useQuery({
        queryKey: ['games',date],
        queryFn: async () => await gameServices.getGameByDate(date).then(res => res.data),
    })
}
export { useGameByDate }