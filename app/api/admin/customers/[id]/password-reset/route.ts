import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.admin.getUserById(id);

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found.",
        },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This customer does not have an email address.",
        },
        { status: 400 }
      );
    }

    const { error: resetError } =
      await supabaseAdmin.auth.resetPasswordForEmail(
        user.email,
        {
          redirectTo:
            "https://apexxbiolabs.com/reset-password",
        }
      );

    if (resetError) {
      console.error(
        "Password reset email error:",
        resetError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            resetError.message ||
            "Unable to send password reset email.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Password reset email sent to ${user.email}.`,
    });
  } catch (error) {
    console.error(
      "Password reset route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending the password reset email.",
      },
      { status: 500 }
    );
  }
}