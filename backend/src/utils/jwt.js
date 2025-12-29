const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}

const signToken =(id)=>{
    return jwt.sign({id},JWT_SECRET,{
        expiresIn:"1h"
    })
}

const verifyToken =(token)=>{
    try{
        return jwt.verify(token,JWT_SECRET);
    }
    catch(error){
        return null;
    }
}

module.exports = {signToken,verifyToken};