import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

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

/*
 * Regular Apexx promo codes.
 *
 * Affiliate codes are NOT stored here.
 * Affiliate codes are pulled securely
 * from the Supabase affiliates table.
 */
const REGULAR_PROMO_CODES: Record<
  string,
  number
> = {
  WELCOME10: 0.1,
  FREEDOM10: 0.1,
  PEPTIDEALS: 0.15,
};

type CartItem = {
  id?: string;
  name?: string;
  price?: number;
  basePrice?: number;
  quantity?: number;
  image?: string;
  path?: string;
  bundleId?: string | null;
  bundleType?: string | null;
  bundleDiscountPercent?: number;
  bundleTierQuantity?: number | null;
  bundleBaseUnitPrice?: number;
  bundleDiscountedUnitPrice?: number;
  quantityDiscountPercent?: number;
  quantityDiscountTierId?: string | null;
  quantityDiscountTierQuantity?: number | null;
  flashSaleApplied?: boolean;
  flashSaleId?: string | null;
  flashSalePrice?: number | null;
};

type DatabaseProduct = {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  inventory: number;
  active?: boolean | null;
  category?: string | null;
  size?: string | null;
};

type QuantityDiscountTier = {
  id: string;
  quantity: number;
  discount_percent: number;
  active: boolean;
  sort_order: number;
};

