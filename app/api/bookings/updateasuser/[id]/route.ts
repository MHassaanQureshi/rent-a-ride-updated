import { connectDataBase } from "@/lib/db";
import booking from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";

// Updating booking status
export async function POST(req: NextRequest) {
  try {
    await connectDataBase();

    const { id } = await req.json();
    console.log("Updating booking:", id);

    const updatedItem = await booking.findByIdAndUpdate(
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
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { message: `Failed to update booking: ${error}` },
      { status: 500 }
    );
  }
}
