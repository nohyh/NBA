import apiClient from "../api/apiClient";
import { getLocalDateString } from "../utils/date";

const getGameByDate = (date) => {
    const dateStr = date instanceof Date
        ? getLocalDateString(date)
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
