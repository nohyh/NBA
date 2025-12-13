const prisma = require("../utils/prisma");

const getLeaderboard = async (req, res) => {
    try {
        const { category, limit = 3 } = req.query;
        if (!category) {
            return res.status(400).json({ message: 'no specific category' });
        }
        const leader = await prisma.playerSeasonStat.findMany({
            orderBy: { [category]: 'desc' },
            take: parseInt(limit),
            include: {
                player: true
            }
        })
        return res.status(200).json({ leader });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { getLeaderboard }