import bcrypt from "bcryptjs"
import userModel from "../Schema/userSchema.js"
import { generateToken } from "../utils/generateTokens.js";

//function to login user
export const signupUser=async(req,res)=>{
   try {
    const {name,email,username,password}=req.body;
    if(!name || !email || !username ||!password){
        return res.json({message:"all fields are required"});
    }
    let checkUser=await userModel.findOne({email}) || await userModel.findOne({username}) ;
    if(checkUser){
        return res.json({message:"user  already exist"});
    }
   const salt=await bcrypt.genSalt(10);
   const hash=await bcrypt.hash(password,salt);
   const newUser=await userModel.create({
    name,
    email,
    password:hash,
    username,
   })

   //user without password
  

   const token=generateToken(newUser);
   
   res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
   path: "/",  // Ensures the cookie works across subdomains
    maxAge: 3600000*24*30,
});
   return res.json({message:"user created",newUser})
   } catch (error) {
    if(error){
        console.log(error);
        return res.json({message:error.message});
    }
   }

}

//function to login the user
export const loginUser=async (req,res)=>{
   try {
    const {username,email,password}=req.body;

   let newUser=await userModel.findOne({email});
    if(!newUser){
        return res.json({message:"email or password is incorrect"})
    }
   const matchedPassword=await bcrypt.compare(password,newUser.password)
   if(!matchedPassword){
    return res.json({message:"email or password is incorrect"})
   }
   const token=generateToken(newUser);
  
   res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
   path: "/",  // Ensures the cookie works across subdomains
    maxAge: 3600000*24*30,
});
   return res.json({message:"user logged in",newUser})
   } catch (error) {
    if(error){
        console.log(error);
        return res.json({message:error.message})
    }
   }
    
}

//function to logout user
export const logoutUser=(req,res)=>{
    res.cookie('token', " ", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
       path: "/",  // Ensures the cookie works across subdomains
        maxAge: 0,
    });
    res.json({message:"logout succesfull"})
    
}

