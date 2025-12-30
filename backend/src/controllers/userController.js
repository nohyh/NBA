const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

const signUp = async (req, res) => {
    try {
        if(!req.body.user){
            return  res.status(400).json({ message: "不能发送空信息" });
        }
        const { username, password } = req.body.user;
        const isUserExist = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        })
        const token = signToken(user.id);
        res.status(201).json({ user: { username: user.username }, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const signIn = async (req, res) => {
    try {
        if(!req.body.user){
            return  res.status(400).json({ message: "不能发送空信息" });
        }
        const { username, password } = req.body.user;
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = signToken(user.id);
        res.status(200).json({ user: { username: user.username }, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const signOut = async (req, res) => {
    try {
        res.status(200).json({ message: "User logged out" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            include: {
                favoritePlayers: {
                    include: {
                        seasonStats: true,
                        team: true
                    }
                },
                favoriteTeams: true
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        delete user.password;
        res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const checkUsername = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.query.username
            }
        })
        res.json({ exists: !!user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const favoritePlayer = async (req, res) => {
    try {
        const playerId = parseInt(req.params.playerId);
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                favoritePlayers: {
                    connect: { id: playerId }
                }
            }
        })
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: { seasonStats: true, team: true }
        });
        res.status(200).json({ player });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const unfavoritePlayer = async (req, res) => {
    try {
        const playerId = parseInt(req.params.playerId);
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                favoritePlayers: {
                    disconnect: { id: playerId }
                }
            }
        })
        res.status(200).json({ message: "Player unfavorited" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const favoriteTeam = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                favoriteTeams: {
                    connect: { id: teamId }
                }
            }
        })
        // 返回完整的 team 数据
        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });
        res.status(200).json({ team });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const unfavoriteTeam = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                favoriteTeams: {
                    disconnect: { id: teamId }
                }
            }
        })
        res.status(200).json({ message: "Team unfavorited" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { username, password, newPassword } = req.body;
        if(!username){
            return res.status(400).json({ message: "请输入用户名" })
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (existingUser && existingUser.id !== req.user.id) {
            return res.status(409).json({ message: "用户名已存在" })
        }
        if (newPassword && !password) {
            return res.status(400).json({ message: "请输入原密码" })
        }
        if (!newPassword && password) {
            return res.status(400).json({ message: "请输入新密码" })
        }
        if (newPassword && password) {
             if(newPassword===password){
            return res.status(400).json({ message: "新密码与原密码相同" })
            }
            const isPasswordValid = await bcrypt.compare(password, req.user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ message: "密码输入错误" })
            }
        }
        const user = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                username: username,
                ...newPassword && { password: await bcrypt.hash(newPassword, 10) }
            },
            include: {
                favoritePlayers:{
                    include:{
                        team:true,
                        seasonStats:true
                    }
                },
                favoriteTeams:true
            }
        })
        delete user.password;
        res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
module.exports = { signUp, signIn, signOut, getUser, checkUsername, favoritePlayer, unfavoritePlayer, favoriteTeam, unfavoriteTeam, updateUser };