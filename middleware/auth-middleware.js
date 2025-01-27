const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success : false,
            message : 'Access is denied. No token is provided. Please Login to continue'
        })
    }

    //decode the token 
    try {
        const decodeTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY);
        // req.userInfo -> set the request side user information
        req.userInfo=decodeTokenInfo;
        
        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'Access is denied. No token is provided. Please Login to continue'
        })
    }

   
}

module.exports=authMiddleware;