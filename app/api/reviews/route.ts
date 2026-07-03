import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {
      name,
      rating,
      review,
      shipping_rating,
      packaging_rating,
      product_rating,
      ordering_rating,
      support_rating,
    } = await req.json();

    if (!name || !rating || !review) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("reviews").insert({
      name,
      rating,
      review,
      shipping_rating: shipping_rating || null,
      packaging_rating: packaging_rating || null,
      product_rating: product_rating || null,
      ordering_rating: ordering_rating || null,
      support_rating: support_rating || null,
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