import { connectDataBase } from "@/lib/db";
import Vehicle from "@/models/vehicle";

import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
  await connectDataBase();
  const {id,startDate,endDate} = await req.json()
    console.log({id,startDate,endDate})
    // return NextResponse.json({message:`failed to delete because `})
    try {
        const updatedItem = await Vehicle.findByIdAndUpdate(id,{
            bookedfromDate: startDate,
            bookedtillDate:endDate,
        },
        {new : true}
)
        if (!updatedItem) {
            alert("Status Updated")
        
        }
        alert("Status Updated")
           
      } catch (error) {
        return NextResponse.json({message:`failed to delete because ${error}`})
         
      }

}