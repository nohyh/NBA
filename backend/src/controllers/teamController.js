const prisma = require("../utils/prisma");
const validtypes = ['pts', 'oppPts', 'offRating', 'defRating', 'reb', 'ast', 'east', 'west'];
const getTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                players: true
            }
        })
        if (!teams) {
            return res.status(404).json({ message: "No teams found" });
        }
        return res.status(200).json({ teams });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
const getTeamById = async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                players: true
            }
        })
        if (!team) {
            return res.status(404).json({ message: "No team found" });
        }
        return res.status(200).json({ team });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
const getTopTeam = async (req, res) => {
    try {
        const type = req.query.type;
        if (!validtypes.includes(type)) {
            return res.status(400).json({ message: "Invalid type" });
        }
        const limit = req.query.limit?parseInt(req.query.limit):null;
        if (type === 'east') {
            const east = await prisma.team.findMany({
                where: {
                    conference: "East",
                },
                orderBy: {
                    winRate: "desc"
                },
                ...(limit && { take: limit }),
            })
            if (!east) {
                return res.status(404).json({ message: "No teams found" });
            }
            return res.status(200).json({ teams: east });
        }
        if (type === 'west') {
            const west = await prisma.team.findMany({
                where: {
                    conference: "West",
                },
                orderBy: {
                    winRate: "desc"
                },
                ...(limit && { take: limit }),
            })
            if (!west) {
                return res.status(404).json({ message: "No teams found" });
            }
            return res.status(200).json({ teams: west });
        }
        else {
            const rank = await prisma.teamSeasonStat.findMany({
                orderBy: {
                    [type]: "desc"
                },
                ...(limit && { take: limit }),
                include: {
                    team: true
                }
            })
            if (!rank) {
                return res.status(404).json({ message: "No teams found" });
            }
            return res.status(200).json({ teams: rank });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getTeams, getTeamById, getTopTeam };