"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Signout from "@/app/components/SignOut";
import Vehicle from "@/models/vehicle";
import { NextResponse } from "next/server";
import { signOut } from "next-auth/react"
import DashboardNav from "@/app/components/DashboardNav";

import vehicle from "@/models/vehicle";
import AddSlip from "@/app/components/AddDoc";
import Loader from "@/app/components/Loader";
interface VehicleType {
  _id: string;
  name: string;
  model: string;
  fuel_type: string;
  color: string;
  available: string;
  description: string;
  price: number;
  image: string;
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
  vehicle_name:string;
}


// user dashboard showing the bookings that user made

export default function User() {
  
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter()
  // const [vehicleid,setvehicleid] = useState("")
  // const [bookingid,setbookingid] = useState("")
  
 
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/my");

        if (!res.ok) {
          console.error('Error fetching user bookings:', res.status, await res.text().catch(() => 'Unable to read error response'));
          setBookings([]);
          setLoading(false);
          return;
        }

        const responseText = await res.text();

        if (!responseText) {
          console.warn('Empty response from bookings my API');
          setBookings([]);
          setLoading(false);
          return;
        }

        try {
          const data = JSON.parse(responseText);
          // Only set bookings if data exists and is an array
          if (Array.isArray(data)) {
            setBookings(data);
          } else {
            console.warn('Bookings my API did not return an array');
            setBookings([]);
          }
        } catch (parseError) {
          console.error('Error parsing bookings my data:', parseError);
          setBookings([]);
        }
      } catch (error) {
        console.error('Network error while fetching user bookings:', error);
        setBookings([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
   const updateVehicleStatus = async(id:string,status:string)=>{
        
        try{
        const data = await fetch(`/api/bookings/update/${id}`,{
          method:"POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({id,status})
        });
        if(data.ok){
            alert("Booking updated")
            router.push("/dashboard/provider")
          
            
        }
        if(!data.ok){
            alert("Booking not updated")
            
        }
      }
        catch(e){
          alert(`failed to update Booking ${e}`)
        }
       }


  
   const deleteBooking = async(id:string)=>{
    try{
    const data = await fetch(`/api/bookings/delete/${id}`,{
      method:"DELETE"
    });
    if(data.ok){
        alert("vehicle deleted")
      
        
    }
    if(!data.ok){
        alert("vehicle not deleted")
        
    }
  }
    catch(e){
      alert(`failed to delete user ${e}`)
    }
   }

  
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

 
if(loading) return <Loader />

  return(
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <aside className="md:w-1/4 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 border-r border-gray-200 dark:border-gray-800">
        <DashboardNav />
      </aside>

      <main className="md:w-3/4 w-full p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-full">
          {/* User Bookings Section */}
          <section className="mb-10">
            <h2 className="h2 text-gray-900 dark:text-white mb-6">
              Your Bookings
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
                <p className="body-large text-gray-600 dark:text-gray-400">No bookings found. Start by renting a vehicle!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => {
                  const statusColors: Record<string, string> = {
                    'Booked Waiting for initial Payment': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
                    'Booked Waiting for Confirmation': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
                    'Accepted Waiting for Delivery': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200',
                    'Delivered': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
                    'received': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
                    'Cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
                    'Declined': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
                  };

                  const isCancelable = ![
                    "Cancelled",
                    "received"
                  ].includes(booking.Delivery_status);

                  const isReceivable = ![
                    "Cancelled",
                    "received",
                    "Booked Waiting for Confirmation",
                    "Booked Waiting for initial Payment"
                  ].includes(booking.Delivery_status);

                  return (
                    <div key={booking._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200 lift-hover">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{booking.vehicle_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.Delivery_status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                          {booking.Delivery_status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Rental Period</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                          <span className="font-medium text-gray-900 dark:text-white">${booking.totalprice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Customer</span>
                          <span className="font-medium text-gray-900 dark:text-white">{booking.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Contact</span>
                          <span className="font-medium text-gray-900 dark:text-white">{booking.phone}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {isCancelable && (
                          <button
                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors min-w-[80px] lift-hover"
                            onClick={() =>
                              updateVehicleStatus(
                                booking._id,
                                `Cancelled`
                              )
                            }
                            disabled={
                              booking.Delivery_status === "Cancelled" ||
                              booking.Delivery_status === "received" ||
                              booking.Delivery_status === "Declined" ||
                              booking.Delivery_status === "Booked Waiting for initial Payment"
                            }
                          >
                            Cancel
                          </button>
                        )}

                        {isReceivable && (
                          <button
                            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors min-w-[80px] lift-hover"
                            onClick={() => updateVehicleStatus(booking._id, "received")}
                            disabled={
                              booking.Delivery_status === "Cancelled" ||
                              booking.Delivery_status === "received" ||
                              booking.Delivery_status === "Declined" ||
                              booking.Delivery_status === "Booked Waiting for initial Payment" ||
                              booking.Delivery_status === "Booked Waiting for Confirmation"
                            }
                          >
                            Received
                          </button>
                        )}

                        {booking.Delivery_status === "Booked Waiting for initial Payment" && (
                          <AddSlip booking_id={booking._id} Vehicle_id={booking.Vehicle_id} />
                        )}

                        {(booking.Delivery_status === "Cancelled" ||
                         booking.Delivery_status === "Declined" ||
                         booking.Delivery_status === "received") && (
                          <button
                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors min-w-[80px] lift-hover"
                            onClick={() => {
                              deleteBooking(booking._id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
