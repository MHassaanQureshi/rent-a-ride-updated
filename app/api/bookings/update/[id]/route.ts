import { connectDataBase } from "@/lib/db";
import booking from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDataBase();

    const { id, status } = await req.json();
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

    // Update booking status
    const updatedBooking = await booking.findByIdAndUpdate(
      id,
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
