import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { id, inventory } = await req.json();

    const { error } = await supabase
      .from("products")
      .update({ inventory })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({
      success: false,
      error: "Failed to update inventory.",
    });
  }
}