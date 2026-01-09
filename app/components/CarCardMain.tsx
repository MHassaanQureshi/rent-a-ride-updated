"use client"
import User from "@/models/user";
import { randomInt } from "crypto";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
interface VehicleType {
    vehicle:{
      _id: string;
    name: string;
    model: string;
    fuel_type: string;
    color: string;
    description: string;
    price: string;
    image: string[];
    fromavailabilityDate: string;
    toavailabilityDate: string;
    availability: string;
    provider_id: string;
    user_id:string,
    
    };
    providername:string,
    
}


  // user: {
  //   name: string,
  //   email:string,
  //   phone : string,
  //   role :string,
  //   password: string,
  //   address: string,
  // };


// car card that shows on booking client with form

export default function CarCardMain({vehicle, providername}:VehicleType) {
 const [currentIndex, setCurrentIndex] = useState(0);

  const formattedFromDate = new Date(vehicle.fromavailabilityDate).toISOString().split('T')[0];
  const formattedToDate = new Date(vehicle.toavailabilityDate).toISOString().split('T')[0];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? vehicle.image.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === vehicle.image.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-10 flex flex-col md:flex-row">
      
      <div className="md:w-1/2 p-4 bg-gray-800 relative">
        <img
          src={vehicle.image[currentIndex]}
          alt={`Vehicle ${currentIndex}`}
          className="w-full h-64 object-cover rounded-lg"
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
                i === currentIndex ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>

      
      <div className="md:w-1/2 p-6 flex flex-col justify-between bg-gray-100">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">{vehicle.name}</h1>
          <h2 className="text-lg text-gray-600">Model: {vehicle.model}</h2>
          <p className="text-gray-700">{vehicle.description}</p>
          <p className="text-gray-600">
            Color: <span className="font-medium">{vehicle.color}</span>
          </p>
          <p className="text-gray-600">
            Fuel Type: <span className="font-medium">{vehicle.fuel_type}</span>
          </p>
          <p className="text-lg font-semibold text-gray-800">Price: {vehicle.price}</p>
          <p className="text-lg font-semibold text-gray-800">Provider: {providername}</p>
        </div>

        <div className="mt-4 space-y-3">
          <Link href={`/bookings/${vehicle._id}`}>
            <button className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition">
              Book Now
            </button>
          </Link>
          <div className="bg-white p-3 rounded-lg shadow-inner text-sm text-gray-700 space-y-1">
            <p>
              <strong>From:</strong> {formattedFromDate}
            </p>
            <p>
              <strong>Till:</strong> {formattedToDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
