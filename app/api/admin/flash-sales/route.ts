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
  created_at?: string | null;
};

function isValidDate(value: unknown) {
  const date = new Date(String(value || ""));
  return Number.isFinite(date.getTime());
}

/* =========================================================
   GET
   Load products + all flash sales for Admin Promos page
========================================================= */

export async function GET() {
  try {
    /* -------------------------
       LOAD FLASH SALES
    ------------------------- */

    const {
      data: flashSaleRows,
      error: flashSalesError,
    } = await supabaseAdmin
      .from("flash_sales")
      .select("*")
      .order("starts_at", {
        ascending: false,
      });

    if (flashSalesError) {
      console.error(
        "Flash sale GET error:",
        flashSalesError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load flash sales.",
          details:
            flashSalesError.message,
        },
        {
          status: 500,
        }
      );
    }

    /* -------------------------
       LOAD PRODUCTS

       Using select("*") so this route
       doesn't depend on optional
       columns existing in your table.
    ------------------------- */

    const {
      data: productRows,
      error: productsError,
    } = await supabaseAdmin
      .from("products")
      .select("*");

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
          details:
            productsError.message,
        },
        {
          status: 500,
        }
      );
    }

    /* -------------------------
       NORMALIZE PRODUCTS
    ------------------------- */

    const products = [
      ...(productRows || []),
    ].sort((a, b) =>
      String(a?.name || "").localeCompare(
        String(b?.name || "")
      )
    );

    const productMap = new Map(
      products.map((product) => [
        String(product.id),
        product,
      ])
    );

    /* -------------------------
       ADD PRODUCT INFO TO SALES
    ------------------------- */

    const sales = (
      (flashSaleRows || []) as FlashSaleRow[]
    ).map((sale) => {
      const product =
        productMap.get(
          String(sale.product_id)
        ) || null;

      return {
        ...sale,

        product_name:
          product?.name ||
          String(sale.product_id),

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
      sales,
      products,
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
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   Create a new Flash Sale
========================================================= */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const productId = String(
      body?.product_id || ""
    ).trim();

    const salePrice = Number(
      body?.sale_price
    );

    const startsAt = String(
      body?.starts_at || ""
    ).trim();

    const endsAt = String(
      body?.ends_at || ""
    ).trim();

    /* -------------------------
       BASIC VALIDATION
    ------------------------- */

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a product.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(salePrice) ||
      salePrice <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid sale price.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isValidDate(startsAt) ||
      !isValidDate(endsAt)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter valid start and end times.",
        },
        {
          status: 400,
        }
      );
    }

    const startDate =
      new Date(startsAt);

    const endDate =
      new Date(endsAt);

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Flash sale end time must be after the start time.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------
       VERIFY PRODUCT
    ------------------------- */

    const {
      data: product,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select("*")
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
          details:
            productError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------
       VERIFY REGULAR PRICE
    ------------------------- */

    const regularPrice = Number(
      product.price || 0
    );

    if (
      !Number.isFinite(
        regularPrice
      ) ||
      regularPrice <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This product does not have a valid regular price.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      salePrice >= regularPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Flash sale price must be lower than the regular price of $${regularPrice.toFixed(
              2
            )}.`,
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------
       CHECK FOR OVERLAPPING SALE

       Existing sale overlaps if:
       existing start < new end
       AND
       existing end > new start
    ------------------------- */

    const {
      data: overlappingSales,
      error: overlapError,
    } = await supabaseAdmin
      .from("flash_sales")
      .select("*")
      .eq(
        "product_id",
        productId
      )
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
        "Flash sale overlap error:",
        overlapError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check existing flash sales.",
          details:
            overlapError.message,
        },
        {
          status: 500,
        }
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
        {
          status: 409,
        }
      );
    }

    /* -------------------------
       CREATE SALE
    ------------------------- */

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
      .select("*")
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
            "Unable to create flash sale.",
          details:
            insertError.message,
        },
        {
          status: 500,
        }
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
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH
   End / update an existing Flash Sale
========================================================= */

export async function PATCH(
  request: Request
) {
  try {
    const body =
      await request.json();

    const saleId = String(
      body?.id || ""
    ).trim();

    if (!saleId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Flash sale ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------
       FIND EXISTING SALE
    ------------------------- */

    const {
      data: existingSale,
      error: lookupError,
    } = await supabaseAdmin
      .from("flash_sales")
      .select("*")
      .eq("id", saleId)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "Flash sale lookup error:",
        lookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to find this flash sale.",
          details:
            lookupError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!existingSale) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Flash sale not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------
       BUILD UPDATE OBJECT
    ------------------------- */

    const updates: Record<
      string,
      boolean | string | number
    > = {};

    if (
      typeof body?.active ===
      "boolean"
    ) {
      updates.active =
        body.active;
    }

    if (
      body?.sale_price !==
      undefined
    ) {
      const newSalePrice =
        Number(
          body.sale_price
        );

      if (
        !Number.isFinite(
          newSalePrice
        ) ||
        newSalePrice <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Sale price must be greater than zero.",
          },
          {
            status: 400,
          }
        );
      }

      updates.sale_price =
        Number(
          newSalePrice.toFixed(
            2
          )
        );
    }

    if (
      body?.starts_at !==
      undefined
    ) {
      if (
        !isValidDate(
          body.starts_at
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid flash sale start time.",
          },
          {
            status: 400,
          }
        );
      }

      updates.starts_at =
        new Date(
          body.starts_at
        ).toISOString();
    }

    if (
      body?.ends_at !==
      undefined
    ) {
      if (
        !isValidDate(
          body.ends_at
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid flash sale end time.",
          },
          {
            status: 400,
          }
        );
      }

      updates.ends_at =
        new Date(
          body.ends_at
        ).toISOString();
    }

    if (
      Object.keys(updates)
        .length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No flash sale changes were provided.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------
       VALIDATE FINAL DATES
    ------------------------- */

    const finalStartsAt =
      new Date(
        String(
          updates.starts_at ??
            existingSale.starts_at
        )
      );

    const finalEndsAt =
      new Date(
        String(
          updates.ends_at ??
            existingSale.ends_at
        )
      );

    if (
      finalEndsAt <=
      finalStartsAt
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Flash sale end time must be after the start time.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------
       VERIFY PRODUCT PRICE
    ------------------------- */

    const {
      data: product,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq(
        "id",
        existingSale.product_id
      )
      .maybeSingle();

    if (productError) {
      console.error(
        "Flash sale PATCH product error:",
        productError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify the product.",
          details:
            productError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product associated with this flash sale no longer exists.",
        },
        {
          status: 404,
        }
      );
    }

    const regularPrice = Number(
      product.price || 0
    );

    const finalSalePrice =
      Number(
        updates.sale_price ??
          existingSale.sale_price
      );

    if (
      finalSalePrice >=
      regularPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Flash sale price must be lower than the regular price of $${regularPrice.toFixed(
              2
            )}.`,
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------
       UPDATE SALE
    ------------------------- */

    const {
      data: updatedSale,
      error: updateError,
    } = await supabaseAdmin
      .from("flash_sales")
      .update(updates)
      .eq("id", saleId)
      .select("*")
      .single();

    if (updateError) {
      console.error(
        "Flash sale update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to update flash sale.",
          details:
            updateError.message,
        },
        {
          status: 500,
        }
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
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}