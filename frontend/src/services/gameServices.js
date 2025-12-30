import apiClient from "../api/apiClient";
import { getLocalDateRange } from "../utils/date";
const getGameByDate = (date) => {
    const { startUtc, endUtc } = getLocalDateRange(date);
    const params = new URLSearchParams({
        start: startUtc,
        end: endUtc,
    });
    return apiClient.get(`/games?${params.toString()}`);
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
