const prisma = require("../utils/prisma");
const getTeams =async(req,res)=>{
    try{
        const teams =await prisma.team.findMany({
            include:{
                players:true
            }
        })
        if(!teams){
            return res.status(404).json({message:"No teams found"});
        }
        return res.status(200).json({teams});   
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}
const getTeamById =async(req,res)=>{
    try{
        const team =await prisma.team.findUnique({
            where:{
                id:parseInt(req.params.id)
            },
            include:{
                players:true
            }
        })
        if(!team){
            return res.status(404).json({message:"No team found"});
        }
        return res.status(200).json({team});   
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}
const getTopTeam =async(req,res)=>{
    try{
        const limit = parseInt(req.query.limit);
        const east =await prisma.team.findMany({
            where:{
                conference:"East",
            },
            orderBy:{
                    winRate:"desc"
            },
            take:limit
        })

        const west =await prisma.team.findMany({
            where:{
                conference:"West",
            },
            orderBy:{
                    winRate:"desc"
            },
            take:limit
        })
        if(!east || !west){
            return res.status(404).json({message:"No teams found"});
        }
        return res.status(200).json({east,west});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports = {getTeams,getTeamById,getTopTeam};