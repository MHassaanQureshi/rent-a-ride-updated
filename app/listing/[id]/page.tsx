
import CarCard from "@/app/components/CarCard";
import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
import Vehicle from "@/models/vehicle";
import Loader from "@/app/components/Loader";
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
    bookedfromDate: string,
    bookedtillDate :string,
    provider_id: string;
    
  };

  // user: {
  //   name: string,
  //   email:string,
  //   phone : string,
  //   role :string,
  //   password: string,
  //   address: string,
  // };



interface provider {
    name:string;
  
    
}

// fetching data of a single vehicle using dynamic params
export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {

  await connectDataBase();
  const { id } = await params;
  const vehicle = await Vehicle.findById(id).lean<VehicleType>();
  const provider = await User.findById(vehicle?.provider_id)
  const providername = provider?.name || "unknown"
  
  
  if (!vehicle) {
    return <div className="text-white p-4">Vehicle not found.</div>;
  }
  const car = JSON.parse(JSON.stringify(vehicle)) as VehicleType;
 
  
  return (
    <div className="flex items-center justify-center w-full">
      
        <CarCard vehicle={car} providername={providername}/>
    </div>
  );
}
