const jwt = require('jsonwebtoken')
const auth = async (req,res,next)=> {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
        
    }

    try{
const extractToken =jwt.verify(token,process.env.JWT_KEY)
    req.user=extractToken
    req.userInfo = extractTokenInfo
    }catch(error){
        return res.status(401).json({message:"Unauthorized"})
    }
    next()
}

module.exports = auth