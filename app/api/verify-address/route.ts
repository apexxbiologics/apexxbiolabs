import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Address verification is not set up yet.",
  });
}// placeholder route for future address verification
