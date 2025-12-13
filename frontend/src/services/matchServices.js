import apiClient from "../api/apiClient";
const getTodaysMatch =()=>{
    return apiClient.get('/matches/today');
}
export default {
    getTodaysMatch
}