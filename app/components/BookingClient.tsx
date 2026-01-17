"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  image: string[];
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
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Booking Form */}
        {status === "authenticated" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
            {/* Compact Vehicle Info */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                {vehicle.image && vehicle.image.length > 0 && (
                  <img
                    src={vehicle.image[0]}
                    alt={vehicle.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="h3 text-gray-900 dark:text-white">{vehicle.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Model: {vehicle.model} • ${vehicle.price}/day</p>
                </div>
              </div>
            </div>
            <h2 className="h2 text-gray-900 dark:text-white mb-6 text-center">Complete Your Booking</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="15" r="3"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M10 15H6a4 4 0 0 0-4 4v2"/>
                    <path d="m21.7 16.4-.9-.9"/>
                  </svg>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      required
                      readOnly
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Rental Dates Section */}
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  Rental Dates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Start Date
                    </label>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
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
                        className="rounded-lg border-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      End Date
                    </label>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
                      <Calendar
                        mode="single"
                        selected={enddateuser}
                        onSelect={(date) => setenddateuser(date)}
                        onMonthChange={(month) => setEndCalendarMonth(month)}
                        month={endCalendarMonth}
                        disabled={(date) =>
                          date.getTime() < fromdate.getTime() ||
                          date.getTime() > todate.getTime() ||
                          (date.getTime() >= bookedfrom.getTime() && date.getTime() <= bookedtill.getTime())
                        }
                        className="rounded-lg border-0"
                      />
                    </div>
                  </div>
                </div>

                {startdateuser && enddateuser && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Selected Period</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {startdateuser.toLocaleDateString()} - {enddateuser.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Days</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {Math.ceil((enddateuser.getTime() - startdateuser.getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Price</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                          ${price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="2" y2="22"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Payment Method
                </h3>

                <div className="mb-6">
                  <label htmlFor="paymentmethod" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Method
                  </label>
                  <select
                    id="paymentmethod"
                    name="paymentmethod"
                    value={formData.paymentmethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    required
                  >
                    <option value="">Choose a payment method</option>
                    <option value="banktransfer">Bank Transfer</option>
                    <option value="online">Online Transfer</option>
                  </select>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-yellow-200 dark:border-yellow-800/50">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4"/>
                      <path d="M12 16h.01"/>
                    </svg>
                    <span><strong>Important:</strong> You will need to pay 50% of the total amount (${(price / 2).toFixed(2)})
                    before delivery. The remaining balance will be due upon pickup.</span>
                  </p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={ischecked}
                    onChange={handlecheckchange}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the terms and conditions and confirm that all information provided is accurate.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!ischecked || !formData.paymentmethod || !startdateuser || !enddateuser}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 lift-hover shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className="flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 border border-gray-200 dark:border-gray-800 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400">
                  <path d="M18 22h-7a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4z"/>
                  <circle cx="9" cy="10" r="2"/>
                  <path d="M16 17v.01"/>
                </svg>
              </div>
              <h3 className="h3 text-gray-900 dark:text-white mb-4">Please Sign In</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to be logged in to make a booking.
              </p>
              <Link href="/auth/login">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 lift-hover shadow-lg">
                  Sign In to Continue
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
