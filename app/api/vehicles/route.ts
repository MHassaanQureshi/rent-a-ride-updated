import { connectDataBase } from "@/lib/db";
import { getServerSession } from "next-auth";
import Vehicle from "@/models/vehicle";
import bookings from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDataBase();
    const url = new URL(request.url);
    const pathname = url.pathname;
    // Get the last non-empty segment as the action
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const action = pathSegments[pathSegments.length - 1] || '';

    if (action === 'my') {
      // Handle fetching user's vehicles
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      try {
        await connectDataBase();

        // Validate the session user ID before converting to ObjectId
        if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
          console.error("Invalid user ID in session:", session.user.id);
          return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Convert session user ID to ObjectId for comparison
        const userIdAsObjectId = new mongoose.Types.ObjectId(session.user.id);
        const vehicles = await Vehicle.find({ provider_id: userIdAsObjectId });

        return NextResponse.json(vehicles);
      } catch (err) {
        console.error("Error fetching vehicles:", err);

        // If it's an ObjectId conversion error, return a specific message
        if (err instanceof Error && err.name === 'CastError') {
          return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
    } else if (action === 'filter') {
      // Handle vehicle filtering
      const { searchParams } = new URL(request.url);
      const vehicletype = searchParams.get("vehicletype");
      const fueltype = searchParams.get("fueltype");
      const maxprice = searchParams.get("maxprice");
      const minprice = searchParams.get("minprice");

      const filter: {
        Vehicletype?: string,
        fuel_type?: string,
        price?: {
          $gte?: number,
          $lte?: number,
        }
      } = {}

      if (vehicletype) filter.Vehicletype = vehicletype;
      if (fueltype) filter.fuel_type = fueltype;
      if (minprice || maxprice) {
        filter.price = {}
        if (minprice) {
          filter.price.$gte = Number(minprice)
        }
        if (maxprice) {
          filter.price.$lte = Number(maxprice) // Fixed: was using $gte for maxprice
        }
      }

      try {
        await connectDataBase();

        // Apply combined filters instead of returning early
        const vehicles = await Vehicle.find(filter);
        return NextResponse.json(vehicles, { status: 200 });
      } catch (error) {
        console.error("Filter error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    } else {
      // Handle getting all vehicles
      const session = await getServerSession(authOptions);
      await connectDataBase();
      const allVehicles = await Vehicle.find();
      return NextResponse.json(allVehicles);
    }
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDataBase();
    const url = new URL(request.url);
    const pathname = url.pathname;
    // Get the last non-empty segment as the action
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const action = pathSegments[pathSegments.length - 1] || '';

    if (action === 'updatedates') {
      // Handle updating vehicle dates
      const { id, startDate, endDate } = await request.json();
      console.log({ id, startDate, endDate });

      try {
        const updatedItem = await Vehicle.findByIdAndUpdate(id, {
          bookedfromDate: startDate,
          bookedtillDate: endDate,
        },
          { new: true }
        );

        if (!updatedItem) {
          return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json({
          message: "Vehicle dates updated successfully",
          data: updatedItem
        });
      } catch (error) {
        return NextResponse.json({ message: `Failed to update vehicle dates because ${error}`, status: 500 });
      }
    } else {
      // Handle creating a new vehicle
      const session = await getServerSession(authOptions);
      const {
        name,
        model,
        fuel_type,
        color,
        description,
        price,
        image,
        provider_id,
        Vehicletype,
        fromavailabilityDate,
        toavailabilityDate,
        bookedfromDate,
        bookedtillDate
      } = await request.json();

      // Validate provider_id if provided, otherwise use session user ID
      let validatedProviderId = provider_id || session?.user?.id;

      if (validatedProviderId && !mongoose.Types.ObjectId.isValid(validatedProviderId)) {
        console.error("Invalid provider ID:", validatedProviderId);
        return NextResponse.json({ message: "Invalid provider ID" }, { status: 400 });
      }

      const vehicle = await Vehicle.create({
        name, model, fuel_type, color, description, price, image,
        provider_id: validatedProviderId,
        Vehicletype, fromavailabilityDate, toavailabilityDate, bookedfromDate, bookedtillDate
      });

      return NextResponse.json({ message: "created", data: vehicle });
    }
  } catch (error) {
    console.error("Error processing vehicle request:", error);
    return NextResponse.json({ message: `Failed to process request: ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDataBase();
    const url = new URL(request.url);
    const pathname = url.pathname;
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const id = pathSegments[pathSegments.length - 1]; // Extract ID from path

    try {
      if (!id) {
        return NextResponse.json(
          { message: "Vehicle ID is required" },
          { status: 400 }
        );
      }

      // Validate the ID as ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid vehicle ID:", id);
        return NextResponse.json(
          { message: "Invalid vehicle ID" },
          { status: 400 }
        );
      }

      // Convert id to ObjectId for database operations
      const vehicleId = new mongoose.Types.ObjectId(id);

      // Delete the vehicle
      const deletedItem = await Vehicle.findByIdAndDelete(vehicleId);

      // Delete related bookings
      const deleteBookingResult = await bookings.deleteMany({
        Vehicle_id: vehicleId
      });

      if (!deletedItem) {
        return NextResponse.json(
          { message: "Vehicle not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Vehicle and related bookings deleted successfully",
        deletedVehicle: deletedItem,
        deletedBookingsCount: deleteBookingResult.deletedCount
      });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      return NextResponse.json(
        { message: `Failed to delete vehicle: ${error}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ message: `Failed to delete vehicle: ${error}` }, { status: 500 });
  }
}