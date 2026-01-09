import mongoose from "mongoose";


const VehicleSchema = new mongoose.Schema({
    
    name : String,
    model : String,
    fuel_type:String,
    color: String,
    availability: {type:String,default:"Yes"},
    description: String,
    price :Number,
    address:String,
    Vehicletype:{type:String,enum :["bike","car","pickup"],},
    image:[],
    fromavailabilityDate : String,
    toavailabilityDate : String,
    bookedfromDate :{type:String,default:""},
    bookedtillDate :{type:String,default:""},
    provider_id:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
    // images : {type:mongoose.Schema.Types.ObjectId,ref:"Images"},
    // reviews:{type:mongoose.Schema.Types.ObjectId,ref:"reviews"},

})

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema)