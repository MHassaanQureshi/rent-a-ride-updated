import {connectDataBase} from "@/lib/db"
import { NextResponse,NextRequest } from "next/server";
import bookings from "@/models/booking";
import Vehicle from "@/models/vehicle"
// posting booking to database
export async function POST(req:NextRequest){
    await connectDataBase();
   const body = await req.json();
     
    
    try{
      
     const user = await bookings.create(body)
      console.log(user)
      return NextResponse.json({message:"created",data:user})
    }
    catch(e){
     console.log(e)
    }

       try{
        const updatedate = await Vehicle.findByIdAndUpdate(body.vehicle_id,{
             bookedfromDate :body.startDate,
             bookedtillDate :body.endDate,
            
        },
        {new : true}
        )
        if(updatedate){
          return NextResponse.json({message:"updated"})
        }
        else{
          return NextResponse.json({message:"failed to update"})
        }
      }

      catch(e){
        return NextResponse.json({message:`${e}`})
      }
}