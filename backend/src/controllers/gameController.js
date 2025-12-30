const prisma = require("../utils/prisma");

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

const getGameByDate = async(req,res)=>{
    try{
        const { date, start, end } = req.query;
        let range = null;
        if (start || end) {
            if (!start || !end) {
                return res.status(400).json({ message: "Missing start or end" });
            }
            range = parseUtcRange(start, end);
            if (!range) {
                return res.status(400).json({ message: "Invalid start or end" });
            }
        } else if (date) {
            range = buildLocalDayRange(date);
            if (!range) {
                return res.status(400).json({ message: "Invalid date" });
            }
        } else {
            return res.status(400).json({ message: "Missing date or range" });
        }
        const games =await prisma.game.findMany({
            where:{
                 gameDate: {
                 gte: range.startDate,
                lt: range.endDate
             }
            },
            include:{
                homeTeam :true,
                awayTeam :true

            }
        })
        if(!games){
            return res.status(404).json({message:"No game found"});
        }
        return res.status(200).json({games});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}
 
const getGameByTeam =async(req,res)=>{
    try{
        const teamId = parseInt(req.params.teamId);
        const games =await prisma.game.findMany({
            where:{
            OR:[
                {
                    homeTeamId: teamId
                },
                {
                    awayTeamId: teamId
                }
            ]},
            include:{
                homeTeam :true,
                awayTeam :true

            },
            orderBy:{
                gameDate:"asc"
            }
       
        })
        if(!games){
            return res.status(404).json({message:"No game found"});
        }
        return res.status(200).json({games});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}
const getGameDetail =async(req,res)=>{
    try{
        const {gameId} =req.params;
        const game = await prisma.game.findUnique({
            where:{
                id:parseInt(gameId)
            },
            include:{
                homeTeam:true,
                awayTeam:true,
            }
        })
        if(!game){
            return res.status(404).json({message:"No game found"});
        }
        const playerLog = await prisma.playerGameLog.findMany({
            where:{
                gameId:game.gameId
            },
            include :{
                player:{include:{team:true}}
            }
        })
        const homePlayers = playerLog.filter(log=>log.player.teamId === game.homeTeamId);
        const awayPlayers = playerLog.filter(log=>log.player.teamId === game.awayTeamId);
        return res.status(200).json({game,homePlayers,awayPlayers});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}
module.exports = {
    getGameByDate,
    getGameByTeam,
    getGameDetail
}
