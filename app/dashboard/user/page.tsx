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
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
       
      } catch {
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
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <aside className="md:w-1/4 w-full bg-gray-900 text-white p-4">
        <DashboardNav />
      </aside>
     <main className="md:w-3/4 w-full p-4 overflow-x-auto" id="bookings">

          <div className="max-w-full">
       <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                Your Bookings
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] bg-gray-800 rounded-md text-white">
                  <thead>
                    <tr>
                      {[
                        "Name",
                        "Email",
                        "Address",
                        "Phone",
                        "Start Date",
                        "End Date",
                        "Vehicle Name",
                        "Delivery Status",
                        "Actions",
                      ].map((head) => (
                        <th
                          key={head}
                          className="p-2 border border-gray-700 text-sm md:text-base whitespace-nowrap"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-t border-gray-700">
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.name}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.email}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.address}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.phone}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {formatDate(booking.startDate)}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {formatDate(booking.endDate)}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.vehicle_name}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.Delivery_status}
                        </td>
                        
                        <td className="p-2 border border-gray-700 flex gap-2 justify-center">
                          <button
                            className="bg-red-600 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                            onClick={() =>
                              updateVehicleStatus(
                                booking._id,
                                `Cancelled`
                              )
                            }
                            disabled={
                              booking.Delivery_status === "Cancelled" ||
                              booking.Delivery_status === "received"||
                              booking.Delivery_status === "Declined" ||
                              booking.Delivery_status === "Booked Waiting for initial Payment"
                            }
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-green-500 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
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
                          {/* <button
                            className="bg-green-500 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                            
                            disabled={
                              booking.Delivery_status === "Cancelled" ||
                              booking.Delivery_status === "received" ||
                              booking.Delivery_status === "pending" ||
                              booking.Delivery_status === "Declined" 
                              
                            }
                          >
                           Upload Receipt
                          </button> */}
                          {
                            booking.Delivery_status === "Booked Waiting for initial Payment" && ( 
                            <AddSlip  booking_id = {booking._id} Vehicle_id={booking.Vehicle_id}/>
                            
                            )
                          }
                              <button
                            className="bg-red-600 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                           onClick={()=>{
                            deleteBooking(booking._id);
                            
                           }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            </div>
            
     </main>
    </div>
  )
}
