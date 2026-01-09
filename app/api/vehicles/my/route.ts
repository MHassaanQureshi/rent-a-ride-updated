import { connectDataBase } from "@/lib/db";
import { getServerSession } from "next-auth";
import vehicle from "@/models/vehicle";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// fetching vehicle uploaded or added by provider on db using session user id
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDataBase();

    const vehicles = await vehicle.find({ provider_id: session.user.id });

    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// export async function GETBYID(id:string) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await connectDataBase();

//     const vehicles = await vehicle.findById({ _id : id });

//     return NextResponse.json(vehicles);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
// export async function GETBYTYPE(type:string) {
//   const session = await getServerSession(authOptions);

//   try {
//     await connectDataBase();

//     const vehicles = await vehicle.find({vehicletype : type });

//     return NextResponse.json(vehicles);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
