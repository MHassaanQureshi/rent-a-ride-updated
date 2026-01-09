import { connectDataBase } from "@/lib/db";
import booking from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectDataBase();

    const { id } = await params;
    const { status } = await req.json();
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;

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

    const updatedBooking = await booking.findOneAndUpdate(
      { _id: id },
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
      const deletedBooking = await booking.findOneAndDelete({ _id: id });
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