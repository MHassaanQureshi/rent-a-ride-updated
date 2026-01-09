import mongoose from "mongoose";
const MONGOOSE_URI = process.env.MONGODB_URI;
if (!MONGOOSE_URI) {
    throw new Error("please connect mongoose uri first");

}


let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null ,  promise:null};
}

export const connectDataBase = async() => {
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
       cached.promise = mongoose.connect(MONGOOSE_URI,
        {
           dbName:"rentcar"
        },

       ).then(()=>mongoose.connection);

    }

    try{
        cached.conn = await cached.promise;
        return cached.conn;

    }
    catch(e){
        cached.promise = null;
        throw e;
    }

}

//  try{
//        if(mongoose.connection.readyState >=1){
//         return;
//        }
//        await mongoose.connect(MONGOOSE_URI || "")
      
//     }
//     catch(err){
//         console.log("error:"+ err)
//     }
