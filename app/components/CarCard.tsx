'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar"
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
interface VehicleType {
  vehicle: {
    _id: string;
    name: string;
    model: string;
    fuel_type: string;
    color: string;
    description: string;
    price: number;
    image: string[];
    fromavailabilityDate: string;
    toavailabilityDate: string;
    availability: string;
    provider_id: string;
    bookedfromDate: string,
    bookedtillDate :string,
  };
  providername: string;
}

// main car card that shows when user wants to see the car details
export default function CarCard({ vehicle, providername }: VehicleType) {
  const [currentIndex, setCurrentIndex] = useState(0);
 const { data: session, status } = useSession();
  
  const formattedFromDate = (vehicle.fromavailabilityDate).toString().split('T')[0];
  const formattedToDate =(vehicle.toavailabilityDate).toString().split('T')[0];
  const formattedbookedFromDate = (vehicle.bookedfromDate).toString().split('T')[0];
  const formattedbookedToDate =(vehicle.bookedtillDate).toString().split('T')[0];

  const fromdate = new Date(formattedFromDate);
  const todate = new Date(formattedToDate);
  const bookedfrom = new Date(formattedbookedFromDate)
  const bookedtill = new Date(formattedbookedToDate)
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? vehicle.image.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === vehicle.image.length - 1 ? 0 : prev + 1));
  };
const checkowner=(id:string)=>{
  if(session?.user.id === id){
    alert("cannot book your own vehicle")
    redirect("/listing")
  }
  else{
    redirect(`/bookings/${vehicle._id}`)
  }
}
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-900 to-black text-white shadow-lg rounded-xl overflow-hidden mt-10  md:max-w-6xl flex flex-col md:flex-row">
      
      <div className="md:w-[80%] p-4 bg-gray-800 relative">
        <img
          src={vehicle.image[currentIndex]}
          alt={`Vehicle ${currentIndex}`}
          className="w-full h-56 md:h-96 object-fit rounded-lg"
        />

        <button
          onClick={prevImage}
          className="absolute  text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full"
        >
          PREV
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 transform  text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full"
        >
          NEXT
        </button>

       
        <div className="flex justify-center gap-2 mt-3">
          {vehicle.image.map((imgSrc, i) => (
            <img
              key={i}
              src={imgSrc}
              alt={`Thumb ${i}`}
              className={`w-12 h-12 object-cover rounded-md border-2 cursor-pointer ${
                i === currentIndex ? 'border-gray-800' : 'border-transparent'
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>

      
      <div className="md:w-1/2 p-6 flex flex-col justify-between bg-gray-800">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{vehicle.name}</h1>
          <h2 className="text-lg text-gray-300">Model: {vehicle.model}</h2>
          <p className="text-gray-300">{vehicle.description}</p>
          <p className="text-gray-400">
            Color: <span className="font-medium text-gray-200">{vehicle.color}</span>
          </p>
          <p className="text-gray-400">
            Fuel Type: <span className="font-medium text-gray-200">{vehicle.fuel_type}</span>
          </p>
          <p className="text-lg font-semibold text-white">Price: {vehicle.price} / Per Day</p>
          <p className="text-lg font-semibold text-white">Provider: {providername}</p>
        </div>

        <div className="mt-4 space-y-3">
          
            <button className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition" onClick={()=>checkowner(vehicle.provider_id)}>
              Book Now
            </button>
         
          <div className="bg-gray-700 p-3 rounded-lg shadow-inner text-sm text-gray-300 space-y-1">
          <Calendar
                  mode='range'
                  selected = {{from:fromdate,to:todate}}
                  onSelect={()=>{}}
                  disabled={{from:bookedfrom,to:bookedtill}}
                  className="rounded-lg border"
                />
          {/* <div className='flex flex-row gap-4'>
              {
              vehicle.bookedfromDate && <div>
                <h1>Booked from :  <span className='font-extrabold '>{formattedbookedFromDate}</span></h1>
              </div>
            }
            {
              vehicle.bookedtillDate && <div>
                <h1>booked till : <span className='font-extrabold '>{formattedbookedToDate}</span></h1>
              </div>
            }
          </div> */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
