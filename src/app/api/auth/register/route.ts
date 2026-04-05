import { NextResponse } from "next/server";
import { usersDB } from "@/lib/db"; // Use the shared list!

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (usersDB.find(u => u.email === email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    usersDB.push({ email, password });
    console.log("Registered! Current DB Size:", usersDB.length);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}