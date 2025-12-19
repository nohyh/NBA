const getNews=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error}) 
    }
}
module.exports={getNews}