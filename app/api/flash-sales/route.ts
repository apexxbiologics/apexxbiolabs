import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET() {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("flash_sales")
      .select(
        `
        id,
        product_id,
        sale_price,
        starts_at,
        ends_at,
        active,
        created_at
        `
      )
      .eq("active", true)
      .lte("starts_at", now)
      .gt("ends_at", now)
      .order("starts_at", { ascending: false });

    if (error) {
      console.error("Public flash sales fetch error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load active flash sales.",
          details: error.message,
          sales: [],
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        sales: data || [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Public flash sales route error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong loading active flash sales.",
        sales: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}