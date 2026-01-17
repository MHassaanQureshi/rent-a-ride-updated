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
    <div className="w-full max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl overflow-hidden mt-10">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Gallery Section */}
        <div className="relative bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <img
            src={vehicle.image[currentIndex]}
            alt={`Vehicle ${currentIndex}`}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />

          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg transition-all duration-200 z-10"
          >
            ❮
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg transition-all duration-200 z-10"
          >
            ❯
          </button>

          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {vehicle.image.map((imgSrc, i) => (
              <img
                key={i}
                src={imgSrc}
                alt={`Thumb ${i}`}
                className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 flex-shrink-0 ${
                  i === currentIndex
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-300 dark:ring-blue-700 scale-105'
                    : 'border-transparent hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between p-4 sm:p-6 bg-white dark:bg-gray-800/30">
          <div className="space-y-4">
            <div>
              <h1 className="h2 text-gray-900 dark:text-white break-words">{vehicle.name}</h1>
              <h2 className="text-lg text-gray-600 dark:text-gray-300 mt-1 break-words">Model: {vehicle.model}</h2>
            </div>

            <p className="body-regular text-gray-600 dark:text-gray-400">{vehicle.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span
                    className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: vehicle.color }}
                  ></span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Color</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.color}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6h12l4 4v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8l2-2Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fuel Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{vehicle.fuel_type}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 w-full sm:w-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Rate</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${vehicle.price}</p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 w-full sm:w-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Provider</p>
                  <p className="font-medium text-gray-900 dark:text-white">{providername}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 lift-hover shadow-lg"
              onClick={()=>checkowner(vehicle.provider_id)}
            >
              Book Now
            </button>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                Available Dates
              </h3>
              <Calendar
                mode='range'
                selected = {{from:fromdate,to:todate}}
                onSelect={()=>{}}
                disabled={{from:bookedfrom,to:bookedtill}}
                className="rounded-lg border bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
