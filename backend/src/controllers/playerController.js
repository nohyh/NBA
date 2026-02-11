const prisma = require("../utils/prisma");
const { cnDateToEtGameDate, etGameDateToCnDate, getChinaTodayYmd } = require("../utils/dateCn");
const ALL_TYPES = [
    'pts', 'reb', 'ast', 'stl', 'blk', 'tov', 'min',
    'fgPct', 'tppPct', 'ftPct', 'fgm', 'fga', 'fg3m', 'fg3a', 'ftm', 'fta',
    'oreb', 'dreb', 'eff', 'astTov', 'stlTov'
]
const getPlayers = async (req, res) => {
    try {
        const { limit = 20, offset = 0, search = "" } = req.query;
        //if search exists then search in name
        const where = search ? {
            fullName: {
                contains: search,
            }
        } : {};
        const players = await prisma.player.findMany({
            where,
            orderBy: { fullName: 'asc' },
            take: parseInt(limit),
            skip: parseInt(offset),
            include: {
                seasonStats: true,
                team: true
            }
        })
        const totalPlayers = await prisma.player.count({ where });
        return res.status(200).json({ players, totalPlayers });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
const getPlayerById = async (req, res) => {
    try {
        const player = await prisma.player.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                seasonStats: true,
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

        // Normalize recent game logs date for China UI.
        // gameDate is now a plain YYYY-MM-DD string (ET date).
        if (player.gameLogs?.length) {
            player.gameLogs = player.gameLogs.map((log) => ({
                ...log,
                gameDate: etGameDateToCnDate(log.gameDate) || log.gameDate,
                gameDateEt: log.gameDate,
            }));
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
    // China-only contract:
    // - "Today" is Asia/Shanghai calendar date.
    // - MVP is computed from the ET game date that maps to China "today".
    const cnToday = getChinaTodayYmd();
    const etDateStr = cnDateToEtGameDate(cnToday);
    if (!etDateStr) {
        return res.status(500).json({ message: "Failed to compute ET date" });
    }

    try {
        // gameDate is now a plain YYYY-MM-DD string, so direct match works.
        const playerOfToday = await prisma.$queryRaw`
            SELECT pgl.*, p.id as player_id, p.firstName, p.lastName, p.fullName, p.headshotUrl, p.position, p.jersey
            FROM PlayerGameLog pgl
            JOIN Player p ON pgl.playerId = p.id
            WHERE pgl.gameDate = ${etDateStr}
        `;
        if (playerOfToday.length === 0) {
            return res.status(404).json({ message: "No player found" });
        }
        const mvpRaw = playerOfToday.reduce((prev, curr) => {
            const getScore = (p) => (p.pts || 0) + (p.ast || 0) * 1.2 + (p.reb || 0) + ((p.stl || 0) + (p.blk || 0)) * 2 - (p.tov || 0) * 1.5;
            return getScore(curr) > getScore(prev) ? curr : prev;
        }, playerOfToday[0]);

        // Format to match expected structure
        const mvp = {
            id: mvpRaw.id,
            gameId: mvpRaw.gameId,
            // Return China date for UI while keeping ET date for debugging.
            gameDate: cnToday,
            gameDateEt: etDateStr,
            matchup: mvpRaw.matchup,
            pts: mvpRaw.pts,
            reb: mvpRaw.reb,
            ast: mvpRaw.ast,
            stl: mvpRaw.stl,
            blk: mvpRaw.blk,
            player: {
                id: mvpRaw.player_id,
                firstName: mvpRaw.firstName,
                lastName: mvpRaw.lastName,
                fullName: mvpRaw.fullName,
                headshotUrl: mvpRaw.headshotUrl,
                position: mvpRaw.position,
                jersey: mvpRaw.jersey
            }
        };
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

module.exports = { getPlayers, getPlayerById, getLeaders, mvpOfToday, getTopPlayer, getPlayerByTeam, searchPlayer }
