import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({
    path:['.env.local', '.env']
})

var MONGO_UI = process.env.MONGODB_URL;
console.log(MONGO_UI)
// mongoose.connect(MONGO_UI).then(()=>{console.log("connected")}).catch((e)=>{console.log("failed",e)})
