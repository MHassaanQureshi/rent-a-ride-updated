// use to fetch bookings provider received using user id from session

import { connectDataBase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import vehicle from "@/models/vehicle";
import bookings from "@/models/booking";
import User from "@/models/user";

export async function GET() {
  try {
    await connectDataBase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   if(session.user.role === "provider"){
      try {
       await connectDataBase();
   
       const vehicles = await bookings.find({provider_id : session.user.id,
         providerDeleted: false,
         
       });
       
   
       return NextResponse.json(vehicles);
     } catch (err) {
       console.error(err);
       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
     }
   }
    
   
  

    
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
