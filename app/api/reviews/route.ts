import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { name, rating, review } = await req.json();

    if (!name || !rating || !review) {
      return NextResponse.json(
        { success: false, message: "Please fill out all fields." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("reviews").insert({
      name,
      rating,
      review,
      approved: false,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted. It will appear after approval.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}