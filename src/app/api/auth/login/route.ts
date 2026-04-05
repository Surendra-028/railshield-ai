import { NextResponse } from "next/server";
import { usersDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = usersDB.find(u => u.email === email && u.password === password);

    if (user) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}