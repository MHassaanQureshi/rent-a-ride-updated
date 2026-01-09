import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { get } from "http";


export async function POST(req:NextRequest){
  await connectDataBase();
  const session = await getServerSession(authOptions)
   const body= await req.json();
    console.log(body)
      
    // return NextResponse.json({message:`failed to delete because `})
    try {
        const updatedItem = await User.findByIdAndUpdate(session?.user.id,body,
        {new : true}
)
        if (!updatedItem) {
            alert("Status Updated")
        
        }
        alert("Status Updated")
           
      } catch (error) {
        return NextResponse.json({message:`failed to delete because `})
      }
      

}