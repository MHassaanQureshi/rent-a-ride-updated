import mongoose,{Schema} from "mongoose";


const UserSchema = new Schema({
    name: String,
    email:String,
    phone : String,
    role :{type:String, enum:["provider","user"]},
    password: String,
    address: String,


})

export default mongoose.models.User || mongoose.model("User", UserSchema)