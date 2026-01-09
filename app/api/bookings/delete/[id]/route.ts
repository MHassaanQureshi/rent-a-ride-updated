import { connectDataBase } from "@/lib/db";
import bookings from "@/models/booking";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params; // Await because params can be a Promise

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

    const updatedBooking = await bookings.findOneAndUpdate(
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
      const deletedBooking = await bookings.findOneAndDelete({ _id: id });
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
// This code handles the deletion of bookings by updating the status based on the user's role.