type FlashSale = {
  id: string;
  product_id: string;
  sale_price: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

const BUNDLE_TIERS = [
  { quantity: 3, discount: 5 },
  { quantity: 5, discount: 10 },
  { quantity: 10, discount: 15 },
  { quantity: 20, discount: 20 },
];

const ELIGIBLE_BUNDLE_KEYWORDS = [
  "apx-3",
  "apx3",
  "apx-2",
  "apx2",
  "bpc-157",
  "bpc157",
  "tb-500",
  "tb500",
  "ghk-cu",
  "ghkcu",
  "cjc",
  "ipamorelin",
  "cjcipa",
  "cjc-ipa",
  "mots-c",
  "motsc",
  "pe-22-28",
  "pe2228",
  "pinealon",
  "selank",
  "semax",
  "adamax",
  "ara-290",
  "ara290",
  "nad+",
  "nad",
  "aod-9604",
  "aod9604",
  "pt-141",
  "pt141",
  "5-amino-1mq",
  "5amino1mq",
  "kisspeptin",
  "kisspeptin-10",
  "kisspeptin10",
  "tesamorelin",
  "glutathione",
  "wolverine",
  "klow",
  "ss-31",
  "ss31",
  "mito-x",
  "mitox",
  "neuro-x",
  "neurox",
  "kpv",
];

const isPhysicalProduct = (product: DatabaseProduct) => {
  const name = String(product.name || "").toLowerCase();
  const slug = String(product.slug || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();

  return (
    name.includes("shirt") ||
    name.includes("t-shirt") ||
    name.includes("tee") ||
    name.includes("vial case") ||
    name.includes("storage case") ||
    slug.includes("shirt") ||
    slug.includes("vial-storage-case") ||
    category.includes("accessor") ||
    category.includes("apparel") ||
    category.includes("shirt")
  );
};

const isBundleEligibleProduct = (product: DatabaseProduct) => {
  if (isPhysicalProduct(product)) return false;

  const id = String(product.id || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();
  const slug = String(product.slug || "").toLowerCase();

  return ELIGIBLE_BUNDLE_KEYWORDS.some(
    (keyword) =>
      id.includes(keyword) ||
      name.includes(keyword) ||
      slug.includes(keyword)
  );
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerEmail,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      paymentMethod,
      cart,
      promoCode,
      redeemedPoints,
      marketingConsent,
    } = body;

    /*
     * Validate checkout information.
     */
    if (
      !customerEmail ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !paymentMethod ||
      !Array.isArray(cart) ||
      cart.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required checkout information.",
        },
        { status: 400 }
      );
    }

    const normalizedCustomerEmail =
      String(customerEmail)
        .trim()
        .toLowerCase();

    const normalizedFirstName =
      String(firstName).trim();

    const normalizedLastName =
      String(lastName).trim();

    const normalizedAddress =
      String(address).trim();

    const normalizedCity =
      String(city).trim();

    const normalizedState =
      String(state)
        .trim()
        .toUpperCase();

    const normalizedZipCode =
      String(zipCode).trim();

    const normalizedPaymentMethod =
      String(paymentMethod)
        .trim()
        .toLowerCase();

    /*
     * Marketing consent comes from the checkout checkbox.
     * Only an explicit boolean true counts as consent.
     */
    const normalizedMarketingConsent =
      marketingConsent === true;

    if (
      !/^\d{5}$/.test(
        normalizedZipCode
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ZIP code must contain exactly 5 digits.",
        },
        { status: 400 }
      );
    }

    if (
      normalizedPaymentMethod !==
        "venmo" &&
      normalizedPaymentMethod !==
        "zelle"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate requested rewards.
     */
    const requestedRedeemedPoints =
      Number(redeemedPoints || 0);

    if (
      !Number.isInteger(
        requestedRedeemedPoints
      ) ||
      requestedRedeemedPoints < 0 ||
      requestedRedeemedPoints % 100 !==
        0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rewards must be redeemed in increments of 100 points.",
        },
        { status: 400 }
      );
    }

    /*
     * Validate the raw cart structure first.
     *
     * IMPORTANT:
     * Browser-supplied prices and discount metadata are NOT trusted.
     * The server rebuilds all merchandise pricing from Supabase.
     */
    const rawCart: CartItem[] = cart.map(
      (item: CartItem) => ({
        id: String(item.id || "").trim(),
        name: String(item.name || "Product").trim(),
        quantity: Number(item.quantity || 0),
        image: item.image,
        path: item.path,
        bundleId: item.bundleId
          ? String(item.bundleId).trim()
          : null,
        bundleType: item.bundleType
          ? String(item.bundleType).trim()
          : null,
      })
    );

    const invalidCartItem = rawCart.some(
      (item) =>
        !item.id ||
        !item.name ||
        !Number.isInteger(item.quantity) ||
        Number(item.quantity) <= 0
    );

    if (invalidCartItem) {
      return NextResponse.json(
        {
          success: false,
          error:
            "One or more cart items are invalid.",
        },
        { status: 400 }
      );
    }

    /*
     * Load canonical products from Supabase.
     *
     * We load the full active catalog because some cart item IDs
     * are human-readable product identifiers while others may
     * match a product slug. Matching both keeps existing product
     * pages compatible without trusting any browser price.
     */
    const {
      data: databaseProductRows,
      error: productsLookupError,
    } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, slug, price, inventory, active, category, size"
      );

    if (productsLookupError) {
      console.error(
        "Product pricing lookup error:",
        productsLookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify product pricing.",
        },
        { status: 500 }
      );
    }

    const databaseProducts =
      (databaseProductRows || []) as DatabaseProduct[];

    /*
     * Load active same-product quantity discount tiers.
     *
     * These are the tiers controlled by Admin > Products.
     * Build-a-Bundle has separate bundle-wide tiers below.
     */
    const {
      data: quantityTierRows,
      error: quantityTierError,
    } = await supabaseAdmin
      .from("quantity_discount_tiers")
      .select(
        "id, quantity, discount_percent, active, sort_order"
      )
      .eq("active", true)
      .order("quantity", { ascending: true });

    if (quantityTierError) {
      console.error(
        "Quantity discount lookup error:",
        quantityTierError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify quantity discounts.",
        },
        { status: 500 }
      );
    }

    const quantityTiers =
      (quantityTierRows || []) as QuantityDiscountTier[];

    /*
     * Load flash sales that are ACTIVE RIGHT NOW.
     *
     * IMPORTANT:
     * The service-role client bypasses RLS, so the checkout route
     * explicitly verifies active=true and the current time window.
     * Browser-supplied sale prices are never trusted.
     */
    const checkoutNowIso = new Date().toISOString();

    const {
      data: flashSaleRows,
      error: flashSaleLookupError,
    } = await supabaseAdmin
      .from("flash_sales")
      .select(
        "id, product_id, sale_price, starts_at, ends_at, active"
      )
      .eq("active", true)
      .lte("starts_at", checkoutNowIso)
      .gt("ends_at", checkoutNowIso)
      .order("starts_at", { ascending: false });

    if (flashSaleLookupError) {
      console.error(
        "Flash sale lookup error:",
        flashSaleLookupError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify current sale pricing.",
        },
        { status: 500 }
      );
    }

    const flashSales =
      (flashSaleRows || []) as FlashSale[];

    /*
     * If overlapping flash sales somehow exist for the same product,
     * use the most recently-started active sale. The Admin API should
     * prevent overlaps, but checkout still protects itself.
     */
    const activeFlashSaleByProduct =
      new Map<string, FlashSale>();

    for (const sale of flashSales) {
      const productId = String(
        sale.product_id || ""
      ).trim();

      if (
        productId &&
        !activeFlashSaleByProduct.has(productId)
      ) {
        activeFlashSaleByProduct.set(
          productId,
          sale
        );
      }
    }

    const findDatabaseProduct = (cartItem: CartItem) => {
      const requestedId = String(
        cartItem.id || ""
      )
        .trim()
        .toLowerCase();

      return (
        databaseProducts.find((product) => {
          const productId = String(
            product.id || ""
          )
            .trim()
            .toLowerCase();

          const productSlug = String(
            product.slug || ""
          )
            .trim()
            .toLowerCase();

          return (
            productId === requestedId ||
            productSlug === requestedId
          );
        }) || null
      );
    };

    /*
     * Resolve every raw cart item to a trusted Supabase product.
     */
    const resolvedCart = rawCart.map((item) => ({
      raw: item,
      product: findDatabaseProduct(item),
    }));

    const unresolvedItem = resolvedCart.find(
      (entry) => !entry.product
    );

    if (unresolvedItem) {
      return NextResponse.json(
        {
          success: false,
          error: `${unresolvedItem.raw.name} could not be verified. Please remove it from your cart and add it again.`,
        },
        { status: 400 }
      );
    }

    /*
     * Validate aggregate inventory across the ENTIRE cart.
     *
     * This prevents a customer from splitting the same product
     * across a normal cart line and one or more bundles to exceed
     * the available inventory.
     */
    const requestedInventoryByProduct =
      new Map<string, number>();

    for (const entry of resolvedCart) {
      const product = entry.product!;
      const key = String(product.id);
      const previous =
        requestedInventoryByProduct.get(key) || 0;

      requestedInventoryByProduct.set(
        key,
        previous + Number(entry.raw.quantity || 0)
      );
    }

    for (const [productId, requestedQuantity] of
      requestedInventoryByProduct.entries()) {
      const product = databaseProducts.find(
        (row) => String(row.id) === productId
      );

      if (!product) continue;

      if (product.active === false) {
        return NextResponse.json(
          {
            success: false,
            error: `${product.name} is currently unavailable.`,
          },
          { status: 400 }
        );
      }

      const availableInventory = Number(
        product.inventory || 0
      );

      if (requestedQuantity > availableInventory) {
        return NextResponse.json(
          {
            success: false,
            error: `Only ${availableInventory} unit${
              availableInventory === 1 ? "" : "s"
            } of ${product.name} are currently available.`,
          },
          { status: 400 }
        );
      }
    }

    /*
     * Validate Build-a-Bundle groups.
     *
     * Bundle discount is based on TOTAL vials in the same bundle,
     * not the quantity of one individual product.
     */
    const bundleGroups = new Map<
      string,
      typeof resolvedCart
    >();

    for (const entry of resolvedCart) {
      if (
        entry.raw.bundleType !== "build-your-own"
      ) {
        continue;
      }

      const bundleId = String(
        entry.raw.bundleId || ""
      ).trim();

      if (!bundleId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "A bundle in your cart is missing its bundle ID. Please rebuild the bundle.",
          },
          { status: 400 }
        );
      }

      const current =
        bundleGroups.get(bundleId) || [];

      current.push(entry);
      bundleGroups.set(bundleId, current);
    }

    const verifiedBundleData = new Map<
      string,
      {
        totalVials: number;
        tierQuantity: number;
        discountPercent: number;
      }
    >();

    for (const [bundleId, entries] of
      bundleGroups.entries()) {
      const totalVials = entries.reduce(
        (sum, entry) =>
          sum + Number(entry.raw.quantity || 0),
        0
      );

      if (totalVials < 3) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Build Your Own Bundle requires at least 3 eligible vials.",
          },
          { status: 400 }
        );
      }

      const invalidBundleProduct = entries.find(
        (entry) =>
          !isBundleEligibleProduct(
            entry.product!
          )
      );

      if (invalidBundleProduct) {
        return NextResponse.json(
          {
            success: false,
            error: `${invalidBundleProduct.product!.name} is not eligible for Build Your Own Bundle pricing.`,
          },
          { status: 400 }
        );
      }

      const verifiedTier =
        [...BUNDLE_TIERS]
          .filter(
            (tier) =>
              totalVials >= tier.quantity
          )
          .sort(
            (a, b) =>
              b.quantity - a.quantity
          )[0] || null;

      if (!verifiedTier) {
        return NextResponse.json(
          {
            success: false,
            error:
              "The bundle discount could not be verified.",
          },
          { status: 400 }
        );
      }

      verifiedBundleData.set(bundleId, {
        totalVials,
        tierQuantity: verifiedTier.quantity,
        discountPercent: verifiedTier.discount,
      });
    }

    /*
     * Rebuild the cart with trusted prices.
     *
     * Pricing priority:
     * - Build-a-Bundle items use the verified bundle-wide tier.
     *   Flash sale pricing does NOT stack with bundle pricing.
     * - Normal items use a verified active flash-sale price when one
     *   exists. Quantity discounts do NOT stack on top of flash sales.
     * - Otherwise, normal research products use Admin quantity tiers.
     * - Shirts/accessories do NOT receive vial quantity pricing.
     *
     * Promo/affiliate discounts and rewards are applied later to the
     * already server-verified merchandise subtotal.
     */
    const normalizedCart: CartItem[] =
      resolvedCart.map((entry) => {
        const product = entry.product!;
        const quantity = Number(
          entry.raw.quantity || 0
        );

        const basePrice = Number(
          product.price || 0
        );

        if (
          !Number.isFinite(basePrice) ||
          basePrice < 0
        ) {
          throw new Error(
            `Invalid database price for product ${product.id}`
          );
        }

        const isBundleItem =
          entry.raw.bundleType ===
          "build-your-own";

        if (isBundleItem) {
          const bundleId = String(
            entry.raw.bundleId || ""
          );

          const bundleData =
            verifiedBundleData.get(bundleId);

          if (!bundleData) {
            throw new Error(
              `Verified bundle data missing for ${bundleId}`
            );
          }

          const discountedUnitPrice = Number(
            (
              basePrice *
              (1 -
                bundleData.discountPercent /
                  100)
            ).toFixed(2)
          );

          return {
            id: String(product.id),
            name: String(product.name),
            price: discountedUnitPrice,
            basePrice,
            quantity,
            image: entry.raw.image,
            path:
              entry.raw.path ||
              (product.slug
                ? `/products/${product.slug}`
                : "/products"),
            bundleId,
            bundleType: "build-your-own",
            bundleDiscountPercent:
              bundleData.discountPercent,
            bundleTierQuantity:
              bundleData.tierQuantity,
            bundleBaseUnitPrice: basePrice,
            bundleDiscountedUnitPrice:
              discountedUnitPrice,
            quantityDiscountPercent: 0,
            quantityDiscountTierId: null,
            quantityDiscountTierQuantity:
              null,
            flashSaleApplied: false,
            flashSaleId: null,
            flashSalePrice: null,
          };
        }

        /*
         * Flash-sale pricing is checked only for NON-bundle items.
         *
         * A flash sale replaces the normal unit price for this item.
         * It does not stack with same-product quantity discounts.
         */
        const activeFlashSale =
          activeFlashSaleByProduct.get(
            String(product.id)
          ) || null;

        const rawFlashSalePrice = Number(
          activeFlashSale?.sale_price
        );

        const hasValidFlashSale =
          !!activeFlashSale &&
          Number.isFinite(rawFlashSalePrice) &&
          rawFlashSalePrice > 0 &&
          rawFlashSalePrice < basePrice;

        if (hasValidFlashSale) {
          const flashSaleUnitPrice = Number(
            rawFlashSalePrice.toFixed(2)
          );

          return {
            id: String(product.id),
            name: String(product.name),
            price: flashSaleUnitPrice,
            basePrice,
            quantity,
            image: entry.raw.image,
            path:
              entry.raw.path ||
              (product.slug
                ? `/products/${product.slug}`
                : "/products"),
            bundleId: null,
            bundleType: null,
            bundleDiscountPercent: 0,
            bundleTierQuantity: null,
            bundleBaseUnitPrice: basePrice,
            bundleDiscountedUnitPrice:
              flashSaleUnitPrice,
            quantityDiscountPercent: 0,
            quantityDiscountTierId: null,
            quantityDiscountTierQuantity:
              null,
            flashSaleApplied: true,
            flashSaleId:
              activeFlashSale!.id,
            flashSalePrice:
              flashSaleUnitPrice,
          };
        }

        const physical =
          isPhysicalProduct(product);

        const matchingTier = physical
          ? null
          : [...quantityTiers]
              .filter(
                (tier) =>
                  quantity >=
                  Number(tier.quantity)
              )
              .sort(
                (a, b) =>
                  Number(b.quantity) -
                  Number(a.quantity)
              )[0] || null;

        const discountPercent = Number(
          matchingTier?.discount_percent || 0
        );

        const verifiedUnitPrice = Number(
          (
            basePrice *
            (1 - discountPercent / 100)
          ).toFixed(2)
        );

        return {
          id: String(product.id),
          name: String(product.name),
          price: verifiedUnitPrice,
          basePrice,
          quantity,
          image: entry.raw.image,
          path:
            entry.raw.path ||
            (product.slug
              ? `/products/${product.slug}`
              : "/products"),
          bundleId: null,
          bundleType: null,
          bundleDiscountPercent: 0,
          bundleTierQuantity: null,
          bundleBaseUnitPrice: basePrice,
          bundleDiscountedUnitPrice:
            verifiedUnitPrice,
          quantityDiscountPercent:
            discountPercent,
          quantityDiscountTierId:
            matchingTier?.id || null,
          quantityDiscountTierQuantity:
            matchingTier?.quantity || null,
          flashSaleApplied: false,
          flashSaleId: null,
          flashSalePrice: null,
        };
      });

    const orderNumber =
      `APX-${Date.now()}`;

    /*
     * Calculate subtotal from the SERVER-VERIFIED cart.
     */
    const serverSubtotal = Number(
      normalizedCart
        .reduce(
          (sum, item) =>
            sum +
            Number(item.price || 0) *
              Number(item.quantity || 0),
          0
        )
        .toFixed(2)
    );

    /*
     * Normalize promo code.
     */
    const normalizedPromoCode =
      String(promoCode || "")
        .trim()
        .toUpperCase();

    /*
     * Promo / Affiliate tracking.
     */
    let discountRate = 0;
    let appliedPromoCode = "";

    let affiliateId:
      | string
      | null = null;

    let affiliateName = "";
    let affiliateEmail = "";
    let affiliateCode = "";

    let affiliateCommissionRate = 0;

    /*
     * Check regular Apexx promo
     * codes first.
     */
    const regularPromoRate =
      REGULAR_PROMO_CODES[
        normalizedPromoCode
      ];

    if (regularPromoRate) {
      discountRate =
        regularPromoRate;

      appliedPromoCode =
        normalizedPromoCode;
    }

    /*
     * If this is not a regular
     * Apexx promo code, check
     * whether it belongs to an
     * ACTIVE affiliate.
     */
    if (
      !regularPromoRate &&
      normalizedPromoCode
    ) {
      const {
        data: affiliate,
        error:
          affiliateLookupError,
      } = await supabaseAdmin
        .from("affiliates")
        .select(
          `
            id,
            name,
            email,
            code,
            discount_rate,
            commission_rate,
            status
          `
        )
        .eq(
          "code",
          normalizedPromoCode
        )
        .eq("status", "active")
        .maybeSingle();

      if (
        affiliateLookupError
      ) {
        console.error(
          "Affiliate promo lookup error:",
          affiliateLookupError
        );
      }

      if (affiliate) {
        affiliateId =
          affiliate.id;

        affiliateName =
          String(
            affiliate.name || ""
          ).trim();

        affiliateEmail =
          String(
            affiliate.email || ""
          )
            .trim()
            .toLowerCase();

        affiliateCode =
          String(
            affiliate.code || ""
          )
            .trim()
            .toUpperCase();

        discountRate =
          Number(
            affiliate.discount_rate ||
              0
          );

        affiliateCommissionRate =
          Number(
            affiliate.commission_rate ||
              0
          );

        appliedPromoCode =
          affiliateCode;
      }
    }

    /*
     * Calculate customer promo
     * discount.
     */
    const serverDiscount = Number(
      (
        serverSubtotal *
        discountRate
      ).toFixed(2)
    );

    /*
     * Affiliate commission is
     * calculated on merchandise
     * after the promo discount.
     *
     * Shipping is NOT commissionable.
     *
     * This amount remains PENDING
     * until you verify payment.
     */
    const affiliateCommission =
      affiliateId
        ? Number(
            (
              Math.max(
                0,
                serverSubtotal -
                  serverDiscount
              ) *
              affiliateCommissionRate
            ).toFixed(2)
          )
        : 0;

    /*
     * Calculate shipping.
     */
    const freeShippingThreshold =
      200;

    const standardShipping = 5.99;

    const serverShipping =
      serverSubtotal > 0 &&
      serverSubtotal <
        freeShippingThreshold
        ? standardShipping
        : 0;

    /*
     * Rewards values.
     */
    let authenticatedUserId:
      | string
      | null = null;

    let recordedPointBalance = 0;
    let availablePoints = 0;

    let validatedRedeemedPoints =
      0;

    let rewardDiscount = 0;

    /*
     * Authenticate and validate
     * customer when rewards are used.
     */
    if (
      requestedRedeemedPoints > 0
    ) {
      const authorizationHeader =
        request.headers.get(
          "authorization"
        );

      const accessToken =
        authorizationHeader?.startsWith(
          "Bearer "
        )
          ? authorizationHeader.slice(
              7
            )
          : null;

      if (!accessToken) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You must be signed in to redeem Apexx Rewards.",
          },
          { status: 401 }
        );
      }

      const {
        data: { user },
        error: userError,
      } =
        await supabaseAdmin.auth.getUser(
          accessToken
        );

      if (
        userError ||
        !user?.email
      ) {
        console.error(
          "Reward authentication error:",
          userError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Your account session could not be verified. Please log in again.",
          },
          { status: 401 }
        );
      }

      const authenticatedEmail =
        user.email
          .trim()
          .toLowerCase();

      if (
        authenticatedEmail !==
        normalizedCustomerEmail
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "The checkout email must match your signed-in Apexx account.",
          },
          { status: 403 }
        );
      }

      authenticatedUserId =
        user.id;

      /*
       * Calculate current points.
       */
      const {
        data: pointTransactions,
        error: pointsError,
      } = await supabaseAdmin
        .from("point_transactions")
        .select("points")
        .eq(
          "user_id",
          user.id
        );

      if (pointsError) {
        console.error(
          "Point balance lookup error:",
          pointsError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Your rewards balance could not be verified.",
          },
          { status: 500 }
        );
      }

      recordedPointBalance = (
        pointTransactions || []
      ).reduce(
        (
          sum,
          transaction
        ) =>
          sum +
          Number(
            transaction.points || 0
          ),
        0
      );

      availablePoints =
        Math.max(
          0,
          recordedPointBalance
        );

      if (
        requestedRedeemedPoints >
        availablePoints
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `You currently have ${availablePoints} available reward points.`,
          },
          { status: 400 }
        );
      }

      /*
       * Rewards apply after
       * promotional discount.
       *
       * Rewards cannot cover
       * shipping.
       */
      const merchandiseAfterPromo =
        Math.max(
          0,
          serverSubtotal -
            serverDiscount
        );

      const maximumPointsForOrder =
        Math.floor(
          merchandiseAfterPromo /
            10
        ) * 100;

      if (
        requestedRedeemedPoints >
        maximumPointsForOrder
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `This order can use a maximum of ${maximumPointsForOrder} reward points.`,
          },
          { status: 400 }
        );
      }

      validatedRedeemedPoints =
        requestedRedeemedPoints;

      /*
       * 100 points = $10.
       */
      rewardDiscount = Number(
        (
          validatedRedeemedPoints /
          10
        ).toFixed(2)
      );
    }

    /*
     * Final order total.
     */
    const serverTotal = Number(
      Math.max(
        0,
        serverSubtotal -
          serverDiscount -
          rewardDiscount +
          serverShipping
      ).toFixed(2)
    );

    /*
     * Create order.
     */
    const {
      data: order,
      error: orderInsertError,
    } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          order_number:
            orderNumber,

          customer_email:
            normalizedCustomerEmail,

          first_name:
            normalizedFirstName,

          last_name:
            normalizedLastName,

          address:
            normalizedAddress,

          city:
            normalizedCity,

          state:
            normalizedState,

          zip_code:
            normalizedZipCode,

          payment_method:
            normalizedPaymentMethod,

          cart:
            normalizedCart,

          subtotal:
            serverSubtotal,

          shipping:
            serverShipping,

          discount:
            serverDiscount,

          promo_code:
            appliedPromoCode,

          /*
           * Affiliate attribution.
           */
          affiliate_id:
            affiliateId,

          affiliate_commission:
            affiliateCommission,

          redeemed_points:
            validatedRedeemedPoints,

          reward_discount:
            rewardDiscount,

          total:
            serverTotal,

          status:
            "awaiting_payment",
        },
      ])
      .select()
      .single();

    if (
      orderInsertError ||
      !order
    ) {
      console.error(
        "Supabase order insert error:",
        orderInsertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            orderInsertError?.message ||
            "Failed to create order.",
        },
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * PROMO SUBSCRIBER + WELCOME EMAIL
     * ==========================================
     *
     * Only customers who explicitly checked the
     * checkout marketing checkbox are enrolled.
     *
     * Existing subscriber:
     * - keep the existing row
     * - refresh their name
     * - set marketing_consent to true
     * - DO NOT send another welcome email
     *
     * New subscriber:
     * - insert once with source "checkout"
     * - set marketing_consent to true
     * - send the same Apexx List welcome email
     *   used by /api/promo-signup
     *
     * A promo-list or welcome-email failure does
     * NOT invalidate the customer's order.
     */
    if (normalizedMarketingConsent) {
      const {
        data: existingSubscriber,
        error: subscriberLookupError,
      } = await supabaseAdmin
        .from("promo_subscribers")
        .select("email")
        .eq(
          "email",
          normalizedCustomerEmail
        )
        .maybeSingle();

      if (subscriberLookupError) {
        console.error(
          "Promo subscriber lookup error:",
          subscriberLookupError
        );
      } else if (existingSubscriber) {
        const {
          error: subscriberUpdateError,
        } = await supabaseAdmin
          .from("promo_subscribers")
          .update({
            first_name:
              normalizedFirstName,
            last_name:
              normalizedLastName,
            marketing_consent: true,
          })
          .eq(
            "email",
            normalizedCustomerEmail
          );

        if (subscriberUpdateError) {
          console.error(
            "Promo subscriber update error:",
            subscriberUpdateError
          );
        }
      } else {
        const {
          error: subscriberInsertError,
        } = await supabaseAdmin
          .from("promo_subscribers")
          .insert({
            email:
              normalizedCustomerEmail,
            first_name:
              normalizedFirstName,
            last_name:
              normalizedLastName,
            marketing_consent: true,
            source: "checkout",
          });

        if (subscriberInsertError) {
          console.error(
            "Promo subscriber insert error:",
            subscriberInsertError
          );
        } else {
          const {
            error: promoWelcomeEmailError,
          } = await resend.emails.send({
            from:
              "Apexx Biolabs <orders@apexxbiolabs.com>",
            to:
              normalizedCustomerEmail,
            subject:
              "Welcome to the Apexx List",
            html: `
              <div style="margin:0; padding:0; background:#f4f9ff; font-family:Arial, Helvetica, sans-serif;">
                <div style="max-width:680px; margin:0 auto; padding:28px 14px;">
                  <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:28px; overflow:hidden; box-shadow:0 18px 45px rgba(30,58,138,0.10);">
                    <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff); padding:34px 22px; text-align:center; border-bottom:1px solid #dbeafe;">
                      <p style="margin:0 0 12px; color:#3b82f6; font-size:12px; letter-spacing:4px; text-transform:uppercase;">Welcome To</p>
                      <h1 style="margin:0; color:#06111f; font-size:32px; letter-spacing:2px;">APEXX BIOLABS</h1>
                      <p style="margin:12px 0 0; color:#475569; font-size:14px; line-height:1.6;">You’re officially on the Apexx List.</p>
                    </div>

                    <div style="padding:30px 22px; color:#0f172a;">
                      <h2 style="margin:0 0 14px; color:#06111f; font-size:26px; line-height:1.2;">Thanks for joining us.</h2>
                      <p style="margin:0 0 18px; color:#475569; font-size:15px; line-height:1.7;">We’re glad to have you here. You’ll receive early access to Apexx Biolabs promo codes, restock alerts, product launches, and important research-use updates.</p>

                      <div style="background:#f8fbff; border:1px solid #bfdbfe; border-radius:22px; padding:22px; margin:26px 0; text-align:center;">
                        <p style="margin:0 0 10px; color:#1e3a8a; font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">Your Welcome Code</p>
                        <div style="display:inline-block; max-width:100%; box-sizing:border-box; background:#eef7ff; border:1px solid #bfdbfe; border-radius:18px; padding:14px 18px; margin:0 auto;">
                          <p style="margin:0; color:#2563eb; font-size:26px; font-weight:900; letter-spacing:2px; line-height:1.1; word-break:break-word;">WELCOME10</p>
                        </div>
                        <p style="margin:14px 0 0; color:#64748b; font-size:14px; line-height:1.5;">Save 10% sitewide on your next order.</p>
                      </div>

                      <div style="text-align:center; margin:28px 0;">
                        <a href="https://apexxbiolabs.com/products" style="display:inline-block; background:#06111f; color:#ffffff; padding:15px 28px; border-radius:999px; text-decoration:none; font-weight:900; font-size:14px; letter-spacing:1.5px; text-transform:uppercase;">Shop Products</a>
                      </div>

                      <div style="background:#eef7ff; border:1px solid #dbeafe; border-radius:20px; padding:20px; margin-top:28px;">
                        <h3 style="margin:0 0 10px; color:#06111f; font-size:17px;">What you can expect:</h3>
                        <p style="margin:0; color:#475569; font-size:14px; line-height:1.8;">• Exclusive promo codes<br/>• Restock and product launch alerts<br/>• COA and batch documentation updates<br/>• Research-use-only product updates</p>
                      </div>

                      <p style="margin:24px 0 0; color:#64748b; font-size:13px; line-height:1.6;">Thank you for supporting Apexx Biolabs. We’re committed to quality, transparency, and a clean research-use customer experience.</p>

                      <div style="border-top:1px solid #dbeafe; padding-top:22px; margin-top:28px;">
                        <p style="font-size:11px; color:#64748b; line-height:1.6; margin:0;">Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only. Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.</p>
                        <p style="margin:20px 0 0; color:#334155; font-size:13px; line-height:1.6;">Apexx Biolabs<br/>orders@apexxbiolabs.com<br/>apexxbiolabs.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `,
          });

          if (promoWelcomeEmailError) {
            console.error(
              "Promo welcome email error:",
              promoWelcomeEmailError
            );
          }
        }
      }
    }

    /*
     * Immediately deduct
     * redeemed points.
     */
    if (
      validatedRedeemedPoints >
        0 &&
      authenticatedUserId
    ) {
      const {
        data:
          latestTransactions,
        error:
          latestBalanceError,
      } = await supabaseAdmin
        .from(
          "point_transactions"
        )
        .select("points")
        .eq(
          "user_id",
          authenticatedUserId
        );

      if (
        latestBalanceError
      ) {
        console.error(
          "Final rewards balance lookup error:",
          latestBalanceError
        );

        await supabaseAdmin
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            success: false,
            error:
              "Your rewards balance could not be confirmed. Please try again.",
          },
          { status: 500 }
        );
      }

      const latestPointBalance = (
        latestTransactions || []
      ).reduce(
        (
          sum,
          transaction
        ) =>
          sum +
          Number(
            transaction.points || 0
          ),
        0
      );

      if (
        validatedRedeemedPoints >
        Math.max(
          0,
          latestPointBalance
        )
      ) {
        await supabaseAdmin
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            success: false,
            error:
              "Your available rewards balance changed. Please refresh checkout and try again.",
          },
          { status: 400 }
        );
      }

      const {
        error:
          redemptionInsertError,
      } = await supabaseAdmin
        .from(
          "point_transactions"
        )
        .insert({
          user_id:
            authenticatedUserId,

          order_id: order.id,

          points:
            -validatedRedeemedPoints,

          type: "redeemed",

          description:
            `Rewards redeemed on order ${order.order_number}`,
        });

      if (
        redemptionInsertError
      ) {
        console.error(
          "Immediate reward redemption error:",
          redemptionInsertError
        );

        await supabaseAdmin
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            success: false,
            error:
              "Your reward points could not be redeemed. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    /*
     * Calculate updated rewards
     * balance.
     */
    let updatedPointsBalance:
      | number
      | null = null;

    if (
      authenticatedUserId
    ) {
      const {
        data:
          updatedTransactions,
        error:
          updatedBalanceError,
      } = await supabaseAdmin
        .from(
          "point_transactions"
        )
        .select("points")
        .eq(
          "user_id",
          authenticatedUserId
        );

      if (
        updatedBalanceError
      ) {
        console.error(
          "Updated reward balance error:",
          updatedBalanceError
        );
      } else {
        updatedPointsBalance =
          Math.max(
            0,
            (
              updatedTransactions ||
              []
            ).reduce(
              (
                sum,
                transaction
              ) =>
                sum +
                Number(
                  transaction.points ||
                    0
                ),
              0
            )
          );
      }
    }

    /*
     * Build order item HTML
     * for customer/admin only.
     *
     * We DO NOT include this
     * in the affiliate email.
     */
    const itemsHtml =
      normalizedCart
        .map(
          (item: CartItem) =>
            `<li style="margin-bottom:8px;">
              ${item.name} x ${item.quantity}
              — $${(
                Number(
                  item.price || 0
                ) *
                Number(
                  item.quantity || 0
                )
              ).toFixed(2)}
            </li>`
        )
        .join("");

    /*
     * CUSTOMER promo information.
     *
     * This ONLY tells them:
     * - promo code
     * - amount saved
     *
     * No affiliate commission
     * information is shown.
     */
    const promoHtml =
      appliedPromoCode
        ? `
          <p style="margin:0;">
            <strong>Promo Code:</strong>
            ${appliedPromoCode}
          </p>

          <p style="margin:0;">
            <strong>Promo Discount:</strong>
            -$${serverDiscount.toFixed(
              2
            )}
          </p>
        `
        : "";

    const rewardHtml =
      validatedRedeemedPoints >
      0
        ? `
          <p style="margin:0; color:#16a34a;">
            <strong>Apexx Rewards:</strong>
            ${validatedRedeemedPoints} points
          </p>

          <p style="margin:0; color:#16a34a;">
            <strong>Reward Discount:</strong>
            -$${rewardDiscount.toFixed(
              2
            )}
          </p>

          ${
            updatedPointsBalance !==
            null
              ? `
                <p style="margin:0; color:#2563eb;">
                  <strong>Remaining Balance:</strong>
                  ${updatedPointsBalance} points
                </p>
              `
              : ""
          }
        `
        : "";

    /*
     * CUSTOMER CONFIRMATION EMAIL.
     *
     * Affiliate commission is
     * intentionally NOT shown.
     */
    const {
      error:
        customerEmailError,
    } = await resend.emails.send({
      from:
        "Apexx Biolabs <orders@apexxbiolabs.com>",

      to:
        normalizedCustomerEmail,

      subject:
        "Apexx Biolabs Order Confirmation • Payment Awaiting",

      html: `
        <div style="margin:0; padding:0; background:#f8fbff; font-family:Arial, Helvetica, sans-serif;">
          <div style="max-width:720px; margin:0 auto; padding:28px 16px;">
            <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:28px; overflow:hidden; box-shadow:0 18px 45px rgba(30,58,138,0.12);">

              <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff); padding:38px 24px; text-align:center; border-bottom:1px solid #dbeafe;">

                <p style="margin:0 0 14px; color:#3b82f6; font-size:13px; letter-spacing:4px; text-transform:uppercase;">
                  Research. Quality. Confidence.
                </p>

                <h1 style="margin:0; color:#06111f; font-size:34px; letter-spacing:3px;">
                  APEXX BIOLABS
                </h1>

                <p style="margin:12px 0 0; color:#475569; font-size:13px; letter-spacing:2px; text-transform:uppercase;">
                  Premium Research Materials
                </p>

              </div>

              <div style="padding:32px 24px; color:#0f172a;">

                <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:22px; padding:32px 24px; text-align:center; margin-bottom:30px; box-shadow:0 12px 30px rgba(59,130,246,0.10);">

                  <p style="margin:0 0 14px; color:#3b82f6; font-size:13px; letter-spacing:4px; text-transform:uppercase;">
                    Order Received
                  </p>

                  <h2 style="margin:0; color:#06111f; font-size:34px; font-weight:800; line-height:1.1;">
                    Order Confirmation
                  </h2>

                  <p style="margin:14px 0 0; color:#2563eb; font-size:18px; font-weight:700;">
                    Payment Awaiting Verification
                  </p>

                  <p style="margin:18px auto 0; max-width:500px; color:#475569; font-size:15px; line-height:1.7;">
                    Thank you for choosing Apexx Biolabs.
                    Your order has been successfully received
                    and is awaiting payment verification before
                    processing and fulfillment.
                  </p>

                </div>

                <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff); border:1px solid #bfdbfe; border-radius:22px; padding:28px; text-align:center; margin-bottom:30px;">

                  <p style="margin:0 0 8px; color:#1e3a8a; font-size:13px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">
                    Total Due
                  </p>

                  <p style="margin:0; color:#0f172a !important; font-size:50px; font-weight:900;">
                    $${serverTotal.toFixed(
                      2
                    )}
                  </p>

                </div>

                <div style="background:#f8fbff; border:1px solid #bfdbfe; border-radius:22px; padding:24px; margin-bottom:30px;">

                  <h3 style="margin:0 0 18px; color:#06111f; font-size:22px;">
                    Complete Payment Verification
                  </h3>

                  ${
                    normalizedPaymentMethod ===
                    "venmo"
                      ? `
                        <div style="text-align:center;">

                          <p style="color:#475569; line-height:1.6; margin:0 0 16px;">
                            Tap below to complete your Venmo payment.
                          </p>

                          <a
                            href="https://venmo.com/u/apexx-biolabs"
                            style="display:inline-block; background:#06111f; color:#ffffff; padding:16px 30px; border-radius:999px; text-decoration:none; font-weight:900; font-size:15px; letter-spacing:1px; text-transform:uppercase; margin:12px 0;"
                          >
                            Pay With Venmo
                          </a>

                          <p style="margin:16px 0 0; color:#2563eb; font-size:15px;">
                            Venmo:
                            <strong>@apexx-biolabs</strong>
                          </p>

                        </div>
                      `
                      : ""
                  }

                  ${
                    normalizedPaymentMethod ===
                    "zelle"
                      ? `
                        <div style="text-align:center;">

                          <p style="color:#475569; line-height:1.6; margin:0 0 18px;">
                            Paying from a phone? Use the Zelle username below.
                            If you are viewing this email on another device,
                            you can also scan the QR code.
                          </p>

                          <div style="background:linear-gradient(135deg,#eaf4ff,#ffffff); border:1px solid #bfdbfe; border-radius:18px; padding:24px; margin:18px 0;">

                            <p style="margin:0 0 10px; color:#2563eb; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; font-weight:bold;">
                              Easiest On Your Phone
                            </p>

                            <h4 style="margin:0 0 14px; color:#06111f; font-size:20px;">
                              Pay Using Zelle Username
                            </h4>

                            <p style="margin:0 0 8px; color:#475569; font-size:14px;">
                              Zelle Username
                            </p>

                            <div style="display:inline-block; background:#ffffff; border:2px solid #93c5fd; border-radius:14px; padding:14px 20px; margin:0 auto 12px;">
                              <p style="margin:0; color:#0f172a !important; font-size:25px; font-weight:900; letter-spacing:0.5px; word-break:break-all;">
                                apexxbiolabs7
                              </p>
                            </div>

                            <p style="margin:0; color:#64748b; font-size:13px; line-height:1.6;">
                              Press and hold the username above to copy it,
                              then open your bank app, choose Zelle, and paste it.
                            </p>

                            <p style="margin:12px 0 0; color:#64748b; font-size:13px; line-height:1.5;">
                              Recipient should show as
                              <strong style="color:#06111f;">
                                APEXX BIOLABS LLC
                              </strong>.
                            </p>

                          </div>

                          <div style="background:#ffffff; border:1px solid #bfdbfe; border-radius:18px; padding:22px; margin:18px 0;">

                            <p style="margin:0 0 10px; color:#3b82f6; font-size:13px; text-transform:uppercase; letter-spacing:1.5px;">
                              Or Scan To Pay
                            </p>

                            <h4 style="margin:0 0 14px; color:#06111f; font-size:18px;">
                              Zelle QR Code
                            </h4>

                            <img
                              src="https://apexxbiolabs.com/images/zelle-qr.png"
                              alt="Apexx Biolabs Zelle QR Code"
                              width="200"
                              style="width:200px; max-width:85%; height:auto; border-radius:14px; background:#ffffff; padding:10px; margin:8px auto 14px; display:block; border:1px solid #e5e7eb;"
                            />

                            <p style="margin:0; color:#64748b; font-size:13px; line-height:1.5;">
                              Best when this email is open on a computer or another device.
                            </p>

                          </div>

                        </div>
                      `
                      : ""
                  }

                  <div style="background:#ffffff; border-left:4px solid #60a5fa; padding:20px; border-radius:14px; margin-top:24px;">

                    <p style="margin:0; color:#06111f; font-weight:bold;">
                      Payment Note
                    </p>

                    <p style="margin:8px 0 8px; color:#1e3a8a;">
                      Include ONLY this order number:
                    </p>

                    <div style="display:inline-block; background:#eef7ff; border:1px solid #bfdbfe; border-radius:12px; padding:11px 14px; margin:0 0 10px;">
                      <strong style="color:#06111f; font-size:18px; letter-spacing:0.3px; word-break:break-all;">
                        ${orderNumber}
                      </strong>
                    </div>

                    <p style="margin:0 0 10px; color:#64748b; font-size:13px; line-height:1.5;">
                      On your phone, press and hold the order number above to copy it.
                    </p>

                    <p style="margin:0; color:#64748b; font-size:13px; line-height:1.5;">
                      Do not include product names, product descriptions,
                      or extra details in the payment notes.
                    </p>

                  </div>

                </div>

                <div style="margin-bottom:30px; background:#ffffff; border:1px solid #dbeafe; border-radius:18px; padding:20px;">

                  <p style="margin:0 0 8px; color:#3b82f6; font-size:13px; text-transform:uppercase; letter-spacing:2px;">
                    Order Number
                  </p>

                  <p style="margin:0; color:#06111f; font-size:21px; font-weight:bold;">
                    ${orderNumber}
                  </p>

                </div>

                <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:20px; padding:22px; margin-bottom:30px;">

                  <h3 style="margin:0 0 16px; color:#06111f; font-size:22px;">
                    Order Summary
                  </h3>

                  <ul style="margin:0 0 18px; padding-left:20px; color:#334155; line-height:1.8;">
                    ${itemsHtml}
                  </ul>

                  <div style="border-top:1px solid #dbeafe; padding-top:16px; color:#334155; line-height:1.8;">

                    <p style="margin:0;">
                      <strong>Subtotal:</strong>
                      $${serverSubtotal.toFixed(
                        2
                      )}
                    </p>

                    <p style="margin:0;">
                      <strong>Shipping:</strong>
                      $${serverShipping.toFixed(
                        2
                      )}
                    </p>

                    ${promoHtml}
                    ${rewardHtml}

                    <p style="margin:12px 0 0; color:#06111f; font-size:19px;">
                      <strong>Total:</strong>
                      $${serverTotal.toFixed(
                        2
                      )}
                    </p>

                  </div>

                </div>

                ${
                  validatedRedeemedPoints >
                  0
                    ? `
                      <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe); border:1px solid #93c5fd; border-radius:20px; padding:22px; margin-bottom:30px;">

                        <h3 style="margin:0 0 10px; color:#06111f; font-size:18px;">
                          Apexx Rewards Redeemed
                        </h3>

                        <p style="margin:0; color:#475569; line-height:1.7;">
                          ${validatedRedeemedPoints} points were deducted
                          from your rewards balance for a
                          $${rewardDiscount.toFixed(
                            2
                          )} discount.
                        </p>

                        ${
                          updatedPointsBalance !==
                          null
                            ? `
                              <p style="margin:12px 0 0; color:#1e3a8a; font-weight:bold;">
                                Remaining balance:
                                ${updatedPointsBalance} points
                              </p>
                            `
                            : ""
                        }

                      </div>
                    `
                    : ""
                }

                <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:20px; padding:22px; margin-bottom:30px;">

                  <h3 style="margin:0 0 12px; color:#06111f; font-size:18px;">
                    What Happens Next?
                  </h3>

                  <p style="margin:0; color:#475569; line-height:1.7;">
                    Once payment is verified, your order will
                    be prepared for shipment. Tracking information
                    will be emailed once your order has been dispatched.
                  </p>

                </div>

                <p style="margin:0 0 24px; color:#2563eb; font-size:14px; line-height:1.6;">
                  Orders not paid within 24 hours may be automatically cancelled.
                </p>

                <div style="border-top:1px solid #dbeafe; padding-top:24px;">

                  <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0;">
                    Products sold by Apexx Biolabs are intended strictly
                    for lawful laboratory research use only. Not for human
                    consumption, medical use, veterinary use, diagnosis,
                    treatment, cure, or prevention of disease.
                  </p>

                  <p style="margin:24px 0 0; color:#334155; line-height:1.6;">
                    Apexx Biolabs<br/>
                    orders@apexxbiolabs.com<br/>
                    apexxbiolabs.com
                  </p>

                </div>

              </div>
            </div>
          </div>
        </div>
      `,
    });

    if (customerEmailError) {
      console.error(
        "Customer confirmation email error:",
        customerEmailError
      );
    }

    /*
     * ADMIN notification.
     *
     * You CAN see affiliate
     * information here.
     */
    const {
      error:
        adminEmailError,
    } = await resend.emails.send({
      from:
        "Apexx Biolabs <orders@apexxbiolabs.com>",

      to:
        "orders@apexxbiolabs.com",

      subject:
        `New Apexx Order ${orderNumber}`,

      html: `
        <h2>New Order Received</h2>

        <p>
          <strong>Order Number:</strong>
          ${orderNumber}
        </p>

        <p>
          <strong>Customer:</strong>
          ${normalizedFirstName}
          ${normalizedLastName}
        </p>

        <p>
          <strong>Email:</strong>
          ${normalizedCustomerEmail}
        </p>

        <h3>Shipping Address</h3>

        <p>
          ${normalizedAddress}<br/>
          ${normalizedCity},
          ${normalizedState}
          ${normalizedZipCode}
        </p>

        <p>
          <strong>Payment Method:</strong>
          ${normalizedPaymentMethod}
        </p>

        <h3>Order Items</h3>

        <ul>
          ${itemsHtml}
        </ul>

        <p>
          <strong>Subtotal:</strong>
          $${serverSubtotal.toFixed(
            2
          )}
        </p>

        <p>
          <strong>Shipping:</strong>
          $${serverShipping.toFixed(
            2
          )}
        </p>

        ${
          appliedPromoCode
            ? `
              <p>
                <strong>Promo Code:</strong>
                ${appliedPromoCode}
              </p>

              <p>
                <strong>Promo Discount:</strong>
                -$${serverDiscount.toFixed(
                  2
                )}
              </p>
            `
            : ""
        }

        ${
          affiliateId
            ? `
              <hr/>

              <h3>Affiliate Attribution</h3>

              <p>
                <strong>Affiliate:</strong>
                ${affiliateName}
              </p>

              <p>
                <strong>Affiliate Code:</strong>
                ${affiliateCode}
              </p>

              <p>
                <strong>Pending Commission:</strong>
                $${affiliateCommission.toFixed(
                  2
                )}
              </p>
            `
            : ""
        }

        ${
          validatedRedeemedPoints >
          0
            ? `
              <p>
                <strong>Rewards Redeemed:</strong>
                ${validatedRedeemedPoints} points
              </p>

              <p>
                <strong>Reward Discount:</strong>
                -$${rewardDiscount.toFixed(
                  2
                )}
              </p>

              <p style="color:#16a34a; font-weight:bold;">
                Reward points were deducted immediately when the order was placed.
              </p>
            `
            : ""
        }

        <p>
          <strong>Total:</strong>
          $${serverTotal.toFixed(
            2
          )}
        </p>
      `,
    });

    if (adminEmailError) {
      console.error(
        "Admin order email error:",
        adminEmailError
      );
    }

    /*
     * AFFILIATE EMAIL.
     *
     * Only sent when an active affiliate code generated this order.
     * No customer name, email, address, payment info, or products are shared.
     */
    if (affiliateId && affiliateEmail) {
      const qualifyingSale = Math.max(
        0,
        serverSubtotal - serverDiscount
      );

      const { error: affiliateEmailError } =
        await resend.emails.send({
          from: "Apexx Biolabs <orders@apexxbiolabs.com>",
          to: affiliateEmail,
          subject: `Your ${affiliateCode} Code Was Used • Apexx Biolabs`,
          html: `
            <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
              <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
                <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">
                  <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:38px 24px;text-align:center;border-bottom:1px solid #dbeafe;">
                    <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Research. Quality. Confidence.</p>
                    <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">APEXX BIOLABS</h1>
                    <p style="margin:12px 0 0;color:#475569;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Affiliate Program</p>
                  </div>

                  <div style="padding:32px 24px;color:#0f172a;">
                    <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:32px 24px;text-align:center;margin-bottom:30px;box-shadow:0 12px 30px rgba(59,130,246,0.10);">
                      <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Affiliate Activity</p>
                      <h2 style="margin:0;color:#06111f;font-size:34px;font-weight:800;line-height:1.1;">Your Code Was Used!</h2>
                      <p style="margin:18px auto 0;max-width:500px;color:#475569;font-size:15px;line-height:1.7;">
                        ${affiliateName ? `Great news, ${affiliateName}. ` : "Great news. "}
                        An order was placed using your Apexx Biolabs affiliate code.
                      </p>
                    </div>

                    <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:22px;padding:28px;text-align:center;margin-bottom:20px;">
                      <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">Affiliate Code</p>
                      <p style="margin:0;color:#2563eb;font-size:30px;font-weight:900;">${affiliateCode}</p>
                    </div>

                    <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:22px;margin-bottom:20px;text-align:center;">
                      <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Order Number</p>
                      <p style="margin:0;color:#06111f;font-size:20px;font-weight:800;">${orderNumber}</p>
                    </div>

                    <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:20px;padding:26px;margin-bottom:20px;text-align:center;">
                      <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Qualifying Sale</p>
                      <p style="margin:0;color:#06111f;font-size:38px;font-weight:900;">$${qualifyingSale.toFixed(2)}</p>
                    </div>

                    <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #93c5fd;border-radius:22px;padding:28px;text-align:center;margin-bottom:24px;">
                      <p style="margin:0 0 8px;color:#1e3a8a;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">Pending Commission</p>
                      <p style="margin:0;color:#06111f;font-size:44px;font-weight:900;">$${affiliateCommission.toFixed(2)}</p>
                    </div>

                    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:20px;margin-bottom:28px;">
                      <p style="margin:0 0 6px;color:#9a3412;font-weight:800;">Awaiting Payment</p>
                      <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.6;">
                        Your $${affiliateCommission.toFixed(2)} commission is currently pending.
                        It will move to confirmed earnings once payment for this order is received and verified.
                      </p>
                    </div>

                    <div style="text-align:center;margin-bottom:30px;">
                      <a href="https://apexxbiolabs.com/affiliate/dashboard" style="display:inline-block;background:#06111f;color:#ffffff;padding:16px 30px;border-radius:999px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;">
                        View Affiliate Dashboard
                      </a>
                    </div>

                    <div style="border-top:1px solid #dbeafe;padding-top:24px;">
                      <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                        Customer names, email addresses, shipping information, payment information,
                        and purchased products are not shared with affiliates.
                      </p>
                      <p style="margin:24px 0 0;color:#334155;line-height:1.6;">
                        Apexx Biolabs<br/>
                        support@apexxbiolabs.com<br/>
                        apexxbiolabs.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
        });

      if (affiliateEmailError) {
        console.error(
          "Affiliate notification email error:",
          affiliateEmailError
        );
      }
    }

    /*
     * Customer response.
     *
     * We intentionally do NOT
     * return affiliate commission
     * information to the browser.
     */
    return NextResponse.json({
      success: true,
      orderNumber,
      order,
      redeemedPoints:
        validatedRedeemedPoints,
      rewardDiscount,
      total: serverTotal,
      remainingAvailablePoints:
        updatedPointsBalance,
    });
  } catch (error) {
    console.error(
      "Order submission error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to submit order.",
      },
      { status: 500 }
    );
  }
}