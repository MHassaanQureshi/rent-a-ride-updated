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
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Your Bookings
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No bookings found. Start by renting a vehicle!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => {
                    const statusColors: Record<string, string> = {
                      'Booked Waiting for initial Payment': 'bg-amber-100 text-amber-800',
                      'Booked Waiting for Confirmation': 'bg-blue-100 text-blue-800',
                      'Accepted Waiting for Delivery': 'bg-indigo-100 text-indigo-800',
                      'Delivered': 'bg-purple-100 text-purple-800',
                      'received': 'bg-green-100 text-green-800',
                      'Cancelled': 'bg-red-100 text-red-800',
                      'Declined': 'bg-gray-100 text-gray-800',
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
                      <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900 text-lg">{booking.vehicle_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.Delivery_status] || 'bg-gray-100 text-gray-800'}`}>
                            {booking.Delivery_status}
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Rental Period</span>
                            <span className="font-medium">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Amount</span>
                            <span className="font-medium">${booking.totalprice}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Customer</span>
                            <span className="font-medium">{booking.name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Contact</span>
                            <span className="font-medium">{booking.phone}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {isCancelable && (
                            <button
                              className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors min-w-[80px]"
                              onClick={() =>
                                updateVehicleStatus(
                                  booking._id,
                                  `Cancelled`
                                )
                              }
                            >
                              Cancel
                            </button>
                          )}

                          {isReceivable && (
                            <button
                              className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors min-w-[80px]"
                              onClick={() => updateVehicleStatus(booking._id, "received")}
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
                              className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors min-w-[80px]"
                              onClick={() => {
                                updateuser(booking._id);
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


    )
}