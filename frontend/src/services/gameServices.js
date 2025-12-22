import apiClient from "../api/apiClient";
const getGameByDate = (date) => {
    const dateStr = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : date;
    return apiClient.get(`/games?date=${dateStr}`);
}
export default {
    getGameByDate
}