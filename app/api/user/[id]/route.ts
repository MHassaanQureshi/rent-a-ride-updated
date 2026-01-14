import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
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

    // Special handling for reserved action names
    if (id === 'my') {
      // This should be handled by the main user route, but if it reaches here:
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validate the session user ID
      if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session.user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const user = await User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    }

    // Validate that the ID is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid user ID:", id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

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

    // Special handling for reserved action names
    if (id === 'my') {
      // This should be handled by the main user route, but if it reaches here:
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validate the session user ID
      if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session.user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      // Update user using session ID, not the "id" parameter
      const updatedUser = await User.findByIdAndUpdate(session.user.id, body, { new: true });

      if (!updatedUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "User updated successfully",
        data: updatedUser
      });
    }

    // Validate that the ID is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid user ID:", id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

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

    // Special handling for reserved action names
    if (id === 'my') {
      // This should be handled by the main user route, but if it reaches here:
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validate the session user ID
      if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session.user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      // Delete user using session ID, not the "id" parameter
      const deletedUser = await User.findByIdAndDelete(session.user.id);

      if (!deletedUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "User deleted successfully",
        data: deletedUser
      });
    }

    // Validate that the ID is a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid user ID:", id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

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