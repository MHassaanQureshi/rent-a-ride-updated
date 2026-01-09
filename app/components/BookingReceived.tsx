"use client"
import React from "react";
import {useState,useEffect} from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "./Loader";
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

// rendering the data of booking that provider received
export default function BookingReceived(){
   const [bookingsreceived, setBookingsreceived] = useState<BookingType[]>([]);
    const [loading, setLoading] = useState(true);
      const router = useRouter();
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
    finally{
      setLoading(false)
    }
   }
       const updatedates = async(id:string,startDate:string,endDate:string)=>{
    try{
    const data = await fetch(`/api/vehicles/updatedates`,{
      method:"POST",
      headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({id,startDate,endDate})
    });
    if(data.ok){
        alert("vehicle updated")
      
        
    }
    if(!data.ok){
        alert("vehicle not updated")
        
    }
  }
    catch(e){
      alert(`failed to update vehicle ${e}`)
    }
    finally{
      setLoading(false)
    }
   }

      const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();
      useEffect(() => {
          const fetchBookingsreceived = async () => {
            const res = await fetch("/api/bookings/byid");
            if (!res.ok) return;
            const data = await res.json();
            setBookingsreceived(data);
            setLoading(false)
          };
         
            fetchBookingsreceived();
           
          
          
        }, []);
    const updateVehicleStatus = async(id:string,status:string,startdate?:string,enddate?:string)=>{
        
        try{
        const data = await fetch(`/api/bookings/update/${id}`,{
          method:"POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({id,status,startdate,enddate})
        });
        if(data.ok){
            alert("Booking updated")
            router.refresh()
          
            
        }
        if(!data.ok){
            alert("Booking not updated")
            
        }
      }
        catch(e){
          alert(`failed to update Booking ${e}`)
        }
       }

   if (loading) return <Loader />;
      
    return(
           <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">
                Bookings You Have Received
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
                        "Total Amount",
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
                    {bookingsreceived.map((booking) => (
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
                          {booking.totalprice}
                        </td>
                        <td className="p-2 border border-gray-700 text-sm md:text-base">
                          {booking.Delivery_status}
                        </td>
                        <td className="p-2 border border-gray-700 flex gap-2 justify-center">
                          <button
                            className="bg-green-500 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                            onClick={() =>
                              updateVehicleStatus(
                                booking._id,
                                "Booked Waiting for initial Payment",formatDate(booking.startDate),formatDate(booking.endDate)
                              )
                            }
                            disabled={
                              booking.Delivery_status === "Cancelled" ||
                              booking.Delivery_status === "Booked Waiting for initial Payment" ||
                             
                              booking.Delivery_status === "Accepted Waiting for Delivery" ||
                              booking.Delivery_status === "received" ||
                              booking.Delivery_status === "Declined" 
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-600 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                            onClick={() => updateVehicleStatus(booking._id, `Declined`)}
                            disabled={
                              booking.Delivery_status === "Declined" ||
                              booking.Delivery_status === "received" ||
                              booking.Delivery_status === "Accepted Waiting for Delivery" ||
                              booking.Delivery_status === "Cancelled" 
                            }
                          >
                            Reject
                          </button>
                         {
                          booking.Delivery_status !== "Declined" && booking.Delivery_status !== "cancelled" && booking.Delivery_status !==  "Booked Waiting for Confirmation" &&  <div className="flex flex-row gap-2">
                            <button
                            className="bg-red-600 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                           
                          >
                            <Link href={`/dashboard/slipshow/${booking._id}`}>view slip</Link>

                          </button>
                           <button
                            className="bg-green-500 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                            onClick={() =>
                             {
                               updatedates(booking.Vehicle_id,booking.startDate,booking.endDate);
                              updateVehicleStatus(
                                booking._id,
                                "Accepted Waiting for Delivery",formatDate(booking.startDate),formatDate(booking.endDate)
                              )
                             }
                            }
                            disabled={
                              
                              booking.Delivery_status === "Booked Waiting for Confirmation" ||
                              booking.Delivery_status === "received" ||
                              booking.Delivery_status === "Declined" ||
                              booking.Delivery_status === "Accepted Waiting for Delivery" ||
                              booking.Delivery_status === "Cancelled"
                            }
                          >
                           Confirm Booking
                          </button>
                          </div>
                         }
                          {
                            ( booking.Delivery_status === "Cancelled" || booking.Delivery_status === "Declined"  || booking.Delivery_status=== "received") &&   <button
                            className="bg-red-600 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                           onClick={()=>{
                            deleteBooking(booking._id);
                            
                           }}
                          >
                            Delete
                          </button>
                          }
                         
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>


    )
}