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

type FlashSaleRow = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
  created_at?: string;
};

function validDate(value: unknown) {
  const date = new Date(String(value || ""));
  return Number.isFinite(date.getTime());
}

export async function GET() {
  try {
    const { data: sales, error: salesError } =
      await supabaseAdmin
        .from("flash_sales")
        .select(
          "id, product_id, sale_price, starts_at, ends_at, active, created_at"
        )
        .order("starts_at", { ascending: false });

    if (salesError) {
      console.error("Flash sale GET error:", salesError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load flash sales.",
        },
        { status: 500 }
      );
    }

    const { data: products, error: productsError } =
      await supabaseAdmin
        .from("products")
        .select(
          "id, name, slug, price, size, category, active"
        )
        .order("name", { ascending: true });

    if (productsError) {
      console.error(
        "Flash sale product lookup error:",
        productsError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load products for flash sales.",
        },
        { status: 500 }
      );
    }

    const productMap = new Map(
      (products || []).map((product) => [
        String(product.id),
        product,
      ])
    );

    const enrichedSales = (
      (sales || []) as FlashSaleRow[]
    ).map((sale) => {
      const product =
        productMap.get(String(sale.product_id)) || null;

      return {
        ...sale,
        product_name:
          product?.name || sale.product_id,
        product_size:
          product?.size || null,
        product_slug:
          product?.slug || null,
        regular_price: Number(
          product?.price || 0
        ),
      };
    });

    return NextResponse.json({
      success: true,
      sales: enrichedSales,
      products: products || [],
    });
  } catch (error) {
    console.error(
      "Unexpected flash sale GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unexpected error while loading flash sales.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const productId = String(
      body?.product_id || ""
    ).trim();

    const salePrice = Number(body?.sale_price);
    const startsAt = String(
      body?.starts_at || ""
    ).trim();
    const endsAt = String(
      body?.ends_at || ""
    ).trim();

    if (
      !productId ||
      !Number.isFinite(salePrice) ||
      salePrice <= 0 ||
      !validDate(startsAt) ||
      !validDate(endsAt)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product, sale price, start time, and end time are required.",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Flash sale end time must be after the start time.",
        },
        { status: 400 }
      );
    }

    const {
      data: product,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, price, active"
      )
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error(
        "Flash sale product validation error:",
        productError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify this product.",
        },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    const regularPrice = Number(
      product.price || 0
    );

    if (
      !Number.isFinite(regularPrice) ||
      regularPrice <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This product does not have a valid regular price.",
        },
        { status: 400 }
      );
    }

    if (salePrice >= regularPrice) {
      return NextResponse.json(
        {
          success: false,
          error: `Flash sale price must be lower than the regular price of $${regularPrice.toFixed(
            2
          )}.`,
        },
        { status: 400 }
      );
    }

    /*
     * Prevent overlapping ACTIVE/SCHEDULED sales
     * for the same product.
     *
     * Overlap condition:
     * existing.starts_at < new.ends_at
     * existing.ends_at   > new.starts_at
     */
    const {
      data: overlappingSales,
      error: overlapError,
    } = await supabaseAdmin
      .from("flash_sales")
      .select(
        "id, starts_at, ends_at, active"
      )
      .eq("product_id", productId)
      .eq("active", true)
      .lt(
        "starts_at",
        endDate.toISOString()
      )
      .gt(
        "ends_at",
        startDate.toISOString()
      );

    if (overlapError) {
      console.error(
        "Flash sale overlap lookup error:",
        overlapError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify existing flash sales.",
        },
        { status: 500 }
      );
    }

    if (
      overlappingSales &&
      overlappingSales.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This product already has an active or scheduled flash sale during that time.",
        },
        { status: 409 }
      );
    }

    const {
      data: createdSale,
      error: insertError,
    } = await supabaseAdmin
      .from("flash_sales")
      .insert({
        product_id: productId,
        sale_price: Number(
          salePrice.toFixed(2)
        ),
        starts_at:
          startDate.toISOString(),
        ends_at:
          endDate.toISOString(),
        active: true,
      })
      .select(
        "id, product_id, sale_price, starts_at, ends_at, active, created_at"
      )
      .single();

    if (insertError) {
      console.error(
        "Flash sale insert error:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            insertError.message ||
            "Unable to create flash sale.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sale: createdSale,
    });
  } catch (error) {
    console.error(
      "Unexpected flash sale POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unexpected error while creating flash sale.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const saleId = String(
      body?.id || ""
    ).trim();

    if (!saleId) {
      return NextResponse.json(
        {
          success: false,
          error: "Flash sale ID is required.",
        },
        { status: 400 }
      );
    }

    const updates: Record<
      string,
      boolean | string | number
    > = {};

    if (
      typeof body?.active === "boolean"
    ) {
      updates.active = body.active;
    }

    if (
      body?.sale_price !== undefined
    ) {
      const salePrice = Number(
        body.sale_price
      );

      if (
        !Number.isFinite(salePrice) ||
        salePrice <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Sale price must be greater than zero.",
          },
          { status: 400 }
        );
      }

      updates.sale_price = Number(
        salePrice.toFixed(2)
      );
    }

    if (body?.starts_at !== undefined) {
      if (!validDate(body.starts_at)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid flash sale start time.",
          },
          { status: 400 }
        );
      }

      updates.starts_at = new Date(
        body.starts_at
      ).toISOString();
    }

    if (body?.ends_at !== undefined) {
      if (!validDate(body.ends_at)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid flash sale end time.",
          },
          { status: 400 }
        );
      }

      updates.ends_at = new Date(
        body.ends_at
      ).toISOString();
    }

    if (
      Object.keys(updates).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No flash sale changes were provided.",
        },
        { status: 400 }
      );
    }

    const {
      data: existingSale,
      error: existingSaleError,
    } = await supabaseAdmin
      .from("flash_sales")
      .select(
        "id, product_id, sale_price, starts_at, ends_at, active"
      )
      .eq("id", saleId)
      .maybeSingle();

    if (existingSaleError) {
      console.error(
        "Flash sale PATCH lookup error:",
        existingSaleError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify this flash sale.",
        },
        { status: 500 }
      );
    }

    if (!existingSale) {
      return NextResponse.json(
        {
          success: false,
          error: "Flash sale not found.",
        },
        { status: 404 }
      );
    }

    const finalStartsAt = new Date(
      String(
        updates.starts_at ||
          existingSale.starts_at
      )
    );

    const finalEndsAt = new Date(
      String(
        updates.ends_at ||
          existingSale.ends_at
      )
    );

    if (finalEndsAt <= finalStartsAt) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Flash sale end time must be after the start time.",
        },
        { status: 400 }
      );
    }

    const finalSalePrice = Number(
      updates.sale_price ??
        existingSale.sale_price
    );

    const {
      data: product,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .eq(
        "id",
        existingSale.product_id
      )
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify the product price.",
        },
        { status: 500 }
      );
    }

    const regularPrice = Number(
      product.price || 0
    );

    if (
      finalSalePrice >= regularPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Flash sale price must be lower than the regular price of $${regularPrice.toFixed(
            2
          )}.`,
        },
        { status: 400 }
      );
    }

    const {
      data: updatedSale,
      error: updateError,
    } = await supabaseAdmin
      .from("flash_sales")
      .update(updates)
      .eq("id", saleId)
      .select(
        "id, product_id, sale_price, starts_at, ends_at, active, created_at"
      )
      .single();

    if (updateError) {
      console.error(
        "Flash sale PATCH update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            updateError.message ||
            "Unable to update flash sale.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sale: updatedSale,
    });
  } catch (error) {
    console.error(
      "Unexpected flash sale PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unexpected error while updating flash sale.",
      },
      { status: 500 }
    );
  }
}
