import { connectDataBase } from "@/lib/db";
import Vehicle from "@/models/vehicle";
import { NextResponse } from "next/server";


// listing filter 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vehicletype = searchParams.get("vehicletype");
  const fueltype = searchParams.get("fueltype");
  const maxprice = searchParams.get("maxprice");
  const minprice = searchParams.get("minpirce");

  const filter :{
    vehicletype?: string,
    fueltype? : string,
    price?:{
      $gte?:number,
      $lte?:number,
    }

    
  } = {}


  if(vehicletype) filter.vehicletype = vehicletype;
  if(fueltype) filter.fueltype = fueltype;
  if(minprice || maxprice)
    {
      filter.price = {}
      if(minprice)
      {
        filter.price.$gte = Number(minprice)
      }
      if(maxprice)
      {
        filter.price.$gte = Number(maxprice)
      }
    } 
 
  try {
    await connectDataBase();

   if(vehicletype){
     const vehicles = await Vehicle.find({Vehicletype:vehicletype});
     return NextResponse.json(vehicles, { status: 200 });
   }
   if(fueltype){
     const vehicles = await Vehicle.find({fuel_type:fueltype});
     return NextResponse.json(vehicles, { status: 200 });
   }
   if(minprice){
     const vehicles = await Vehicle.find({price:minprice});
     return NextResponse.json(vehicles, { status: 200 });
   }
   if(maxprice){
     const vehicles = await Vehicle.find({price:maxprice});
     return NextResponse.json(vehicles, { status: 200 });
   }
   else{
    return NextResponse.json({message:"cant find",  status: 404 });
   }
    
  } catch (error) {
    console.error("Filter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
