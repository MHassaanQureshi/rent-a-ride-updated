"use client"
import React from "react";
import {useState,useEffect} from "react"
import { useRouter } from "next/navigation";
import AddSlip from "./AddDoc";
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

// rendering the booking data that provider made

export default function Bookings(){
   const [bookings, setBookings] = useState<BookingType[]>([]);
    const [loading, setLoading] = useState(true);
      const router = useRouter();
     
      const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();
      useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/bookings/my");
      if (!res.ok) return;
      const data = await res.json();
      setBookings(data);
      setLoading(false)
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
   const updateuser = async(id:string)=>{

   
    try{
    const data = await fetch(`/api/bookings/updateasuser/${id}`,{
      method:"POST",
      headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({id})
    });
    if(data.ok){
        alert("vehicle deleted")
      
        
    }
    if(!data.ok){
        alert("vehicle not deleted")
        router.refresh()
          
        
    }
  }
    catch(e){
      alert(`failed to delete user ${e}`)
    }
   }

    if (loading) return <Loader />;

    return(
          <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">
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
                          {booking.totalprice}
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
                              booking.Delivery_status === "received"
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
                              booking.Delivery_status === "Booked Waiting for Confirmation" ||
                              booking.Delivery_status === "Booked Waiting for initial Payment" 
                            }
                          >
                            Received
                          </button>
                           {
                           booking.Delivery_status === "Booked Waiting for initial Payment" &&  <AddSlip  booking_id = {booking._id} Vehicle_id={booking.Vehicle_id}/>
                                                    }
                          {
                           ( booking.Delivery_status === "Cancelled" || booking.Delivery_status === "Declined" || booking.Delivery_status === "received") &&
                               <button
                            className="bg-red-600 p-1 rounded text-xs md:text-sm disabled:bg-gray-400"
                           onClick={()=>{
                             updateuser(booking._id)
                            
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