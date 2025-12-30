const getETDate = require("../utils/getETDate");
const prisma = require("../utils/prisma");
const ALL_TYPES = [
    'pts', 'reb', 'ast', 'stl', 'blk', 'tov', 'min',
    'fgPct', 'tppPct', 'ftPct', 'fgm', 'fga', 'fg3m', 'fg3a', 'ftm', 'fta',
    'oreb', 'dreb', 'eff', 'astTov', 'stlTov'
]

const buildLocalDayRange = (dateStr) => {
    const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
    if (Number.isNaN(base.getTime())) {
        return null;
    }
    const startDate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
    const endDate = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1, 0, 0, 0, 0);
    return { startDate, endDate };
};

const parseUtcRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return null;
    }
    if (startDate >= endDate) {
        return null;
    }
    return { startDate, endDate };
};

const getPlayerById = async (req, res) => {

    try {
        const player = await prisma.player.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                seasonStats: {
                    orderBy: {
                        season: "desc"
                    }
                },
                team: true,
                gameLogs: {
                    orderBy: {
                        gameDate: "desc"
                    },
                    take: 5
                }
            }
        })
        if (!player) {
            return res.status(404).json({ message: "No player found" });
        }
        return res.status(200).json({ player });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const getLeaders = async (req, res) => {
    try {
        const { type, limit } = req.query;
        if (!type || !limit) {
            return res.status(400).json({ message: "Missing type or limit" });
        }
        if (!ALL_TYPES.includes(type) && type != "all") {
            return res.status(400).json({ message: "Invalid type" })
        }
        let types;
        if (type === 'all') {
            types = ALL_TYPES;
        }
        else {
            types = type.split(",");
        }
        const leaders = await Promise.all(
            types.map(async (type) => {
                const leader = await prisma.playerSeasonStat.findMany({
                    orderBy: {
                        [type]: "desc"
                    },
                    take: parseInt(limit),
                    include: {
                        player: true
                    }
                })
                return { type, leader }
            })
        )
        return res.status(200).json({ leaders });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
const mvpOfToday = async (req, res) => {
    try {
        const { start, end } = req.query;
        let range = null;
        if (start || end) {
            if (!start || !end) {
                return res.status(400).json({ message: "Missing start or end" });
            }
            range = parseUtcRange(start, end);
            if (!range) {
                return res.status(400).json({ message: "Invalid start or end" });
            }
        }
        if (!range) {
            const dateStr = getETDate();
            range = buildLocalDayRange(dateStr);
            if (!range) {
                return res.status(400).json({ message: "Invalid date" });
            }
        }
        const playerOfToday = await prisma.playerGameLog.findMany({
            where: {
                gameDate: {
                    gte: range.startDate,
                    lt: range.endDate
                }
            },
            include: {
                player: true
            }
        })
        if (playerOfToday.length === 0) {

            return res.status(200).json({ mvp: null });
        }
        const mvp = playerOfToday.reduce((prev, curr) => {
            const getScore = (p) => (p.pts || 0) + (p.ast || 0) * 1.2 + (p.reb || 0) + ((p.stl || 0) + (p.blk || 0)) * 2 - (p.tov || 0) * 1.5;
            return getScore(curr) > getScore(prev) ? curr : prev;
        }, playerOfToday[0]);
        return res.status(200).json({ mvp });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const getTopPlayer = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const season = req.query.season;
        const seasonType = req.query.seasonType;
        const dataType = req.query.dataType;
        if (!page || !limit || !season || !seasonType || !dataType) {
            return res.status(400).json({ message: "Missing parameters" })
        }
        if (!ALL_TYPES.includes(dataType)) {
            return res.status(400).json({ message: "Invalid data type" })
        }
        const players = await prisma.playerSeasonStat.findMany({
            where: {
                season: season,
                seasonType: seasonType
            },
            orderBy: {
                [dataType]: "desc"
            },
            include: {
                player: {
                    include: {
                        team: true
                    }
                }

            },
            take: parseInt(limit),
            skip: parseInt((page - 1) * limit)
        })
        const totalPlayers = await prisma.playerSeasonStat.count({
            where: {
                season: season,
                seasonType: seasonType
            }
        })
        res.status(200).json({ players, totalPlayers });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const getPlayerByTeam = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        const players = await prisma.player.findMany({
            where: {
                teamId: teamId
            },
            include: {
                seasonStats: true
            }
        })
        res.status(200).json({ players });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const searchPlayer = async (req, res) => {
    try {
        const search = req.query.search;
        const players = await prisma.player.findMany({
            where: {
                fullName: {
                    contains: search
                }
            },
            include: {
                team: true
            }
        })
        res.status(200).json({ players });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getPlayerById, getLeaders, mvpOfToday, getTopPlayer, getPlayerByTeam, searchPlayer }
