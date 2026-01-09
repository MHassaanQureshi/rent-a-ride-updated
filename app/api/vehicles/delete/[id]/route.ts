import { connectDataBase } from "@/lib/db";
import Vehicle from "@/models/vehicle";
import bookings from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDataBase();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    // Delete the vehicle
    const deletedItem = await Vehicle.findByIdAndDelete(id);

    // Delete related bookings
    const deleteBookingResult = await bookings.deleteMany({
      Vehicle_id: id
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
}
