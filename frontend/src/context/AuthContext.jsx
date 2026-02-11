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
        try {
            const res = await apiClient.post("/users/signin", userdata);
            localStorage.setItem("token", res.data.token);
            // 获取完整用户信息
            const userRes = await apiClient.get("/users/me");
            setUser(userRes.data.user);
            navigate("/");
            return {};
        }
        catch (error) {
            console.log(error);
            return { error: error.response?.data?.message || '登录失败' }
        }
    }
    const signUp = async (userdata) => {
        try {
            const res = await apiClient.post("/users/signup", userdata);
            localStorage.setItem("token", res.data.token);
            // 获取完整用户信息
            const userRes = await apiClient.get("/users/me");
            setUser(userRes.data.user);
            navigate("/");
            return {};
        }
        catch (error) {
            console.log(error);
            return { error: error.response?.data?.message || '注册失败' }
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
    const favoritePlayer = async (playerId) => {
        const res = await apiClient.post("/users/favoritePlayer/" + playerId);
        setUser(pre => ({
            ...pre,
            favoritePlayers: [...pre.favoritePlayers, res.data.player]
        }))
        return res.data;
    }
    const unfavoritePlayer = async (playerId) => {
        const res = await apiClient.post("/users/unfavoritePlayer/" + playerId);
        setUser(pre => ({
            ...pre,
            favoritePlayers: pre.favoritePlayers.filter(player => player.id !== parseInt(playerId))
        }))
        return res.data;
    }
    const favoriteTeam = async (teamId) => {
        const res = await apiClient.post("/users/favoriteTeam/" + teamId);
        setUser(pre => ({
            ...pre,
            favoriteTeams: [...pre.favoriteTeams, res.data.team]
        }))
        return res.data;
    }
    const unfavoriteTeam = async (teamId) => {
        const res = await apiClient.post("/users/unfavoriteTeam/" + teamId);
        setUser(pre => ({
            ...pre,
            favoriteTeams: pre.favoriteTeams.filter(team => team.id !== parseInt(teamId))
        }))
        return res.data;
    }
    const update = async (username, password, newPassword) => {
        try {
            const res = await apiClient.put("/users/update", { username, password, newPassword });
            setUser(res.data.user);
            return { success: true }
        }
        catch (error) {
            console.log(error);
            return { error: error.response?.data?.message || '更新失败' }
        }
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const res = await apiClient.get("/users/me");
                setUser(res.data.user);
            } catch (error) {
                console.log(error);
                signOut();
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [])
    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, checkUsername, favoritePlayer, unfavoritePlayer, favoriteTeam, unfavoriteTeam, update }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}
