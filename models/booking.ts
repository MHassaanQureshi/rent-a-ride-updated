import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const bookingsSchema = new mongoose.Schema({
            name:String,
            email:String,
            phone:String,
            address:String,
            vehicle_name:{type:String, default:"none"},
            startDate:Date,
            endDate:Date,
        
            totalprice:Number,
            paymentmethod:String,
            Delivery_status:{type:String, enum:["Delivered","Accepted Waiting for Delivery","Booked Waiting for initial Payment","Declined","cancelled","received","Booked Waiting for Confirmation"],default:"Booked Waiting for Confirmation"},
            user_id:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
            Vehicle_id :{type:mongoose.Schema.Types.ObjectId , ref:"Vehicle"},
            userDeleted:{type:Boolean , default:false},
            providerDeleted:{type:Boolean , default:false},
            providerasUserDeleted:{type:Boolean , default:false},
            provider_id :{type:mongoose.Schema.Types.ObjectId , ref:"User"},
            
   


})

export default mongoose.models.bookings || mongoose.model("bookings", bookingsSchema)