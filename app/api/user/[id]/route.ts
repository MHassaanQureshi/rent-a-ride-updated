import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDataBase();

    const { id } = await params;

    // Get specific user by ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", status: 200, data: user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDataBase();

    const { id } = await params;
    const body = await req.json();

    // Update specific user by ID
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return NextResponse.json({ message: `Failed to update user: ${error}` }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDataBase();

    const { id } = await params;

    // Delete specific user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    return NextResponse.json({ message: `Failed to delete user: ${error}` }, { status: 500 });
  }
}