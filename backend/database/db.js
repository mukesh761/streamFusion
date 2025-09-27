import mongoose from "mongoose";
 const connection=mongoose.connect("mongodb+srv://mukesh737462:mukesh737462@cluster0.xtd8d.mongodb.net/streamfusion")
    .then(()=>console.log("MongoDB is connected"))
    .catch((error)=>console.log(error.message));
 
export default connection;
