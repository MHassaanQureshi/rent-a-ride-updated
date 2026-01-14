import { connectDataBase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import vehicle from "@/models/vehicle";
import bookings from "@/models/booking";
import User from "@/models/user";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDataBase();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    // Get the last non-empty segment as the action
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const action = pathSegments[pathSegments.length - 1] || '';

    if (action === 'byid') {
      // Handle bookings by provider ID - bookings made to provider's vehicles
      if (session.user.role === "provider") {
        try {
          await connectDataBase();

          // Validate and convert session user ID to ObjectId for comparison
          if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
            console.error("Invalid user ID in session:", session.user.id);
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
          }

          const userIdAsObjectId = new mongoose.Types.ObjectId(session.user.id);
          const bookingsReceived = await bookings.find({
            provider_id: userIdAsObjectId,
            providerDeleted: false,
          });

          return NextResponse.json(bookingsReceived);
        } catch (err) {
          console.error(err);

          // If it's an ObjectId conversion error, return a specific message
          if (err instanceof Error && err.name === 'CastError') {
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
          }

          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
      }
    } else if (action === 'my') {
      // Handle user's own bookings (bookings made by the user)
      if (session.user.role === "user") {
        try {
          await connectDataBase();

          // Validate and convert session user ID to ObjectId for comparison
          if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
            console.error("Invalid user ID in session:", session.user.id);
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
          }

          const userIdAsObjectId = new mongoose.Types.ObjectId(session.user.id);
          const userBookings = await bookings.find({
            user_id: userIdAsObjectId,
            userDeleted: false,
          });

          return NextResponse.json(userBookings);
        } catch (err) {
          console.error(err);

          // If it's an ObjectId conversion error, return a specific message
          if (err instanceof Error && err.name === 'CastError') {
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
          }

          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
      } else if (session.user.role === "provider") {
        // Provider's own bookings (when provider rents other people's vehicles)
        try {
          await connectDataBase();

          // Validate and convert session user ID to ObjectId for comparison
          if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
            console.error("Invalid user ID in session:", session.user.id);
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
          }

          const userIdAsObjectId = new mongoose.Types.ObjectId(session.user.id);
          const providerBookings = await bookings.find({
            user_id: userIdAsObjectId,
            providerasUserDeleted: false,
          });

          return NextResponse.json(providerBookings);
        } catch (err) {
          console.error(err);

          // If it's an ObjectId conversion error, return a specific message
          if (err instanceof Error && err.name === 'CastError') {
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
          }

          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
      }
    } else {
      // Handle generic GET for bookings
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (err) {
    console.error("Error fetching bookings:", err);
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

    if (action === 'update') {
      // Handle booking updates
      const { id, status } = await request.json();
      console.log("Updating booking:", id, "to status:", status);

      // Fetch current booking
      const existingBooking = await bookings.findById(id);
      if (!existingBooking) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 }
        );
      }

      // Prevent redundant updates
      if (existingBooking.Delivery_status === status) {
        return NextResponse.json(
          { message: "Status is already the same. No update needed." },
          { status: 200 }
        );
      }

      // Update booking status
      const updatedBooking = await bookings.findByIdAndUpdate(
        id,
        { Delivery_status: status },
        { new: true }
      );

      return NextResponse.json({
        message: "Status updated successfully",
        updatedBooking
      });
    } else if (action === 'updateasuser') {
      // Handle booking update as user
      const { id } = await request.json();
      console.log("Updating booking:", id);

      const updatedItem = await bookings.findByIdAndUpdate(
        id,
        { providerasUserDeleted: true },
        { new: true }
      );

      if (!updatedItem) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Status updated successfully",
        updatedBooking: updatedItem
      });
    } else {
      // Handle creating a new booking (when action is not 'update' or 'updateasuser')
      const body = await request.json();

      try {
        const newBooking = await bookings.create(body);
        console.log(newBooking);

        // Update vehicle dates
        const updatedVehicle = await vehicle.findByIdAndUpdate(
          body.vehicle_id,
          {
            bookedfromDate: body.startDate,
            bookedtillDate: body.endDate,
          },
          { new: true }
        );

        if (updatedVehicle) {
          return NextResponse.json({ message: "created", data: newBooking });
        } else {
          return NextResponse.json({ message: "failed to update vehicle dates" });
        }
      } catch (e) {
        console.log(e);
        return NextResponse.json({ message: `Error creating booking: ${e}` });
      }
    }
  } catch (error) {
    console.error("Error processing booking request:", error);
    return NextResponse.json({ message: `Failed to process request: ${error}` }, { status: 500 });
  }
}

