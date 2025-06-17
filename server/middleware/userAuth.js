import JWT from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const {token} = req.cookies; 

    if(!token){
        return res.json({success: false, message: 'Unauthorized access'});
    }

    try {
        
        const tokenDecode = JWT.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;  //attach userId to request body
        } else {
            return res.json({success: false, message: 'Unauthorized access'});
        }

        next();  //call controller function

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export default userAuth;