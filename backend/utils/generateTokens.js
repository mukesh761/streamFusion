import jwt from "jsonwebtoken";
export const generateToken= (user)=>{
    return jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET);

}
