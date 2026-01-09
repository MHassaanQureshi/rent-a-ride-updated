import { connectDataBase } from "@/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// fetching user data
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDataBase();

    const user = await User.find({ provider_id: session.user.id });

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
