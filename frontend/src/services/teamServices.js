import apiClient from "../api/apiClient";
const getTeams =()=>{
    return apiClient.get('/teams');
}

const getTeamById =(id)=>{
    return apiClient.get(`/teams/${id}`);
}

const getTopTeam =(limit,type,season)=>{
    if(!type){
        return null;
    }
    if(!season){
        return null;
    }
    if(!limit){
        return apiClient.get(`/teams/top?type=${type}&season=${season}`);
    }
    return apiClient.get(`/teams/top?limit=${limit}&type=${type}&season=${season}`);
}
export default {
    getTeams,
    getTeamById,
    getTopTeam
}