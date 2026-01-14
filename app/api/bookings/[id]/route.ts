import { connectDataBase } from "@/lib/db";
import booking from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
    if (id === 'byid' || id === 'my') {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validate and convert session user ID to ObjectId for comparison
      if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session.user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const userIdAsObjectId = new mongoose.Types.ObjectId(session.user.id);

      if (id === 'byid' && session.user.role === "provider") {
        // Handle bookings by provider ID - bookings made to provider's vehicles
        const bookingsReceived = await booking.find({
          provider_id: userIdAsObjectId,
          providerDeleted: false,
        });

        return NextResponse.json(bookingsReceived);
      } else if (id === 'my') {
        // Handle user's own bookings (bookings made by the user)
        if (session.user.role === "user") {
          const userBookings = await booking.find({
            user_id: userIdAsObjectId,
            userDeleted: false,
          });

          return NextResponse.json(userBookings);
        } else if (session.user.role === "provider") {
          // Provider's own bookings (when provider rents other people's vehicles)
          const providerBookings = await booking.find({
            user_id: userIdAsObjectId,
            providerasUserDeleted: false,
          });

          return NextResponse.json(providerBookings);
        }
      }
    }

    // Validate that the ID is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid booking ID:", id);
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    // Get specific booking by ID
    const bookingItem = await booking.findById(id);

    if (!bookingItem) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(bookingItem);
  } catch (err) {
    console.error("Error fetching booking by ID:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDataBase();

    const { id } = await params;

    // Handle special actions that shouldn't be processed as booking updates
    if (id === 'byid' || id === 'my') {
      return NextResponse.json({ error: `Cannot update ${id} as a booking` }, { status: 400 });
    }

    const { status } = await req.json();

    // Validate the ID as ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid booking ID:", id);
      return NextResponse.json(
        { message: "Invalid booking ID" },
        { status: 400 }
      );
    }

    console.log("Updating booking:", id, "to status:", status);

    // Fetch current booking
    const existingBooking = await booking.findById(id);
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

    // Convert id to ObjectId for database operations
    const bookingId = new mongoose.Types.ObjectId(id);

    // Update booking status
    const updatedBooking = await booking.findByIdAndUpdate(
      bookingId,
      { Delivery_status: status },
      { new: true }
    );

    return NextResponse.json({
      message: "Status updated successfully",
      updatedBooking
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { message: `Failed to update booking: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;

  // Handle special actions that shouldn't be processed as booking deletions
  if (id === 'byid' || id === 'my') {
    return NextResponse.json({ error: `Cannot delete ${id} as a booking` }, { status: 400 });
  }

  // Validate the ID as ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid booking ID:", id);
    return NextResponse.json(
      { message: "Invalid booking ID" },
      { status: 400 }
    );
  }

  await connectDataBase();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    let updateField: Record<string, boolean> = {};

    if (session.user.role === "provider") {
      updateField = { providerDeleted: true };
    } else if (session.user.role === "user") {
      updateField = { userDeleted: true };
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Convert id to ObjectId for database operations
    const bookingId = new mongoose.Types.ObjectId(id);

    const updatedBooking = await booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: updateField },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // If both user and provider have deleted, remove booking completely
    if (
      (updatedBooking.userDeleted && updatedBooking.providerDeleted) ||
      (updatedBooking.providerasUserDeleted && updatedBooking.providerDeleted)
    ) {
      const deletedBooking = await booking.findOneAndDelete({ _id: bookingId });
      return NextResponse.json({
        message: "Booking fully deleted",
        data: deletedBooking,
      });
    }

    return NextResponse.json({
      message: "Booking updated",
      data: updatedBooking,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to delete because ${error}` },
      { status: 500 }
    );
  }
}