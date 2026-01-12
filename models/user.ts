import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    name: String,
    email:String,
    phone : String,
    role :{type:String, enum:["provider","user"]},
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    address: String,

});

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error as any);
    }
});

export default mongoose.models.User || mongoose.model("User", UserSchema)