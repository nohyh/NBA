const prisma = require("../utils/prisma");

const getGameByDate = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Missing date" });
        }
        // Treat the query date as local (Asia/Shanghai) and convert to find the corresponding ET date
        // Beijing time 00:00 = UTC -8h = ET -13h (previous day ~11:00 AM ET)
        // Beijing time 23:59 = UTC +15:59 = ET ~10:59 AM (same day)
        // So for Beijing date, we need the previous day's games in ET
        const beijingDate = new Date(`${date}T12:00:00+08:00`); // noon Beijing time
        // Convert to ET (UTC-5), which gives us the ET date for games happening during Beijing daytime
        const etDate = new Date(beijingDate.getTime());
        // Get the previous day in YYYY-MM-DD format (games played in ET evening = Beijing next day morning)
        const prevDay = new Date(etDate);
        prevDay.setDate(prevDay.getDate() - 1);
        const prevDateStr = prevDay.toISOString().split('T')[0];

        // gameDate is stored as text in SQLite (ET date like '2025-12-31')
        const games = await prisma.$queryRaw`
            SELECT g.*, 
                   h.id as homeTeam_id, h.nbaId as homeTeam_nbaId, h.name as homeTeam_name, 
                   h.fullName as homeTeam_fullName, h.abbreviation as homeTeam_abbreviation,
                   h.conference as homeTeam_conference, h.logoUrl as homeTeam_logoUrl, 
                   h.primaryColor as homeTeam_primaryColor,
                   a.id as awayTeam_id, a.nbaId as awayTeam_nbaId, a.name as awayTeam_name,
                   a.fullName as awayTeam_fullName, a.abbreviation as awayTeam_abbreviation,
                   a.conference as awayTeam_conference, a.logoUrl as awayTeam_logoUrl,
                   a.primaryColor as awayTeam_primaryColor
            FROM Game g
            JOIN Team h ON g.homeTeamId = h.id
            JOIN Team a ON g.awayTeamId = a.id
            WHERE g.gameDate = ${prevDateStr}
            ORDER BY g.id ASC
        `;

        // Transform to match Prisma include structure
        const formattedGames = games.map(g => ({
            id: g.id,
            gameId: g.gameId,
            gameDate: date,  // Use the user's query date (Beijing time) instead of ET date from DB
            gameTime: g.gameTime,
            status: g.status,
            homeTeamId: g.homeTeamId,
            awayTeamId: g.awayTeamId,
            homeTeamScore: g.homeTeamScore,
            awayTeamScore: g.awayTeamScore,
            homeQ1: g.homeQ1, homeQ2: g.homeQ2, homeQ3: g.homeQ3, homeQ4: g.homeQ4,
            awayQ1: g.awayQ1, awayQ2: g.awayQ2, awayQ3: g.awayQ3, awayQ4: g.awayQ4,
            homeTeam: {
                id: g.homeTeam_id,
                nbaId: g.homeTeam_nbaId,
                name: g.homeTeam_name,
                fullName: g.homeTeam_fullName,
                abbreviation: g.homeTeam_abbreviation,
                conference: g.homeTeam_conference,
                logoUrl: g.homeTeam_logoUrl,
                primaryColor: g.homeTeam_primaryColor
            },
            awayTeam: {
                id: g.awayTeam_id,
                nbaId: g.awayTeam_nbaId,
                name: g.awayTeam_name,
                fullName: g.awayTeam_fullName,
                abbreviation: g.awayTeam_abbreviation,
                conference: g.awayTeam_conference,
                logoUrl: g.awayTeam_logoUrl,
                primaryColor: g.awayTeam_primaryColor
            }
        }));
        if (!formattedGames) {
            return res.status(404).json({ message: "No game found" });
        }
        return res.status(200).json({ games: formattedGames });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const getGameByTeam = async (req, res) => {
    try {
        const teamId = parseInt(req.params.teamId);
        const games = await prisma.game.findMany({
            where: {
                OR: [
                    { homeTeamId: teamId },
                    { awayTeamId: teamId }
                ]
            },
            include: {
                homeTeam: true,
                awayTeam: true
            },
            orderBy: {
                gameDate: "asc"
            }
        })
        if (!games) {
            return res.status(404).json({ message: "No game found" });
        }
        return res.status(200).json({ games });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const getGameDetail = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game = await prisma.game.findUnique({
            where: {
                id: parseInt(gameId)
            },
            include: {
                homeTeam: true,
                awayTeam: true,
            }
        })
        if (!game) {
            return res.status(404).json({ message: "No game found" });
        }
        const playerLog = await prisma.playerGameLog.findMany({
            where: {
                gameId: game.gameId
            },
            include: {
                player: { include: { team: true } }
            }
        })
        const homePlayers = playerLog.filter(log => log.player.teamId === game.homeTeamId);
        const awayPlayers = playerLog.filter(log => log.player.teamId === game.awayTeamId);
        return res.status(200).json({ game, homePlayers, awayPlayers });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getGameByDate,
    getGameByTeam,
    getGameDetail
}
