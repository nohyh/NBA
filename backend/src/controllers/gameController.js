const prisma = require("../utils/prisma");

const getGameByDate = async(req,res)=>{
    try{
        const {date} = req.query;
        if (!date) {
            return res.status(400).json({ message: "Missing date" });
        }
        // Treat the query date as local (Asia/Shanghai) and convert to UTC range.
        const start = new Date(`${date}T00:00:00+08:00`);
        const end = new Date(`${date}T23:59:59+08:00`);
        const games =await prisma.game.findMany({
            where:{
                 gameDate: {
                 gte: start,
                 lte: end
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
