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
    const { userId, reason } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // ------------------------------------
    // GET CUSTOMER FROM SUPABASE AUTH
    // ------------------------------------

    const {
      data: { user },
      error: getUserError,
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (getUserError || !user) {
      return NextResponse.json(
        {
          error:
            getUserError?.message ||
            "Customer account could not be found.",
        },
        { status: 404 }
      );
    }

    const firstName =
      user.user_metadata?.first_name || null;

    const lastName =
      user.user_metadata?.last_name || null;

    // ------------------------------------
    // ARCHIVE CUSTOMER BEFORE DELETION
    // ------------------------------------

    const { error: archiveError } =
      await supabaseAdmin
        .from("deleted_customers")
        .insert({
          auth_user_id: user.id,
          email: user.email || null,
          first_name: firstName,
          last_name: lastName,
          account_created_at:
            user.created_at || null,
          deleted_by: "admin",
          reason:
            typeof reason === "string" &&
            reason.trim()
              ? reason.trim()
              : null,
        });

    if (archiveError) {
      console.error(
        "Deleted customer archive error:",
        archiveError
      );

      return NextResponse.json(
        {
          error:
            "The customer could not be archived, so the account was NOT deleted.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------
    // DELETE ACCOUNT-SPECIFIC DATA
    // ------------------------------------

    // Favorites
    const { error: favoritesError } =
      await supabaseAdmin
        .from("favorites")
        .delete()
        .eq("user_id", userId);

    if (favoritesError) {
      console.error(
        "Favorites delete error:",
        favoritesError
      );
    }

    // Profile, if one exists
    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (profileError) {
      console.error(
        "Profile delete error:",
        profileError
      );
    }

    /*
      IMPORTANT:

      We intentionally DO NOT delete:
      - orders
      - payment history
      - refund history
      - historical transaction records

      Those remain available for business records.
    */

    // ------------------------------------
    // DELETE SUPABASE AUTH ACCOUNT
    // ------------------------------------

    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

    if (authError) {
      console.error(
        "Auth delete error:",
        authError
      );

      return NextResponse.json(
        {
          error:
            authError.message ||
            "Unable to delete customer account.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Customer account archived and deleted successfully.",
    });
  } catch (error: unknown) {
    console.error(
      "Delete customer error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}