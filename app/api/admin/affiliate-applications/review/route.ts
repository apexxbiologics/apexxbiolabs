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

    const applicationId = String(
      formData.get("applicationId") || ""
    ).trim();

    const action = String(
      formData.get("action") || ""
    ).trim();

    const reviewNotes = String(
      formData.get("reviewNotes") || ""
    ).trim();

    /*
     * ==========================================
     * VALIDATE REQUEST
     * ==========================================
     */

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Application ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid review action.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * FIND APPLICATION
     * ==========================================
     */

    const {
      data: application,
      error: applicationError,
    } = await supabaseAdmin
      .from("affiliate_applications")
      .select(`
        id,
        name,
        email,
        organization,
        website,
        audience,
        status,
        affiliate_id
      `)
      .eq("id", applicationId)
      .maybeSingle();

    if (
      applicationError ||
      !application
    ) {
      console.error(
        "Application lookup error:",
        applicationError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Referral application could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ==========================================
     * ONLY PENDING APPLICATIONS CAN BE REVIEWED
     * ==========================================
     */

    if (
      application.status !== "pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This application has already been reviewed.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ==========================================
     * REJECT APPLICATION
     * ==========================================
     */

    if (action === "reject") {
      const {
        error: rejectError,
      } = await supabaseAdmin
        .from("affiliate_applications")
        .update({
          status: "rejected",
          reviewed_at:
            new Date().toISOString(),
          review_notes:
            reviewNotes || null,
        })
        .eq("id", application.id)
        .eq("status", "pending");

      if (rejectError) {
        console.error(
          "Application rejection error:",
          rejectError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to reject this application.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.redirect(
        new URL(
          `/admin/affiliate-applications/${application.id}`,
          request.url
        ),
        303
      );
    }

    /*
     * ==========================================
     * APPROVE APPLICATION
     * ==========================================
     *
     * Approval does NOT automatically create
     * an affiliate or choose commission rates.
     *
     * After approval, you are redirected to
     * the existing New Affiliate page so YOU
     * can choose:
     *
     * - Referral code
     * - Customer discount
     * - Commission rate
     *
     * Then your existing affiliate invitation
     * flow can send the invitation.
     * ==========================================
     */

    const {
      error: approveError,
    } = await supabaseAdmin
      .from("affiliate_applications")
      .update({
        status: "approved",
        reviewed_at:
          new Date().toISOString(),
        review_notes:
          reviewNotes || null,
      })
      .eq("id", application.id)
      .eq("status", "pending");

    if (approveError) {
      console.error(
        "Application approval error:",
        approveError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to approve this application.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * SEND ADMIN TO AFFILIATE CREATION
     * ==========================================
     *
     * Applicant information is passed in the
     * URL so the New Affiliate page can prefill
     * the form.
     */

    const redirectURL = new URL(
      "/admin/affiliates/new",
      request.url
    );

    redirectURL.searchParams.set(
      "application_id",
      application.id
    );

    redirectURL.searchParams.set(
      "name",
      application.name
    );

    redirectURL.searchParams.set(
      "email",
      application.email
    );

    if (application.organization) {
      redirectURL.searchParams.set(
        "organization",
        application.organization
      );
    }

    return NextResponse.redirect(
      redirectURL,
      303
    );
  } catch (error) {
    console.error(
      "Affiliate application review error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to review this referral application.",
      },
      {
        status: 500,
      }
    );
  }
}