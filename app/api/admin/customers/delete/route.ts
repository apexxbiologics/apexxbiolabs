import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // ------------------------------------
    // DELETE ACCOUNT-SPECIFIC DATA
    // ------------------------------------

    // Favorites
    const { error: favoritesError } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("user_id", userId);

    if (favoritesError) {
      console.error("Favorites delete error:", favoritesError);
    }

    // Profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Profile delete error:", profileError);
    }

    /*
      IMPORTANT:
      We intentionally DO NOT delete:
      
      - orders
      - payment history
      - refunds
      - affiliate payout history
      
      Those should remain for business/accounting records.
    */

    // ------------------------------------
    // DELETE SUPABASE AUTH USER
    // ------------------------------------

    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Auth delete error:", authError);

      return NextResponse.json(
        {
          error: authError.message || "Unable to delete customer account.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer account deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete customer error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}