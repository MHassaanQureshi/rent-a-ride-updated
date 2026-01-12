import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
    throw new Error("please connect mongoose url first");

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
       cached.promise = mongoose.connect(MONGODB_URL,
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
//        await mongoose.connect(MONGODB_URL || "")
      
//     }
//     catch(err){
//         console.log("error:"+ err)
//     }
