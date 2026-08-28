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
    } =
      await supabaseAdmin.auth.admin.getUserById(
        id
      );

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This customer does not have an email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (user.email_confirmed_at) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This customer's email is already verified.",
        },
        {
          status: 400,
        }
      );
    }

    const { error: resendError } =
      await supabaseAdmin.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo:
            "https://apexxbiolabs.com/account",
        },
      });

    if (resendError) {
      console.error(
        "Verification resend error:",
        resendError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            resendError.message ||
            "Unable to resend verification email.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification email sent to ${user.email}.`,
    });
  } catch (error) {
    console.error(
      "Resend verification route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending the verification email.",
      },
      {
        status: 500,
      }
    );
  }
}