"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Signout from "@/app/components/SignOut";
import vehicle from "@/models/vehicle";
import DashboardNav from "@/app/components/DashboardNav";
import AddSlip from "@/app/components/AddDoc";
import Bookings from "@/app/components/Bookings";
import BookingReceived from "@/app/components/BookingReceived";
import Loader from "@/app/components/Loader";
interface VehicleType {
  _id: string;
  name: string;
  model: string;
  fuel_type: string;
  color: string;
  availability: string;
  description: string;
  price: number;
  image: string[];
  fromavailabilityDate: string;
  toavailabilityDate: string;

}

interface BookingType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  Vehicle_id: string;
  startDate: string;
  endDate: string;
  location: string;
  totalprice: number;
  paymentmethod: string;
  Delivery_status: string;
  vehicle_name:string,
}

// dashboard for provider to show bookings made,received , and vehicle that
export default function Provider() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  
  
  const [user, setUser] = useState<any>(null);
  

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);
{/*fetching user API call*/}
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/my");

        // Read the response body once
        const responseText = await res.text();

        if (!res.ok) {
          // Handle different status codes appropriately
          if (res.status === 401) {
            console.error('Unauthorized access - redirecting to login');
            router.push('/auth/login');
            return;
          } else if (res.status === 404) {
            console.warn('User not found in database');
            setUser(null);
          } else {
            // Try to parse the error response, but handle case where it's empty or malformed
            let errorData;
            try {
              errorData = responseText ? JSON.parse(responseText) : { error: 'Empty response' };
            } catch (parseError) {
              console.error('Error parsing response:', parseError);
              errorData = { error: 'Invalid response format', details: parseError };
            }
            console.error('Error fetching user:', errorData);
            setUser(null);
          }
          return;
        }

        // Parse the successful response
        if (!responseText) {
          console.warn('Empty response from user API - setting user as null');
          setUser(null);
          return;
        }

        try {
          const data = JSON.parse(responseText);
          // Only set user if data exists and is not empty
          if (data && Object.keys(data).length > 0) {
            setUser(data);
          } else {
            console.warn('User API returned empty data object');
            setUser(null);
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setUser(null);
        }
      } catch (error) {
        console.error('Network error while fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchUser();
    }

  }, [status, router]);

  {/*fetching vehicle API call*/}
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles/my");

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Error fetching vehicles:', errorData);
          setVehicles([]);
          return;
        }

        const responseText = await res.text();

        if (!responseText) {
          console.warn('Empty response from vehicles API - setting vehicles as empty array');
          setVehicles([]);
          return;
        }

        try {
          const data = JSON.parse(responseText);
          // Only set vehicles if data exists and is an array
          if (Array.isArray(data)) {
            setVehicles(data);
          } else {
            console.warn('Vehicles API did not return an array, setting as empty array');
            setVehicles([]);
          }
        } catch (parseError) {
          console.error('Error parsing vehicles data:', parseError);
          setVehicles([]);
        }
      } catch (error) {
        console.error('Network error while fetching vehicles:', error);
        setVehicles([]); // Set empty array to prevent further errors
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated" && session?.user?.role === "provider") {
      fetchVehicles();
    }

  }, [status, session]);

  
{/* Fetching details of received bookings to provider*/}
  


{/*delete vehicle API call*/}
  const deleteVehicle = async(id:string)=>{
    try{
      const response = await fetch(`/api/vehicles/${id}`,{
        method:"DELETE"
      });

      if(response.ok){
        alert("Vehicle deleted successfully");
        // Refresh the vehicles list
        const updatedVehicles = vehicles.filter(vehicle => vehicle._id !== id);
        setVehicles(updatedVehicles);
      } else {
        // Try to get error message from response
        let errorMessage = "Vehicle not deleted";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use default message
        }
        alert(errorMessage);
      }
    }
    catch(e){
      alert(`Failed to delete vehicle: ${e}`);
      console.error("Error deleting vehicle:", e);
    }
    finally{
      setLoading(false);
    }
   }
   

  {/*Update vehicle API call*/}
  
   {/*Formatting Date*/}
 const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  if (loading) return <Loader />;
 
  if (session?.user.role === "user") redirect("/dashboard/user");

  return (
    <>
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-900">

        <aside className="md:w-1/4 w-full bg-white text-gray-900 p-4 border-r border-gray-200">
          <DashboardNav />
        </aside>


        <main className="md:w-3/4 w-full p-4 bg-gray-50 min-h-screen">
          <div className="max-w-full">
            {/* Bookings You Have Received */}
           <BookingReceived />

            {/* Bookings */}
           <Bookings />
            {/* Vehicles */}
            {session?.user?.role === "provider" && (
              <section className="mt-10">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                  Your Vehicles
                </h2>

                {vehicles.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No vehicles found. Add your first vehicle!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => {
                      const availabilityColors: Record<string, string> = {
                        'yes': 'bg-green-100 text-green-800',
                        'no': 'bg-red-100 text-red-800',
                        'available': 'bg-green-100 text-green-800',
                        'not available': 'bg-red-100 text-red-800',
                        'maintenance': 'bg-yellow-100 text-yellow-800',
                        'booked': 'bg-blue-100 text-blue-800',
                      };

                      return (
                        <div key={vehicle._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-gray-900 text-lg">{vehicle.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${availabilityColors[vehicle.availability.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                              {vehicle.availability}
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Model</span>
                              <span className="font-medium">{vehicle.model}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Color</span>
                              <span className="font-medium">{vehicle.color}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Fuel Type</span>
                              <span className="font-medium">{vehicle.fuel_type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Price</span>
                              <span className="font-medium">${vehicle.price}/day</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Availability</span>
                              <span className="font-medium">{formatDate(vehicle.fromavailabilityDate)} - {formatDate(vehicle.toavailabilityDate)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/editvehicle/${vehicle._id}`}>
                              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors min-w-[80px]">
                                Update
                              </button>
                            </Link>
                            <button
                              className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors min-w-[80px]"
                              onClick={() => {
                                deleteVehicle(vehicle._id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
