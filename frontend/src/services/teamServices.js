import apiClient from "../api/apiClient";
const getTeams =()=>{
    return apiClient.get('/teams');
}

const getTeamById =(id)=>{
    return apiClient.get(`/teams/${id}`);
}

const getTopTeam =(limit=1)=>{
    if(!limit||limit<1||limit>15){
        limit=15;
    }
    return apiClient.get(`/teams/top?limit=${limit}`);
}

export default {
    getTeams,
    getTeamById,
    getTopTeam
}