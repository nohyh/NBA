const getETDate = require("../utils/getETDate");
const prisma = require("../utils/prisma");
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
                team: true
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
    const etDate = getETDate();
    const dateStr = etDate.toISOString().split('T')[0];
    try {
        const playerOfToday = await prisma.playerGameLog.findMany({
            where: {
                   gameDate: {
                    gte: new Date(dateStr + 'T00:00:00'),
                    lt: new Date(dateStr + 'T23:59:59')
    }
            },
            include: {
                player: true
            }
        })
        if (playerOfToday.length === 0) {
            return res.status(404).json({ message: "No player found" });
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

const getTopPlayer =async(req,res)=>{
    try{
        const  page =parseInt(req.query.page);
        const  limit  =parseInt(req.query.limit);
        const season =req.query.season;
        const seasonType =req.query.seasonType;
        const dataType =req.query.dataType;
        const players =await prisma.playerSeasonStat.findMany({
            where:{
                season:season,
                seasonType:seasonType
            },
            orderBy:{
                [dataType]:"desc"
            },
            include:{
                player:{
                    include:{
                        team:true
                    }
                }

            },
            take:parseInt(limit),
            skip:parseInt((page-1)*limit)
        })
        const totalPlayers =await prisma.playerSeasonStat.count({
            where:{ 
                season:season,
                seasonType:seasonType
            }
        })
        res.status(200).json({ players, totalPlayers });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}


module.exports = { getPlayers, getPlayerById, getLeaders, mvpOfToday,getTopPlayer }