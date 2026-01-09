import { connectDataBase } from "@/lib/db";
import User from "@/models/user"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Vehicle from "@/models/vehicle";
import bookings from "@/models/booking"

// deleting user account
export async function DELETE(){
    await connectDataBase();
    
    const session = await getServerSession(authOptions);
    console.log(session)
    try {
        const deletedItem = await User.findOneAndDelete({_id:session?.user.id});
       if(deletedItem){
         const deletebooking = await bookings.deleteMany({provider_id : session?.user.id})
        const deletevehicle = await Vehicle.deleteMany({provider_id : session?.user.id})
        
       }
        if (!deletedItem) {
            alert("user deletion failed")
        
        }
        alert("user deletion success")
           
      } catch (error) {
        return NextResponse.json({message:`failed to delete because ${error}`})
         
      }

}