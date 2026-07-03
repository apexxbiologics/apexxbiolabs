import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const formData = await req.formData();
  const id = formData.get("id") as string;

  await supabaseAdmin
    .from("reviews")
    .update({ approved: true })
    .eq("id", id);

  return NextResponse.redirect(new URL("/admin/reviews", req.url));
}