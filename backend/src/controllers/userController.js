const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const {signToken} = require("../utils/jwt");

const signUp =async(req,res)=>{
    try{
        const{username,password} =req.body.user;
        const isUserExist =await prisma.user.findFirst({
            where:{
                username:username
            }
        })
        if(isUserExist){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword =await bcrypt.hash(password,10);
        const user =await prisma.user.create({
            data:{
                username:username,
                password:hashedPassword
            }
        })
        const token =signToken(user.id);
        res.status(201).json({user:{username:user.username},token});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

const signIn =async(req,res)=>{
    try{
        const {username,password} =req.body.user;
        const user =await prisma.user.findUnique({
            where:{
                username:username
            }
        })
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid =await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"})
        }
        const token =signToken(user.id);
        res.status(200).json({user:{username:user.username},token});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
const signOut =async(req,res)=>{
    try{
        res.status(200).json({message:"User logged out"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
const getUser =async(req,res)=>{
    try{
        const user =await prisma.user.findUnique({
            where:{
                id:req.user.id
            },
       select:{
           id:true,
           username:true,
           favoritePlayers:true,
           avatarUrl:true,
           favoriteTeams:true,
       }
       })
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({user});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
const checkUsername =async(req,res)=>{
    try{
        const user =await prisma.user.findUnique({
            where:{
                username:req.query.username
            }
        })
        res.json({exists:!!user});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
module.exports = {signUp,signIn,signOut,getUser,checkUsername};