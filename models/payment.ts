import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({

    id:{ type : mongoose.Schema.Types.ObjectId ,ref : "user"},
    amount: { type : mongoose.Schema.Types.ObjectId ,ref : "car"},
    status:{type: String , enum:["paid","pending"],default:"pending"},
    Paytype:{type:String, enum:["cash","online"],default:"cash"},
    


})

export default mongoose.models.payment || mongoose.model("payment", paymentSchema)