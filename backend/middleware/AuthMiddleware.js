const jwt=require("jsonwebtoken")
function validateTokenMiddleware(req,res,next){
    const authHeader = req.headers.authorization || "";
    const [scheme, accessToken] = authHeader.split(" ");
    if(scheme !== "Bearer" || !accessToken){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}
module.exports = {
    validateTokenMiddleware
}