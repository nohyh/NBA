import apiClient from "../api/apiClient";
const getLeaders = async (type, limit) => {
    const response = await apiClient.get(`/players/leaders?type=${type}&limit=${limit}`);
    return response.data;
}

const getPlayerById = async (id) => {
    const response = await apiClient.get(`/players/${id}`);
    return response.data;
}

const getMvpOfToday = async () => {
    const response = await apiClient.get("/players/mvpOfToday");
    return response.data;
}

const getTopPlayer = async (season, seasonType, dataType, page, limit) => {
    if (!season || !seasonType || !dataType || !page || !limit) {
        return null;
    }
    const response = await apiClient.get(`/players/topPlayer?season=${season}&seasonType=${seasonType}&dataType=${dataType}&page=${page}&limit=${limit}`);
    return response.data;
}
const getPlayerByTeam = async (teamId) => {
    const response = await apiClient.get(`/players/team/${teamId}`);
    return response.data;
}

const searchPlayer = async (search) => {
    const response = await apiClient.get(`/players/search?search=${search}`);
    return response.data;
}
export default {
    getLeaders,
    getPlayerById,
    getMvpOfToday,
    getTopPlayer,
    getPlayerByTeam,
    searchPlayer
}

