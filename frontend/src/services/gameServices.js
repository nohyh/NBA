import apiClient from "../api/apiClient";

const getGameByDate = (dateStr) => {
    return apiClient.get(`/games?date=${dateStr}`);
}
const getGameByTeam = (teamId) => {
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
