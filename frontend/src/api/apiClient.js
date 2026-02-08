import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

const apiClient =axios.create({
    baseURL:BASE_URL,
});//发送请求时不用加前缀

apiClient.interceptors.request.use(
    (config) =>{
        const token =localStorage.getItem('token');
        if(token){
            config.headers.Authorization =`Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
)//发送请求时自动携带token
export default apiClient;