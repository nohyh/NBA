const prisma = require("../utils/prisma");
const getPlayers =async(req,res)=>{
    try{
        const {limit=20,offset=0,search=""}=req.query;
        //if search exists then search in name
        const where =search?{
            fullName:{
                contains:search,  
        }}:{ };
        const players =await prisma.player.findMany({
            where,
            orderBy:{fullName:'asc'},
            take:parseInt(limit),
            skip:parseInt(offset),
            include:{
                seasonStats:true,
                team:true
            }
        })
        const totalPlayers =await prisma.player.count({where});
        return res.status(200).json({players,totalPlayers});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}
const getPlayersById =async(req,res)=>{
    try{
        const players  =await prisma.player.findUnique({
            where:{id:parseInt(req.params.id)},
            include:{
                seasonStats:true,
                team:true
            }
        })
        if(!players){
            return res.status(404).json({message:"No player found"});
        }
        return res.status(200).json({players});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}



module.exports ={getPlayers,getPlayersById}