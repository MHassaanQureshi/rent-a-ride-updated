import EditVehicle from "@/app/components/EditVehicle";
import React from "react";
import CarCard from "@/app/components/CarCard";
import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
import Vehicle from "@/models/vehicle";
interface VehicleType {
  
    _id: string;
    name: string;
    model: string;
    fuel_type: string;
    color: string;
    description: string;
    price: number;
    image: [];
    fromavailabilityDate: string;
    toavailabilityDate: string;
    availability: string;
    provider_id: string;
    Vehicletype:string;
  };

// edit vehicle page
export default async function Home({ params }: { params: Promise<{ id: string }> }){
    await connectDataBase();
      const { id } = await params;
      const vehicle = await Vehicle.findById(id).lean<VehicleType>();
     
      
      
      if (!vehicle) {
        return <div className="text-white p-4">Vehicle not found.</div>;
      }
      
      const car = JSON.parse(JSON.stringify(vehicle)) as VehicleType;
    
    return(
        <EditVehicle vehicle={car} />
    )
}