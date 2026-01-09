import { connectDataBase } from "@/lib/db";
import Vehicle from "@/models/vehicle";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

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

    const { id } = await params; // ✅ Extract ID after awaiting params
    const body = await req.json();
    console.log("Update body:", body);

    const updatedItem = await Vehicle.findByIdAndUpdate(id, body, {
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
