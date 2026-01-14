import { connectDataBase } from "@/lib/db";
import Vehicle from "@/models/vehicle";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDataBase();

    const { id } = await params;

    // Handle special actions
    if (id === 'my') {
      // This should return vehicles owned by the user
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validate the session user ID
      if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session.user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      // Convert session user ID to ObjectId for comparison
      const userIdAsObjectId = new mongoose.Types.ObjectId(session.user.id);
      const vehicles = await Vehicle.find({ provider_id: userIdAsObjectId });

      return NextResponse.json(vehicles);
    } else if (id === 'filter') {
      // Handle vehicle filtering - this should be handled by the main route
      // But if it reaches here, we can return an error or redirect
      const url = new URL(req.url);
      const searchParams = url.searchParams;

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
          filter.price.$lte = Number(maxprice)
        }
      }

      const vehicles = await Vehicle.find(filter);
      return NextResponse.json(vehicles, { status: 200 });
    }

    // Validate that the ID is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid vehicle ID:", id);
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }

    // Get specific vehicle by ID
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (err) {
    console.error("Error fetching vehicle by ID:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDataBase();

    // Optional: check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Handle special actions that shouldn't be processed as vehicle updates
    if (id === 'my' || id === 'filter') {
      return NextResponse.json({ error: `Cannot update ${id} as a vehicle` }, { status: 400 });
    }

    // Validate that the ID is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid vehicle ID:", id);
      return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
    }

    const body = await req.json();
    console.log("Update body:", body);

    // Convert id to ObjectId for database operations
    const vehicleId = new mongoose.Types.ObjectId(id);

    const updatedItem = await Vehicle.findByIdAndUpdate(vehicleId, body, {
      new: true,
    });

    if (!updatedItem) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Status updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { message: `Failed to update vehicle: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDataBase();

    const { id } = await context.params;

    // Handle special actions that shouldn't be processed as vehicle deletions
    if (id === 'my' || id === 'filter') {
      return NextResponse.json({ error: `Cannot delete ${id} as a vehicle` }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    // Validate that the ID is a proper ObjectId
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

    if (!deletedItem) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Vehicle deleted successfully",
      deletedVehicle: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { message: `Failed to delete vehicle: ${error}` },
      { status: 500 }
    );
  }
}