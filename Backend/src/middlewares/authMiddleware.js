import  jwt  from "jsonwebtoken";
import { APIError } from "../utils/APIError.js";
import User from "../models/user.model.js";

const jwtVerify=(req, res, next)=>{

    try{
    const token=req.cookies.accessToken;

    if(!token){
         throw new APIError(401,"no access token")
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    const user= User.findById(decoded?._id).select("-password -refreshToken")

    if(!user)
    {
        throw new APIError(401,"Access Token is not valid")
    }

    req.user=user

    next();
}
catch(error){
    throw new APIError(400,error?.message);
}
    
}

export {jwtVerify}