import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const code = String(formData.get("code") || "")
      .trim()
      .toUpperCase();

    const discountPercent = Number(
      formData.get("discount") || 0
    );

    const commissionPercent = Number(
      formData.get("commission") || 0
    );

    // Validate required fields
    if (!name || !email || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and affiliate code are required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid customer discount percentage.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(commissionPercent) ||
      commissionPercent < 0 ||
      commissionPercent > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid affiliate commission percentage.",
        },
        { status: 400 }
      );
    }

    const discountRate = discountPercent / 100;
    const commissionRate = commissionPercent / 100;

    // Make sure affiliate email/code do not already exist
    const { data: existingAffiliate } = await supabaseAdmin
      .from("affiliates")
      .select("id, email, code")
      .or(`email.eq.${email},code.eq.${code}`)
      .maybeSingle();

    if (existingAffiliate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An affiliate with this email or code already exists.",
        },
        { status: 409 }
      );
    }

    // Send Supabase invite
    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo:
            "https://apexxbiolabs.com/affiliate/setup-password",
          data: {
            name,
            role: "affiliate",
          },
        }
      );

    if (inviteError || !inviteData.user) {
      console.error(
        "Affiliate invite error:",
        inviteError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            inviteError?.message ||
            "Unable to send affiliate invitation.",
        },
        { status: 500 }
      );
    }

    // Create affiliate database record
    const { error: affiliateInsertError } =
      await supabaseAdmin
        .from("affiliates")
        .insert({
          user_id: inviteData.user.id,
          name,
          email,
          code,
          discount_rate: discountRate,
          commission_rate: commissionRate,
          status: "invited",
        });

    if (affiliateInsertError) {
      console.error(
        "Affiliate insert error:",
        affiliateInsertError
      );

      /*
       * Clean up the auth account if the affiliate
       * database record failed.
       */
      await supabaseAdmin.auth.admin.deleteUser(
        inviteData.user.id
      );

      return NextResponse.json(
        {
          success: false,
          error:
            affiliateInsertError.message ||
            "Unable to create affiliate.",
        },
        { status: 500 }
      );
    }

    // Send admin back to affiliate dashboard
    return NextResponse.redirect(
      new URL(
        "/admin/affiliates?invite=success",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Affiliate invitation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create affiliate invitation.",
      },
      { status: 500 }
    );
  }
}