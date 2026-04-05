import { NextResponse } from "next/server";
import { Resend } from "resend";
import { usersDB } from "@/lib/db"; // Try the @/ path again after restarting the TS server

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Find user in the database
    const user = usersDB.find((u: any) => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = generatedOtp; // Store OTP in memory

    await resend.emails.send({
      from: 'RailShield <onboarding@resend.dev>',
      to: email,
      subject: 'Your Password Reset Code',
      html: `<strong>${generatedOtp}</strong> is your reset code.`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}