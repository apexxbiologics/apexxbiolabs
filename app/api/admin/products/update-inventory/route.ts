import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { id, inventory, price } = await req.json();

    const { error } = await supabaseAdmin
      .from("products")
      .update({
        inventory: Number(inventory),
        price: Number(price),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}