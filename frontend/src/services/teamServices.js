import apiClient from "../api/apiClient";
const getTeams =()=>{
    return apiClient.get('/teams');
}

const getTeamById =(id)=>{
    return apiClient.get(`/teams/${id}`);
}

export default {
    getTeams,
    getTeamById
}