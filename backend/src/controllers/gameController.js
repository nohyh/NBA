const prisma = require("../utils/prisma");
const { cnDateToEtGameDate, etGameDateToCnDate } = require("../utils/dateCn");

const mapGameToCn = (game) => {
    return {
        ...game,
        gameDate: etGameDateToCnDate(game.gameDate) || game.gameDate,
        gameDateEt: game.gameDate,
    };
};

const getGameByDate = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: "Missing date" });
        }

        // China-only contract:
        // - Client sends China calendar date (YYYY-MM-DD).
        // - DB stores ET game date (YYYY-MM-DD).
        // - cnDate corresponds to etDate = cnDate - 1 day.
        const etDateStr = cnDateToEtGameDate(date);
        if (!etDateStr) {
            return res.status(400).json({ message: "Invalid date format, expected YYYY-MM-DD" });
        }

        const games = await prisma.game.findMany({
            where: { gameDate: etDateStr },
            include: { homeTeam: true, awayTeam: true },
            orderBy: { id: "asc" },
        });

        const formattedGames = games.map(mapGameToCn);
        if (!formattedGames.length) {
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
        if (!games || !games.length) {
            return res.status(404).json({ message: "No game found" });
        }

        const formatted = games.map(mapGameToCn);

        return res.status(200).json({ games: formatted });
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
        const formattedGame = mapGameToCn(game);
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
        return res.status(200).json({ game: formattedGame, homePlayers, awayPlayers });
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
