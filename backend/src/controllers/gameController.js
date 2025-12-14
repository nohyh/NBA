const prisma = require("../utils/prisma");

const getGameByDate = async(req,res)=>{
    try{
        const {date} = req.params;
        const games =await prisma.game.findMany({
            where:{
                 gameDate: {
                 gte: new Date(`${date}T00:00:00`),
                lt: new Date(`${date}T23:59:59`)
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

module.exports = {
    getGameByDate
}
