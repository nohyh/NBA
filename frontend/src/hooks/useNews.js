import { useQuery } from "@tanstack/react-query";
import newsServices from "../services/newsServices";
const useNews=()=>{
    return useQuery({
        queryKey:['news'],
        queryFn:async()=>newsServices.getNews()
    })
}
export{ useNews}
