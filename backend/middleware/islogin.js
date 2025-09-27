import jwt from "jsonwebtoken";
import userModel from "../Schema/userSchema.js"

export const islogin=async (req,res,next)=>{
try {
    const token = req.cookies.token;

    // console.log(req.cookies)
    if(!token){
        return res.json({message:"token not found"});
    }
    const decodedUser=jwt.verify(token, process.env.JWT_SECRET);
    if(!decodedUser){
        return res.json({message:"token not valid"});
    }
    const user= await userModel.findOne({_id:decodedUser.userId});
   
    req.user=user;
    next()
} catch (error) {
    if(error){
        console.log(error);
        res.send(error)
    }
}
}