import apiClient from "@/api/apiClient";
const  getNews=async()=>{
    const response =await apiClient.get("/news");
    return response.data.news;
}

export default {getNews}