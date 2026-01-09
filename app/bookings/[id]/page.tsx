import Vehicle from "@/models/vehicle";
import { connectDataBase } from "@/lib/db";
import BookingClient from "../../components/BookingClient";
import React from "react";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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
}

interface BookingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingsPage({ params }: BookingsPageProps) {
  await connectDataBase();
  const { id } = await params;

  const vehicle = await Vehicle.findById(id).lean<VehicleType | null>();

  if (!vehicle) {
    return <div className="text-white p-4">Vehicle not found.</div>;
  }

  const provider = await User.findById(vehicle.provider_id).lean<{ name?: string } | null>();
  const providername = provider?.name || "unknown";

  return (
    <BookingClient
      vehicle={JSON.parse(JSON.stringify(vehicle))}
      providername={providername}
    />
  );
}
