const {verifyToken} = require("../utils/jwt"); 
const prisma = require("../utils/prisma");

const authMiddleware = async(req,res,next)=>{
    try{
        const authHeader =req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"Unauthorized"});
        }
        const token =authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (e) {
            return res.status(401).json({message:"Unauthorized"});
        }
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"});
        }
       const user =await prisma.user.findUnique({
        where:{
            id:decoded.id
        }
       })
       if(!user){
        return res.status(401).json({message:"Unauthorized"});
       }
       req.user =user;
       next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports = authMiddleware;
