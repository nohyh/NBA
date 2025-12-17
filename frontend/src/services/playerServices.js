import apiClient from "../api/apiClient";

const getLeaders =async(type,limit)=>{
    const response =await apiClient.get(`/players/leaders?type=${type}&limit=${limit}`);
    return response.data;
}

const getPlayers =async()=>{
    const response =await apiClient.get("/players");
    return response.data;
}

const getPlayerById =async(id)=>{
    const response =await apiClient.get(`/players/${id}`);
    return response.data;
}

export default {
    getLeaders,
    getPlayers,
    getPlayerById
}
