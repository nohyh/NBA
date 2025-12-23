import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useState, useEffect, useContext } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const signIn = async (userdata) => {
        try{
        const res = await apiClient.post("/users/signin", userdata);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        navigate("/");
    }
    catch(error){
        console.log(error);
        return {error:error.response?.data?.message||'登录失败'}
    }
    }
    const signUp = async (userdata) => {
        try{
        const res = await apiClient.post("/users/signup", userdata);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        navigate("/");
    }
    catch(error){
        console.log(error);
        return {error:error.response?.data?.message||'注册失败'}
    }
    }
    const signOut = async () => {
        const res = await apiClient.post("/users/signout");
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
    }
    const checkUsername = async (username) => {
        const res = await apiClient.get("/users/checkUsername?username=" + username);
        return res.data.exists;
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const fetchUser = async () => {
            try {
                const res = await apiClient.get("/users/me");
                setUser(res.data.user);
            } catch (error) {
                console.log(error);
                signOut();
            }
        }
        fetchUser();
    }, [])
    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, checkUsername }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}
