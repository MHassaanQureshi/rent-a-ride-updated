import mongoose from "mongoose";
const DocSchema = new mongoose.Schema({
    car_id:{type:mongoose.Schema.Types.ObjectId , ref:"Vehicle"},
    booking_id:{type:mongoose.Schema.Types.ObjectId , ref:"bookings"},
    image:[],
    
   
   


})

export default mongoose.models.Doc || mongoose.model("Doc", DocSchema)