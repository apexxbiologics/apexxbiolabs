import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

    if (!Array.isArray(cart)) {
      return NextResponse.json(
        { success: false, error: "Invalid cart" },
        { status: 400 }
      );
    }

    for (const item of cart as CartItem[]) {
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("inventory")
        .eq("slug", item.id)
        .single();

      if (fetchError || !product) {
        console.error("Product not found:", item.id);
        continue;
      }

      const newInventory = Math.max(0, product.inventory - item.quantity);

      const { error: updateError } = await supabase
        .from("products")
        .update({ inventory: newInventory })
        .eq("slug", item.id);

      if (updateError) {
        console.error("Inventory update failed:", item.id, updateError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update inventory error:", error);

    return NextResponse.json(
      { success: false, error: "Inventory update failed" },
      { status: 500 }
    );
  }
}