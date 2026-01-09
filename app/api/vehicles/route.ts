import {connectDataBase} from "@/lib/db"
import { getServerSession } from "next-auth";

import Vehicle from "@/models/vehicle";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";


// updating vehicle data only if session id is provider
export async function POST(res:NextRequest){
     await connectDataBase();
     const session = await getServerSession(authOptions);
    const { name,
    model,
    fuel_type,
    color,
    description,
    price ,
    image,provider_id,
    Vehicletype,
    fromavailabilityDate,
    toavailabilityDate,bookedfromDate,bookedtillDate} = await res.json();
    const vehicle =await Vehicle.create({name,model,fuel_type,color,description,price,image,provider_id,fromavailabilityDate,
    toavailabilityDate,Vehicletype,bookedfromDate,bookedtillDate})
    return NextResponse.json({message:"created",data:vehicle})


}
export async  function GET(){
    const session = await getServerSession(authOptions)
    await connectDataBase();
    const body = await Vehicle.find();
    
    return NextResponse.json(body)


}
// export async function GETBYID(req:NextRequest,{params}:{params:{id:string}}){
//     if(!params){
//         return NextResponse.json({message:"not found"})
//     }
//     const {id} = params
//     const session = await getServerSession()
//     await connectDataBase();
//     const body = await Vehicle.findOne({_id: new ObjectId(id)})
// }
// export async  function DELETE(res:Response){

// }