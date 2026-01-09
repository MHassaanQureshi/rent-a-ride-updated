import { connectDataBase } from "@/lib/db";
import Doc from "@/models/documents";

import { NextRequest, NextResponse } from "next/server";
// posting slip on db

export async function POST(req:NextRequest){
    await connectDataBase();
    const {booking_id,Vehicle_id,image} = await req.json()
    console.log(image)
    
    const slipdata = await Doc.create({booking_id,Vehicle_id,image})
    return NextResponse.json({message:"created",data:slipdata})
}
