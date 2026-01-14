import { connectDataBase } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import Vehicle from "@/models/vehicle";
import bookings from "@/models/booking";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDataBase();
    const url = new URL(request.url);
    const pathname = url.pathname;
    // Get the last non-empty segment as the action
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const action = pathSegments[pathSegments.length - 1] || '';

    if (action === 'my') {
      // Handle fetching current user's data
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      try {
        await connectDataBase();

        // Validate the session user ID before using it
        if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
          console.error("Invalid user ID in session:", session.user.id);
          return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await User.findById(session.user.id);

        return NextResponse.json(user);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
    } else {
      // Handle getting all users
      const user = await User.find();
      if (user) {
        return NextResponse.json({ message: "User found", status: 200, data: user });
      } else {
        return NextResponse.json({ message: "user does not exist", status: 400 });
      }
    }
  } catch (err) {
    console.error("Error fetching user:", err);
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
      // Handle user update
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Validate the session user ID before using it
      if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session.user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const body = await request.json();
      console.log(body);

      const updatedItem = await User.findByIdAndUpdate(session?.user.id, body, {
        new: true
      });
      if (!updatedItem) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "User updated successfully",
        data: updatedItem
      });
    } else {
      // Handle creating a new user
      const { name, email, phone, role, password, address } = await request.json();
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return NextResponse.json({ message: "already exist" }, { status: 409 }); // Conflict status
      }

      try {
        const user = await User.create({ name, email, phone, role, password, address });
        return NextResponse.json({ message: "created", data: user }, { status: 201 });
      } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error processing user request:", error);
    return NextResponse.json({ message: `Failed to process request: ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDataBase();

    const session = await getServerSession(authOptions);
    console.log(session);

    // Validate the session user ID before using it
      if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
        console.error("Invalid user ID in session:", session?.user?.id);
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
      }

      const deletedItem = await User.findOneAndDelete({ _id: session?.user.id });
      if (deletedItem) {
        const deletebooking = await bookings.deleteMany({ provider_id: session?.user.id });
        const deletevehicle = await Vehicle.deleteMany({ provider_id: session?.user.id });
      }

      if (!deletedItem) {
        return NextResponse.json({ message: "User deletion failed" }, { status: 400 });
      }

      return NextResponse.json({
        message: "User deletion success",
        status: 200
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json({ message: `Failed to delete user: ${error}` }, { status: 500 });
    }
  }