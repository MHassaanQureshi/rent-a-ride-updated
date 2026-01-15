"use client";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loader from "../components/Loader";
import { Car, Bike, Truck, Fuel, Palette, DollarSign, MapPin, Filter, X } from "lucide-react";

interface VehicleType {
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
  provider_id: string;
  Vehicletype: string;
}

export default function Listing() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [vehicle, setvehicle] = useState<VehicleType[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles", {
        method: "GET",
      });
      const data = await res.json();
      setvehicle(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const Cartype = async (type: string) => {
    setLoading(true);
    setSelectedVehicleType(type);
    try {
      // Build the query string with both filters
      const queryParams = new URLSearchParams();
      if (type !== "all") queryParams.append("vehicletype", type);
      if (selectedFuelType !== "all") queryParams.append("fueltype", selectedFuelType);

      let queryString = queryParams.toString();
      if (queryString) queryString = "?" + queryString;

      const data = await fetch(`/api/vehicles/filter${queryString}`);
      if (data.ok) {
        const body = await data.json();
        setvehicle(body);
        setLoading(false);
      } else {
        alert("filter failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fueltype = async (type: string) => {
    setLoading(true);
    setSelectedFuelType(type);
    try {
      // Build the query string with both filters
      const queryParams = new URLSearchParams();
      if (selectedVehicleType !== "all") queryParams.append("vehicletype", selectedVehicleType);
      if (type !== "all") queryParams.append("fueltype", type);

      let queryString = queryParams.toString();
      if (queryString) queryString = "?" + queryString;

      const data = await fetch(`/api/vehicles/filter${queryString}`);
      if (data.ok) {
        const body = await data.json();
        setvehicle(body);
        setLoading(false);
      } else {
        alert("filter failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearFilters = () => {
    setSelectedVehicleType("all");
    setSelectedFuelType("all");
    fetchData();
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 p-8">Failed to load Vehicles. Please try again later.</p>;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="h1 text-gray-900 dark:text-white mb-4">
            Explore Our <span className="text-blue-600 dark:text-blue-400">Fleet</span>
          </h1>
          <p className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect vehicle for your journey from our diverse collection
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-800 animate-slide-in">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="h4 text-gray-900 dark:text-white">Filters</h2>
            {(selectedVehicleType !== "all" || selectedFuelType !== "all") && (
              <button
                onClick={clearFilters}
                className="ml-auto px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors border border-gray-300 dark:border-gray-700 lift-hover"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vehicle Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Vehicle Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FilterButton
                  icon={<Filter className="w-4 h-4" />}
                  label="All"
                  active={selectedVehicleType === "all"}
                  onClick={() => {
                  setSelectedVehicleType("all");
                  // Apply remaining filter (fuel type) or fetch all if no other filters
                  if (selectedFuelType !== "all") {
                    const data = fetch(`/api/vehicles/filter?fueltype=${selectedFuelType}`);
                    data.then(res => {
                      if (res.ok) {
                        res.json().then(body => setvehicle(body));
                      } else {
                        alert("filter failed");
                      }
                    }).catch(err => console.error(err));
                  } else {
                    fetchData(); // fetch all if both filters are "all"
                  }
                }}
                />
                <FilterButton
                  icon={<Car className="w-4 h-4" />}
                  label="Car"
                  active={selectedVehicleType === "car"}
                  onClick={() => Cartype("car")}
                />
                <FilterButton
                  icon={<Bike className="w-4 h-4" />}
                  label="Bike"
                  active={selectedVehicleType === "bike"}
                  onClick={() => Cartype("bike")}
                />
                <FilterButton
                  icon={<Truck className="w-4 h-4" />}
                  label="Pickup"
                  active={selectedVehicleType === "pickup"}
                  onClick={() => Cartype("pickup")}
                />
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Fuel Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <FilterButton
                  icon={<Filter className="w-4 h-4" />}
                  label="All"
                  active={selectedFuelType === "all"}
                  onClick={() => {
                  setSelectedFuelType("all");
                  // Apply remaining filter (vehicle type) or fetch all if no other filters
                  if (selectedVehicleType !== "all") {
                    const data = fetch(`/api/vehicles/filter?vehicletype=${selectedVehicleType}`);
                    data.then(res => {
                      if (res.ok) {
                        res.json().then(body => setvehicle(body));
                      } else {
                        alert("filter failed");
                      }
                    }).catch(err => console.error(err));
                  } else {
                    fetchData(); // fetch all if both filters are "all"
                  }
                }}
                />
                <FilterButton
                  icon={<Fuel className="w-4 h-4" />}
                  label="Petrol"
                  active={selectedFuelType === "petrol"}
                  onClick={() => fueltype("petrol")}
                />
                <FilterButton
                  icon={<Fuel className="w-4 h-4" />}
                  label="Diesel"
                  active={selectedFuelType === "diesel"}
                  onClick={() => fueltype("diesel")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicle.length > 0 ? (
            vehicle.map((vehicle, index) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Car className="w-16 h-16 mx-auto" />
              </div>
              <p className="h3 text-gray-900 dark:text-white mb-2">No vehicles found</p>
              <p className="body-regular text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        active
          ? "bg-blue-500 text-white shadow-md lift-hover"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

// Vehicle Card Component
function VehicleCard({ vehicle, index }: { vehicle: VehicleType; index: number }) {
  const [imageError, setImageError] = useState(false);
  const imageIndex = vehicle.image.length > 0 ? Math.floor(Math.random() * vehicle.image.length) : 0;

  const getVehicleIcon = () => {
    switch (vehicle.Vehicletype) {
      case "bike":
        return <Bike className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
      case "pickup":
        return <Truck className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
      default:
        return <Car className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <Link href={`/listing/${vehicle._id}`}>
      <div
        className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 hover:-translate-y-1 animate-fade-in lift-hover"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
          {!imageError && vehicle.image[imageIndex] ? (
            <img
              src={vehicle.image[imageIndex]}
              alt={vehicle.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              {getVehicleIcon()}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 capitalize border border-gray-200 dark:border-gray-700 shadow-sm">
              {getVehicleIcon()}
              {vehicle.Vehicletype}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="h4 text-gray-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {vehicle.name}
          </h3>

          {/* Details Grid */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <Car className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </div>
              <span>Model: <span className="font-medium text-gray-900 dark:text-gray-200">{vehicle.model}</span></span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <Fuel className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </div>
              <span>Fuel: <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{vehicle.fuel_type}</span></span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <Palette className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </div>
              <span>Color: <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">{vehicle.color}</span></span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${vehicle.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-500">/day</span>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 text-sm lift-hover">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
