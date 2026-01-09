"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CarCard from "@/app/components/CarCard";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

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
  provider_id: string;
  user_id: string;
  bookedfromDate: string,
  bookedtillDate :string,
}

interface props {
  vehicle: VehicleType;
  providername: string;
}

export default function BookingClient({ vehicle, providername }: props) {
  const formattedFromDate = vehicle.fromavailabilityDate.split("T")[0];
  const formattedToDate = vehicle.toavailabilityDate.split("T")[0];
 const formattedbookedFromDate = (vehicle.bookedfromDate).toString().split('T')[0];
  const formattedbookedToDate =(vehicle.bookedtillDate).toString().split('T')[0];

  const fromdate = new Date(formattedFromDate);
  const todate = new Date(formattedToDate);
  const bookedfrom = new Date(formattedbookedFromDate)
  const bookedtill = new Date(formattedbookedToDate)
  
  const { data: session, status } = useSession();
  const router = useRouter();

  const [price, setprice] = useState(1);
  const [startdateuser, setstartdateuser] = useState<Date | undefined>();
  const [enddateuser, setenddateuser] = useState<Date | undefined>();

  const [startCalendarMonth, setStartCalendarMonth] = useState<Date>(fromdate);
  const [endCalendarMonth, setEndCalendarMonth] = useState<Date>(fromdate);

  const [formData, setFormData] = useState({
    name: session?.user.name,
    email: session?.user.email,
    phone: "",
    address: "",
    Vehicle_id: vehicle._id,
    startDate: startdateuser,
    endDate: enddateuser,
    location: "",
    paymentmethod: "",
    booking: "",
    user_id: session?.user.id,
    provider_id: vehicle.provider_id,
    vehicle_name: vehicle.name,
  });

  useEffect(() => {
    const totalprice = (startdate: string, enddate: string) => {
      const start = new Date(startdate);
      const end = new Date(enddate);
      const diff = end.getTime() - start.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      const totalPrice = days * vehicle.price;
      setprice(totalPrice);
    };

    totalprice(vehicle.fromavailabilityDate, vehicle.toavailabilityDate);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalprice: price,
          startDate: startdateuser,
          endDate: enddateuser,
        }),
      });

      if (res.ok) {
        alert("Booking added successfully! Please Go to Dashboard to upload the Paid receipt of 50% to confirm Booking");
        router.push(`/dashboard/${session?.user.role}`);
      } else {
        console.error("Failed booking:", await res.text());
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };
  const [ischecked,setcheck] = useState(false)
   const handlecheckchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setcheck(true)
  }


  return (
    <div className="flex flex-col items-start md:flex-row md:gap-2">
      <div className="md:w-10/12 ml-10">
         <CarCard vehicle={vehicle} providername={providername} />
      </div>
     {/* form to make booking */}
      {status === "authenticated" && (
        <div className="flex flex-col  items-center mt-10 p-4 md:w-1/2">
          <h1 className="text-2xl font-bold text-white">Submit Your Details</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 text-white p-6 rounded-xl w-[70%] flex flex-col gap-4 items-center md:gap-8"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-[80%] border-b-2 bg-transparent text-white border-gray-600 focus:border-gray-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-[80%] border-b-2 bg-transparent text-white border-gray-600 focus:border-gray-400"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-[80%] border-b-2 bg-transparent text-white border-gray-600 focus:border-gray-400"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-[80%] border-b-2 bg-transparent text-white border-gray-600 focus:border-gray-400"
              required
            />
            <div className="flex flex-col items-center">
              <span className="flex flex-col items-center">
                <label>Start Date</label>
                <Calendar
                  mode="single"
                  selected={startdateuser}
                  onSelect={(date) => setstartdateuser(date)}
                  onMonthChange={(month) => setStartCalendarMonth(month)}
                  month={startCalendarMonth}
                 disabled={(date) =>
                    date.getTime() < fromdate.getTime() ||
                    date.getTime() > todate.getTime() ||
                    (date.getTime() >= bookedfrom.getTime() && date.getTime() <= bookedtill.getTime())
}
                  className="rounded-lg border bg-gray-700 text-white"
                />
              </span>
              <span className="flex flex-col items-center">
                <label>End Date</label>
                <Calendar
                  mode="single"
                  selected={enddateuser}
                  onSelect={(date) => setenddateuser(date)}
                  onMonthChange={(month) => setEndCalendarMonth(month)}
                  month={endCalendarMonth}
                  disabled={(date) =>
                  date.getTime() < fromdate.getTime() ||
                  date.getTime() > todate.getTime()  ||
                  (date.getTime() >= bookedfrom.getTime() && date.getTime() <= bookedtill.getTime())
}
                  className="rounded-lg border bg-gray-700 text-white"
                />
              </span>
            </div>
            <label>Payment Method</label>
            <select
              name="paymentmethod"
              value={formData.paymentmethod}
              onChange={handleChange}
              className="bg-gray-700 text-white border border-gray-600 rounded p-2"
              required
            >
              <option value="">Select</option>
              <option value="banktransfer">Bank Transfer</option>
              <option value="online">Online Transfer</option>
            </select>
            <p className="text-gray-300">You will have to pay 50% of the amount before delivery.</p>
            <span className="flex flex-row items-center gap-2">
              <h1 className="text-white">Agree and Continue</h1>
              <input type="checkbox" className="text-white" onChange={handlecheckchange}/>
            </span>
            {
              ischecked && <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Submit
            </button>
            }
          </form>
        </div>
      )}
      {status === "unauthenticated" && (
        <div className="flex flex-row items-center w-full justify-center align-middle mt-10" id="login">
          <button className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600">
            <Link href="/auth/login">Please Sign In first</Link>
          </button>
        </div>
      )}
    </div>
  );
}
