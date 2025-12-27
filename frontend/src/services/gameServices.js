import apiClient from "../api/apiClient";
const getGameByDate = (date) => {
    const dateStr = date instanceof Date 
        ? date.toISOString().split('T')[0] 
        : date;
    return apiClient.get(`/games?date=${dateStr}`);
}
const getGameByTeam= (teamId) => {
    return apiClient.get(`/game/${teamId}`);
}
const getGameDetail = (gameId) => {
    return apiClient.get(`/games/${gameId}`);
}
export default {
    getGameByDate,
    getGameByTeam,
    getGameDetail
}