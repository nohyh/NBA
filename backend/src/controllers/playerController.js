const prisma = require("../utils/prisma");
const ALL_TYPES = [
  'pts', 'reb', 'ast', 'stl', 'blk', 'tov', 'min',
  'fgPct', 'tppPct', 'ftPct', 'fgm', 'fga', 'fg3m', 'fg3a', 'ftm', 'fta',
  'oreb', 'dreb', 'eff', 'astTov', 'stlTov'
]
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
const getPlayerById =async(req,res)=>{
    try{
        const player  =await prisma.player.findUnique({
            where:{id:parseInt(req.params.id)},
            include:{
                seasonStats:true,
                team:true
            }
        })
        if(!player){
            return res.status(404).json({message:"No player found"});
        }
        return res.status(200).json({player});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

const getLeaders =async(req,res)=>{
    try{
        const {type ,limit}=req.query;
        if(!type||!limit){
            return res.status(400).json({message:"Missing type or limit"});
        }
        let types;
        if(type==='all'){
            types = ALL_TYPES;
        }
        else{
            types =type.split(",");
        }
        const leaders = await Promise.all(
            types.map(async (type) => {
                const leader = await prisma.playerSeasonStat.findMany({
                    orderBy:{
                        [type]:"desc"
                    },
                    take:parseInt(limit),
                    include:{
                        player:true
                    }
                })
                return { type, leader }
            })
        )
        return res.status(200).json({leaders});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}


module.exports ={getPlayers ,getPlayerById,getLeaders}