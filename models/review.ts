import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    Vehicle_id :{type:mongoose.Schema.Types.ObjectId , ref:"Vehicle"},
    name:String,
    review:String,
    user_id:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
})
export default mongoose.models.Review || mongoose.model("Review", ReviewSchema)