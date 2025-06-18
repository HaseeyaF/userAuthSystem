import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const {token} = req.cookies; 

    if(!token){
        return res.json({success: false, message: 'Unauthorized access'});
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized access - Invalid token' });
        }

        req.user = { id: decoded.id }; // ✅ store in req.user
        next();  //call controller function

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export default userAuth;