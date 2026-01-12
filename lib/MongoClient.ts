import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URL!;
let client;
let ClientPromise: Promise<MongoClient>;
let options = {}

if(!uri){
    console.log("please connect your mongo url")

}
client = new MongoClient(uri,options)
ClientPromise = client.connect()
export default ClientPromise;