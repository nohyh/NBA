import apiClient from "../api/apiClient";
const getTeams =()=>{
    return apiClient.get('/teams');
}

const getTeamById =(id)=>{
    return apiClient.get(`/teams/${id}`);
}

const getTopTeam =(limit,type)=>{
    if(!type){
        return null;
    }
    if(!limit){
        return apiClient.get(`/teams/top?type=${type}`);
    }
    return apiClient.get(`/teams/top?limit=${limit}&type=${type}`);
}

export default {
    getTeams,
    getTeamById,
    getTopTeam
}