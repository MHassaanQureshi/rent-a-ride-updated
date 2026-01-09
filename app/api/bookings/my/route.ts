
import { connectDataBase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import bookings from "@/models/booking";

// fetching booking user made based on user id from session and userDeleted context
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

 if(session.user.role === "provider"){
   try {
    await connectDataBase();

    const vehicles = await bookings.find({
     user_id : session.user.id,
    providerasUserDeleted: false,
      
    });
    

    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 

if(session.user.role === "user"){
   try {
    await connectDataBase();

    const vehicles = await bookings.find({user_id : session.user.id,
      userDeleted: false,
    });
    

    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
}
// export async function GETBYID(req: NextRequest, id: string) {
//   const session = await getServerSession(authOptions);

  

//   try {
//     await connectDataBase();

   
//     const vehicleDoc = await (await vehicle.findOne({ user_id: id }))

//     if (!vehicleDoc) {
//       return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
//     }

    
//     const booking = await bookings.findOne({ Vehicle_id: vehicleDoc._id });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     return NextResponse.json({ booking });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
