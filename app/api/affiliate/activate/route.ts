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
    const authorizationHeader =
      request.headers.get("authorization");

    const accessToken =
      authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice(7)
        : null;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify affiliate account.",
        },
        { status: 401 }
      );
    }

    const { data: affiliate, error: affiliateError } =
      await supabaseAdmin
        .from("affiliates")
        .select("id, status")
        .eq("user_id", user.id)
        .maybeSingle();

    if (affiliateError || !affiliate) {
      return NextResponse.json(
        {
          success: false,
          error: "Affiliate account not found.",
        },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("affiliates")
      .update({
        status: "active",
      })
      .eq("id", affiliate.id);

    if (updateError) {
      console.error(
        "Affiliate activation error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to activate affiliate account.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Affiliate activation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to activate affiliate account.",
      },
      { status: 500 }
    );
  }
}