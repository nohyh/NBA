import apiClient from "../api/apiClient";
const getGameByDate =(date)=>{
    return apiClient.get(`/games/${date}`);
}
export default {
    getGameByDate
}