import { useQuery } from "@tanstack/react-query";
import matchServices from "../services/matchServices";
const useTodaysMatch = () => {
    return useQuery({
        queryKey: ['match', 'date'],
        queryFn: async () => await matchServices.getTodaysMatch().then(res => res.data),
    })
}
export { useTodaysMatch}