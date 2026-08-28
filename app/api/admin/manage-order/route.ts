import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

type CartItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type ManageOrderBody =
  | {
      action: "cancel_order";
      orderId: string;
      reason: string;
    }
  | {
      action: "modify_item";
      orderId: string;
      itemId: string;
      newQuantity: number;
      reason: string;
    };

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
 * ==================================================
 * INVENTORY RESTORATION
 * ==================================================
 */

async function restoreInventory(
  items: {
    id: string;
    name: string;
    quantity: number;
  }[]
) {
  const failures: string[] = [];

  for (const item of items) {
    const itemId = String(
      item.id || ""
    )
      .trim()
      .toLowerCase();

    const itemName = String(
      item.name || ""
    )
      .trim()
      .toLowerCase();

    const quantity = Number(
      item.quantity || 0
    );

    if (
      quantity <= 0 ||
      (!itemId && !itemName)
    ) {
      continue;
    }

    const {
      data: products,
      error: productError,
    } = await supabaseAdmin
      .from("products")
      .select(
        "id, slug, name, inventory"
      )
      .or(
        `slug.eq.${itemId},name.ilike.%${itemName}%`
      )
      .limit(1);

    if (
      productError ||
      !products ||
      products.length === 0
    ) {
      console.error(
        "Product not found while restoring inventory:",
        {
          itemId,
          itemName,
          quantity,
          productError,
        }
      );

      failures.push(item.name);

      continue;
    }

    const product = products[0];

    const currentInventory =
      Number(
        product.inventory || 0
      );

    const restoredInventory =
      currentInventory +
      quantity;

    const {
      error: inventoryError,
    } = await supabaseAdmin
      .from("products")
      .update({
        inventory:
          restoredInventory,
      })
      .eq(
        "id",
        product.id
      );

    if (inventoryError) {
      console.error(
        "Inventory restoration failed:",
        {
          product,
          quantity,
          inventoryError,
        }
      );

      failures.push(item.name);
    }
  }

  return {
    success:
      failures.length === 0,
    failures,
  };
}

/*
 * ==================================================
 * REDEEMED POINTS ADJUSTMENT
 * ==================================================
 *
 * Instead of creating duplicate point transactions,
 * we update the existing "redeemed" transaction.
 *
 * Example:
 *
 * Customer redeemed 500 points.
 * Transaction = -500
 *
 * Partial refund means only 300 points can remain used.
 * Transaction becomes -300.
 *
 * Their balance automatically receives 200 points back.
 */

async function adjustRedeemedPoints({
  orderId,
  orderNumber,
  targetRedeemedPoints,
}: {
  orderId: string;
  orderNumber: string;
  targetRedeemedPoints: number;
}) {
  const {
    data: transaction,
    error: lookupError,
  } = await supabaseAdmin
    .from("point_transactions")
    .select(
      "id, user_id, points"
    )
    .eq(
      "order_id",
      orderId
    )
    .eq(
      "type",
      "redeemed"
    )
    .maybeSingle();

  if (lookupError) {
    console.error(
      "Redeemed points lookup error:",
      lookupError
    );

    return {
      pointsReturned: 0,
      warning:
        "Redeemed rewards could not be checked.",
    };
  }

  /*
   * No transaction means nothing was
   * actually deducted from the ledger.
   */
  if (!transaction) {
    return {
      pointsReturned: 0,
      warning: null,
    };
  }

  const currentRedeemed =
    Math.abs(
      Number(
        transaction.points || 0
      )
    );

  const target =
    Math.max(
      0,
      Math.floor(
        targetRedeemedPoints
      )
    );

  const safeTarget =
    Math.min(
      currentRedeemed,
      target
    );

  const pointsReturned =
    Math.max(
      0,
      currentRedeemed -
        safeTarget
    );

  if (
    pointsReturned === 0
  ) {
    return {
      pointsReturned: 0,
      warning: null,
    };
  }

  const description =
    safeTarget > 0
      ? `Rewards adjusted after partial refund on order ${orderNumber}. ${pointsReturned} points returned.`
      : `Rewards returned after cancellation/refund of order ${orderNumber}. ${pointsReturned} points returned.`;

  const {
    error: updateError,
  } = await supabaseAdmin
    .from("point_transactions")
    .update({
      points:
        -safeTarget,
      description,
    })
    .eq(
      "id",
      transaction.id
    );

  if (updateError) {
    console.error(
      "Redeemed points adjustment error:",
      updateError
    );

    return {
      pointsReturned: 0,
      warning:
        "Redeemed points could not be returned.",
    };
  }

  return {
    pointsReturned,
    warning: null,
  };
}

/*
 * ==================================================
 * EARNED POINTS ADJUSTMENT
 * ==================================================
 *
 * Earned points only exist after shipping.
 *
 * Example:
 *
 * Original final total = $150
 * Earned = 150 points
 *
 * Partial refund makes total = $100
 * Earned transaction becomes 100
 *
 * 50 points are therefore reversed.
 */

async function adjustEarnedPoints({
  orderId,
  orderNumber,
  targetEarnedPoints,
}: {
  orderId: string;
  orderNumber: string;
  targetEarnedPoints: number;
}) {
  const {
    data: transaction,
    error: lookupError,
  } = await supabaseAdmin
    .from("point_transactions")
    .select(
      "id, user_id, points"
    )
    .eq(
      "order_id",
      orderId
    )
    .eq(
      "type",
      "earned"
    )
    .maybeSingle();

  if (lookupError) {
    console.error(
      "Earned points lookup error:",
      lookupError
    );

    return {
      pointsReversed: 0,
      warning:
        "Earned rewards could not be checked.",
    };
  }

  /*
   * No earned transaction means the order
   * hasn't earned points yet.
   */
  if (!transaction) {
    return {
      pointsReversed: 0,
      warning: null,
    };
  }

  const currentEarned =
    Math.max(
      0,
      Number(
        transaction.points || 0
      )
    );

  const target =
    Math.max(
      0,
      Math.floor(
        targetEarnedPoints
      )
    );

  const safeTarget =
    Math.min(
      currentEarned,
      target
    );

  const pointsReversed =
    Math.max(
      0,
      currentEarned -
        safeTarget
    );

  if (
    pointsReversed === 0
  ) {
    return {
      pointsReversed: 0,
      warning: null,
    };
  }

  const description =
    safeTarget > 0
      ? `Points adjusted after partial refund on order ${orderNumber}. ${pointsReversed} earned points reversed.`
      : `Points reversed after cancellation/refund of order ${orderNumber}.`;

  const {
    error: updateError,
  } = await supabaseAdmin
    .from("point_transactions")
    .update({
      points:
        safeTarget,
      description,
    })
    .eq(
      "id",
      transaction.id
    );

  if (updateError) {
    console.error(
      "Earned points adjustment error:",
      updateError
    );

    return {
      pointsReversed: 0,
      warning:
        "Earned points could not be reversed.",
    };
  }

  return {
    pointsReversed,
    warning: null,
  };
}

/*
 * ==================================================
 * MAIN ROUTE
 * ==================================================
 */

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as ManageOrderBody;

    if (!body.orderId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body.reason?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A reason is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==================================================
     * LOAD ORDER
     * ==================================================
     */

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq(
        "id",
        body.orderId
      )
      .single();

    if (
      orderError ||
      !order
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const normalizedStatus =
      String(
        order.status || ""
      )
        .trim()
        .toLowerCase();

    /*
     * Prevent double cancellation / double restocking.
     */

    if (
      normalizedStatus ===
      "cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This order has already been cancelled.",
        },
        {
          status: 400,
        }
      );
    }

    const cart =
      Array.isArray(
        order.cart
      )
        ? (order.cart as CartItem[])
        : [];

    if (
      cart.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This order does not contain any cart items.",
        },
        {
          status: 400,
        }
      );
    }

    const originalTotal =
      Number(
        order.total || 0
      );

    const originalSubtotal =
      Number(
        order.subtotal || 0
      );

    const originalDiscount =
      Number(
        order.discount || 0
      );

    const originalRewardDiscount =
      Number(
        order.reward_discount || 0
      );

    const originalRedeemedPoints =
      Math.max(
        0,
        Math.floor(
          Number(
            order.redeemed_points ||
              0
          )
        )
      );

    const alreadyReturnedPoints =
      Math.max(
        0,
        Math.floor(
          Number(
            order.points_returned ||
              0
          )
        )
      );

    const alreadyReversedEarned =
      Math.max(
        0,
        Math.floor(
          Number(
            order.earned_points_reversed ||
              0
          )
        )
      );

    const shipping =
      Number(
        order.shipping || 0
      );

    const previousRefundAmount =
      Number(
        order.refund_amount || 0
      );

    const previousRefundStatus =
      String(
        order.refund_status || ""
      ).toLowerCase();

    /*
     * Inventory was deducted when marked paid.
     */

    const isPaid =
      normalizedStatus ===
        "paid" ||
      normalizedStatus ===
        "shipped" ||
      normalizedStatus ===
        "payment received";

    /*
     * Earned points are created when shipped.
     */
    const wasShipped =
      normalizedStatus ===
      "shipped";

    /*
     * ==================================================
     * CANCEL ENTIRE ORDER
     * ==================================================
     */

    if (
      body.action ===
      "cancel_order"
    ) {
      /*
       * If another refund is already pending,
       * combine it with the remaining order total.
       *
       * If an older refund was already completed,
       * only the remaining current total is due.
       */

      const pendingRefundAlready =
        previousRefundStatus ===
        "pending"
          ? previousRefundAmount
          : 0;

      const refundAmount =
        isPaid
          ? Number(
              (
                pendingRefundAlready +
                originalTotal
              ).toFixed(2)
            )
          : 0;

      /*
       * ----------------------------------------------
       * REWARDS
       * ----------------------------------------------
       */

      const redeemedResult =
        await adjustRedeemedPoints(
          {
            orderId:
              order.id,

            orderNumber:
              order.order_number,

            targetRedeemedPoints:
              0,
          }
        );

      const earnedResult =
        await adjustEarnedPoints(
          {
            orderId:
              order.id,

            orderNumber:
              order.order_number,

            targetEarnedPoints:
              0,
          }
        );

      const totalPointsReturned =
        alreadyReturnedPoints +
        redeemedResult.pointsReturned;

      const totalEarnedReversed =
        alreadyReversedEarned +
        earnedResult.pointsReversed;

      /*
       * ----------------------------------------------
       * UPDATE ORDER
       * ----------------------------------------------
       */

      const {
        error: updateError,
      } = await supabaseAdmin
        .from("orders")
        .update({
          status:
            "cancelled",

          cancellation_reason:
            body.reason.trim(),

          cancelled_at:
            new Date().toISOString(),

          refund_amount:
            refundAmount,

          refund_status:
            refundAmount > 0
              ? "pending"
              : null,

          refund_reason:
            refundAmount > 0
              ? body.reason.trim()
              : null,

          /*
           * Rewards are no longer applied
           * after a full cancellation.
           */

          redeemed_points: 0,

          reward_discount: 0,

          points_returned:
            totalPointsReturned,

          earned_points_reversed:
            totalEarnedReversed,
        })
        .eq(
          "id",
          order.id
        );

      if (updateError) {
        console.error(
          "Cancel order update error:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to cancel the order.",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * ----------------------------------------------
       * INVENTORY
       * ----------------------------------------------
       */

      let inventoryWarning:
        string | null = null;

      if (isPaid) {
        const inventoryResult =
          await restoreInventory(
            cart.map(
              (item) => ({
                id:
                  item.id,

                name:
                  item.name,

                quantity:
                  Number(
                    item.quantity ||
                      0
                  ),
              })
            )
          );

        if (
          !inventoryResult.success
        ) {
          inventoryWarning =
            `Inventory could not be restored for: ${inventoryResult.failures.join(
              ", "
            )}.`;
        }
      }

      /*
       * ----------------------------------------------
       * WARNINGS
       * ----------------------------------------------
       */

      const rewardWarnings =
        [
          redeemedResult.warning,
          earnedResult.warning,
          inventoryWarning,
        ].filter(Boolean);

      /*
       * ----------------------------------------------
       * CUSTOMER EMAIL
       * ----------------------------------------------
       */

      const firstName =
        order.first_name ||
        "there";

      const rewardHtml =
        redeemedResult.pointsReturned >
          0 ||
        earnedResult.pointsReversed >
          0
          ? `
            <div style="
              background:#eff6ff;
              border:1px solid #bfdbfe;
              border-radius:20px;
              padding:22px;
              margin-bottom:28px;
            ">

              <p style="
                margin:0 0 12px;
                color:#1e3a8a;
                font-size:12px;
                font-weight:800;
                text-transform:uppercase;
                letter-spacing:2px;
              ">
                Apexx Rewards Updated
              </p>

              ${
                redeemedResult.pointsReturned >
                0
                  ? `
                    <p style="
                      margin:0 0 8px;
                      color:#334155;
                      font-size:15px;
                    ">
                      <strong>
                        ${redeemedResult.pointsReturned}
                        reward points
                      </strong>
                      have been returned to your account.
                    </p>
                  `
                  : ""
              }

              ${
                earnedResult.pointsReversed >
                0
                  ? `
                    <p style="
                      margin:0;
                      color:#334155;
                      font-size:15px;
                    ">
                      ${earnedResult.pointsReversed}
                      points previously earned from this
                      order were reversed because the
                      order was cancelled.
                    </p>
                  `
                  : ""
              }

            </div>
          `
          : "";

      try {
        await resend.emails.send(
          {
            from:
              "Apexx Biolabs <orders@apexxbiolabs.com>",

            to:
              order.customer_email,

            replyTo:
              "orders@apexxbiolabs.com",

            subject:
              `Order ${order.order_number} Cancelled`,

            html: `
              <div style="
                margin:0;
                padding:0;
                background:#f8fbff;
                font-family:Arial,Helvetica,sans-serif;
              ">

                <div style="
                  max-width:720px;
                  margin:0 auto;
                  padding:28px 16px;
                ">

                  <div style="
                    background:#ffffff;
                    border:1px solid #dbeafe;
                    border-radius:28px;
                    overflow:hidden;
                    box-shadow:0 18px 45px rgba(30,58,138,0.12);
                  ">

                    <div style="
                      background:linear-gradient(
                        135deg,
                        #eef7ff,
                        #dbeafe,
                        #ffffff
                      );
                      padding:38px 24px;
                      text-align:center;
                      border-bottom:1px solid #dbeafe;
                    ">

                      <p style="
                        margin:0 0 14px;
                        color:#3b82f6;
                        font-size:13px;
                        letter-spacing:4px;
                        text-transform:uppercase;
                      ">
                        Research. Quality. Confidence.
                      </p>

                      <h1 style="
                        margin:0;
                        color:#06111f;
                        font-size:34px;
                        letter-spacing:3px;
                      ">
                        APEXX BIOLABS
                      </h1>

                    </div>

                    <div style="
                      padding:32px 24px;
                      color:#0f172a;
                    ">

                      <p style="
                        margin:0 0 18px;
                        color:#06111f;
                        font-size:16px;
                      ">
                        Hi ${escapeHtml(
                          firstName
                        )},
                      </p>

                      <h2 style="
                        margin:0 0 16px;
                        color:#06111f;
                        font-size:26px;
                      ">
                        Your order has been cancelled.
                      </h2>

                      <p style="
                        margin:0 0 24px;
                        color:#475569;
                        line-height:1.7;
                      ">
                        Order
                        <strong>
                          ${escapeHtml(
                            order.order_number
                          )}
                        </strong>
                        has been cancelled.
                      </p>

                      <div style="
                        background:#f8fbff;
                        border:1px solid #bfdbfe;
                        border-radius:20px;
                        padding:22px;
                        margin-bottom:24px;
                      ">

                        <p style="
                          margin:0 0 8px;
                          color:#64748b;
                          font-size:12px;
                          text-transform:uppercase;
                          letter-spacing:2px;
                        ">
                          Reason
                        </p>

                        <p style="
                          margin:0;
                          color:#06111f;
                          line-height:1.7;
                        ">
                          ${escapeHtml(
                            body.reason
                          )}
                        </p>

                      </div>

                      ${rewardHtml}

                      ${
                        refundAmount >
                        0
                          ? `
                            <div style="
                              background:#fff7ed;
                              border:1px solid #fed7aa;
                              border-radius:20px;
                              padding:22px;
                              margin-bottom:28px;
                            ">

                              <p style="
                                margin:0 0 8px;
                                color:#9a3412;
                                font-weight:800;
                              ">
                                Refund Pending
                              </p>

                              <p style="
                                margin:0;
                                color:#7c2d12;
                                line-height:1.7;
                              ">
                                A refund of
                                <strong>
                                  $${refundAmount.toFixed(
                                    2
                                  )}
                                </strong>
                                is pending.
                              </p>

                            </div>
                          `
                          : ""
                      }

                      <div style="
                        border-top:1px solid #dbeafe;
                        padding-top:24px;
                      ">

                        <p style="
                          font-size:12px;
                          color:#64748b;
                          line-height:1.6;
                          margin:0;
                        ">
                          Products sold by Apexx Biolabs are
                          intended strictly for lawful laboratory
                          research use only. Not for human
                          consumption, medical use, veterinary use,
                          diagnosis, treatment, cure, or prevention
                          of disease.
                        </p>

                        <p style="
                          margin:24px 0 0;
                          color:#334155;
                          line-height:1.6;
                        ">
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
          }
        );
      } catch (
        emailError
      ) {
        console.error(
          "Cancellation email error:",
          emailError
        );
      }

      return NextResponse.json(
        {
          success: true,

          message:
            refundAmount > 0
              ? `Order cancelled. $${refundAmount.toFixed(
                  2
                )} refund pending.`
              : "Order cancelled successfully.",

          pointsReturned:
            redeemedResult.pointsReturned,

          earnedPointsReversed:
            earnedResult.pointsReversed,

          warning:
            rewardWarnings.length >
            0
              ? rewardWarnings.join(
                  " "
                )
              : null,
        }
      );
    }

    /*
     * ==================================================
     * PARTIAL ITEM CANCELLATION
     * ==================================================
     */

    if (
      body.action ===
      "modify_item"
    ) {
      const currentItem =
        cart.find(
          (item) =>
            item.id ===
            body.itemId
        );

      if (!currentItem) {
        return NextResponse.json(
          {
            success: false,
            error:
              "That item was not found in this order.",
          },
          {
            status: 404,
          }
        );
      }

      const currentQuantity =
        Number(
          currentItem.quantity ||
            0
        );

      const newQuantity =
        Number(
          body.newQuantity
        );

      if (
        !Number.isInteger(
          newQuantity
        ) ||
        newQuantity < 0 ||
        newQuantity >=
          currentQuantity
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "New quantity must be lower than the current quantity.",
          },
          {
            status: 400,
          }
        );
      }

      const removedQuantity =
        currentQuantity -
        newQuantity;

      const updatedCart =
        newQuantity === 0
          ? cart.filter(
              (item) =>
                item.id !==
                body.itemId
            )
          : cart.map(
              (item) =>
                item.id ===
                body.itemId
                  ? {
                      ...item,
                      quantity:
                        newQuantity,
                    }
                  : item
            );

      if (
        updatedCart.length ===
        0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Use Cancel Entire Order if you want to remove the final item.",
          },
          {
            status: 400,
          }
        );
      }

      /*
       * ----------------------------------------------
       * RECALCULATE SUBTOTAL
       * ----------------------------------------------
       */

      const updatedSubtotal =
        Number(
          updatedCart
            .reduce(
              (
                sum,
                item
              ) =>
                sum +
                Number(
                  item.price
                ) *
                  Number(
                    item.quantity
                  ),
              0
            )
            .toFixed(2)
        );

      /*
       * Preserve existing promo percentage.
       */

      const promoDiscountRate =
        originalSubtotal > 0
          ? originalDiscount /
            originalSubtotal
          : 0;

      const updatedDiscount =
        Number(
          (
            updatedSubtotal *
            promoDiscountRate
          ).toFixed(2)
        );

      /*
       * ----------------------------------------------
       * REWARD POINTS
       * ----------------------------------------------
       *
       * Checkout uses:
       *
       * 100 points = $10
       *
       * Rewards cannot exceed merchandise
       * remaining after promo.
       */

      const merchandiseAfterPromo =
        Math.max(
          0,
          updatedSubtotal -
            updatedDiscount
        );

      const maximumPointsForOrder =
        Math.floor(
          merchandiseAfterPromo /
            10
        ) * 100;

      const updatedRedeemedPoints =
        Math.min(
          originalRedeemedPoints,
          maximumPointsForOrder
        );

      const updatedRewardDiscount =
        Number(
          (
            updatedRedeemedPoints /
            10
          ).toFixed(2)
        );

      /*
       * ----------------------------------------------
       * NEW TOTAL
       * ----------------------------------------------
       */

      const updatedTotal =
        Number(
          Math.max(
            0,
            updatedSubtotal -
              updatedDiscount -
              updatedRewardDiscount +
              shipping
          ).toFixed(2)
        );

      /*
       * Refund caused by THIS modification.
       */

      const refundDelta =
        isPaid
          ? Number(
              Math.max(
                0,
                originalTotal -
                  updatedTotal
              ).toFixed(2)
            )
          : 0;

      /*
       * If a previous refund is still pending,
       * combine it with this new pending refund.
       *
       * If previous refund was completed,
       * this becomes a new refund amount.
       */

      const pendingRefundAlready =
        previousRefundStatus ===
        "pending"
          ? previousRefundAmount
          : 0;

      const refundAmount =
        isPaid
          ? Number(
              (
                pendingRefundAlready +
                refundDelta
              ).toFixed(2)
            )
          : 0;

      /*
       * ----------------------------------------------
       * ADJUST REDEEMED POINTS
       * ----------------------------------------------
       */

      const redeemedResult =
        await adjustRedeemedPoints(
          {
            orderId:
              order.id,

            orderNumber:
              order.order_number,

            targetRedeemedPoints:
              updatedRedeemedPoints,
          }
        );

      /*
       * ----------------------------------------------
       * ADJUST EARNED POINTS
       * ----------------------------------------------
       *
       * If the order was shipped, the customer
       * already earned points.
       *
       * Their new earned amount should equal the
       * floor of the new final total.
       */

      const earnedResult =
        wasShipped
          ? await adjustEarnedPoints(
              {
                orderId:
                  order.id,

                orderNumber:
                  order.order_number,

                targetEarnedPoints:
                  Math.floor(
                    updatedTotal
                  ),
              }
            )
          : {
              pointsReversed:
                0,
              warning: null,
            };

      /*
       * ----------------------------------------------
       * AFFILIATE COMMISSION
       * ----------------------------------------------
       */

      let updatedAffiliateCommission =
        Number(
          order.affiliate_commission ||
            0
        );

      if (
        order.affiliate_id &&
        originalSubtotal > 0
      ) {
        const originalCommissionable =
          Math.max(
            0,
            originalSubtotal -
              originalDiscount
          );

        const commissionRate =
          originalCommissionable >
          0
            ? updatedAffiliateCommission /
              originalCommissionable
            : 0;

        const updatedCommissionable =
          Math.max(
            0,
            updatedSubtotal -
              updatedDiscount
          );

        updatedAffiliateCommission =
          Number(
            (
              updatedCommissionable *
              commissionRate
            ).toFixed(2)
          );
      }

      /*
       * ----------------------------------------------
       * UPDATE ORDER
       * ----------------------------------------------
       */

      const totalPointsReturned =
        alreadyReturnedPoints +
        redeemedResult.pointsReturned;

      const totalEarnedReversed =
        alreadyReversedEarned +
        earnedResult.pointsReversed;

      const {
        error: updateError,
      } = await supabaseAdmin
        .from("orders")
        .update({
          cart:
            updatedCart,

          subtotal:
            updatedSubtotal,

          discount:
            updatedDiscount,

          redeemed_points:
            updatedRedeemedPoints,

          reward_discount:
            updatedRewardDiscount,

          points_returned:
            totalPointsReturned,

          earned_points_reversed:
            totalEarnedReversed,

          total:
            updatedTotal,

          affiliate_commission:
            updatedAffiliateCommission,

          refund_amount:
            refundAmount,

          refund_status:
            refundAmount > 0
              ? "pending"
              : null,

          refund_reason:
            refundAmount > 0
              ? body.reason.trim()
              : null,
        })
        .eq(
          "id",
          order.id
        );

      if (updateError) {
        console.error(
          "Partial cancellation update error:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to update the order.",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * ----------------------------------------------
       * INVENTORY
       * ----------------------------------------------
       */

      let inventoryWarning:
        string | null = null;

      if (
        isPaid &&
        removedQuantity > 0
      ) {
        const inventoryResult =
          await restoreInventory(
            [
              {
                id:
                  currentItem.id,

                name:
                  currentItem.name,

                quantity:
                  removedQuantity,
              },
            ]
          );

        if (
          !inventoryResult.success
        ) {
          inventoryWarning =
            `Inventory could not be restored for ${currentItem.name}.`;
        }
      }

      /*
       * ----------------------------------------------
       * CUSTOMER EMAIL
       * ----------------------------------------------
       */

      const rewardsHtml =
        redeemedResult.pointsReturned >
          0 ||
        earnedResult.pointsReversed >
          0
          ? `
            <div style="
              background:#eff6ff;
              border:1px solid #bfdbfe;
              border-radius:20px;
              padding:22px;
              margin-bottom:24px;
            ">

              <p style="
                margin:0 0 12px;
                color:#1e3a8a;
                font-size:12px;
                text-transform:uppercase;
                letter-spacing:2px;
                font-weight:800;
              ">
                Apexx Rewards Updated
              </p>

              ${
                redeemedResult.pointsReturned >
                0
                  ? `
                    <p style="
                      margin:0 0 8px;
                      color:#334155;
                    ">
                      <strong>
                        ${redeemedResult.pointsReturned}
                        reward points
                      </strong>
                      were returned to your account.
                    </p>
                  `
                  : ""
              }

              ${
                earnedResult.pointsReversed >
                0
                  ? `
                    <p style="
                      margin:0;
                      color:#334155;
                    ">
                      ${earnedResult.pointsReversed}
                      earned points were adjusted to
                      reflect your updated order total.
                    </p>
                  `
                  : ""
              }

            </div>
          `
          : "";

      try {
        await resend.emails.send(
          {
            from:
              "Apexx Biolabs <orders@apexxbiolabs.com>",

            to:
              order.customer_email,

            replyTo:
              "orders@apexxbiolabs.com",

            subject:
              `Order ${order.order_number} Updated`,

            html: `
              <div style="
                margin:0;
                padding:0;
                background:#f8fbff;
                font-family:Arial,Helvetica,sans-serif;
              ">

                <div style="
                  max-width:720px;
                  margin:0 auto;
                  padding:28px 16px;
                ">

                  <div style="
                    background:#ffffff;
                    border:1px solid #dbeafe;
                    border-radius:28px;
                    overflow:hidden;
                    box-shadow:0 18px 45px rgba(30,58,138,0.12);
                  ">

                    <div style="
                      background:linear-gradient(
                        135deg,
                        #eef7ff,
                        #dbeafe,
                        #ffffff
                      );
                      padding:38px 24px;
                      text-align:center;
                      border-bottom:1px solid #dbeafe;
                    ">

                      <p style="
                        margin:0 0 14px;
                        color:#3b82f6;
                        font-size:13px;
                        letter-spacing:4px;
                        text-transform:uppercase;
                      ">
                        Research. Quality. Confidence.
                      </p>

                      <h1 style="
                        margin:0;
                        color:#06111f;
                        font-size:34px;
                        letter-spacing:3px;
                      ">
                        APEXX BIOLABS
                      </h1>

                    </div>

                    <div style="
                      padding:32px 24px;
                      color:#0f172a;
                    ">

                      <h2 style="
                        margin:0 0 18px;
                        color:#06111f;
                        font-size:26px;
                      ">
                        Your Order Has Been Updated
                      </h2>

                      <p style="
                        margin:0 0 22px;
                        color:#475569;
                        line-height:1.7;
                      ">
                        We updated order
                        <strong>
                          ${escapeHtml(
                            order.order_number
                          )}
                        </strong>.
                      </p>

                      <div style="
                        background:#f8fbff;
                        border:1px solid #bfdbfe;
                        border-radius:20px;
                        padding:22px;
                        margin-bottom:20px;
                      ">

                        <p style="
                          margin:0;
                          color:#06111f;
                          line-height:1.8;
                        ">

                          <strong>
                            Item:
                          </strong>

                          ${escapeHtml(
                            currentItem.name
                          )}

                          <br/>

                          <strong>
                            Quantity Removed:
                          </strong>

                          ${removedQuantity}

                          <br/>

                          <strong>
                            Reason:
                          </strong>

                          ${escapeHtml(
                            body.reason
                          )}

                        </p>

                      </div>

                      ${rewardsHtml}

                      <div style="
                        background:linear-gradient(
                          135deg,
                          #eaf4ff,
                          #f8fbff
                        );
                        border:1px solid #bfdbfe;
                        border-radius:20px;
                        padding:22px;
                        margin-bottom:24px;
                      ">

                        <p style="
                          margin:0 0 8px;
                          color:#1e3a8a;
                          font-size:12px;
                          text-transform:uppercase;
                          letter-spacing:2px;
                          font-weight:bold;
                        ">
                          Updated Order Total
                        </p>

                        <p style="
                          margin:0;
                          color:#06111f;
                          font-size:36px;
                          font-weight:900;
                        ">
                          $${updatedTotal.toFixed(
                            2
                          )}
                        </p>

                      </div>

                      ${
                        refundAmount >
                        0
                          ? `
                            <div style="
                              background:#fff7ed;
                              border:1px solid #fed7aa;
                              border-radius:20px;
                              padding:22px;
                              margin-bottom:24px;
                            ">

                              <p style="
                                margin:0 0 8px;
                                color:#9a3412;
                                font-weight:800;
                              ">
                                Partial Refund Pending
                              </p>

                              <p style="
                                margin:0;
                                color:#7c2d12;
                                line-height:1.7;
                              ">
                                A refund of
                                <strong>
                                  $${refundAmount.toFixed(
                                    2
                                  )}
                                </strong>
                                is pending.
                              </p>

                            </div>
                          `
                          : ""
                      }

                      <div style="
                        border-top:1px solid #dbeafe;
                        padding-top:24px;
                      ">

                        <p style="
                          font-size:12px;
                          color:#64748b;
                          line-height:1.6;
                          margin:0;
                        ">
                          Products sold by Apexx Biolabs are
                          intended strictly for lawful laboratory
                          research use only. Not for human
                          consumption, medical use, veterinary use,
                          diagnosis, treatment, cure, or prevention
                          of disease.
                        </p>

                        <p style="
                          margin:24px 0 0;
                          color:#334155;
                          line-height:1.6;
                        ">
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
          }
        );
      } catch (
        emailError
      ) {
        console.error(
          "Order update email error:",
          emailError
        );
      }

      const warnings =
        [
          redeemedResult.warning,
          earnedResult.warning,
          inventoryWarning,
        ].filter(Boolean);

      return NextResponse.json(
        {
          success: true,

          message:
            refundAmount > 0
              ? `Order updated. $${refundAmount.toFixed(
                  2
                )} refund pending.`
              : `Order updated. New total: $${updatedTotal.toFixed(
                  2
                )}.`,

          updatedTotal,

          refundAmount,

          pointsReturned:
            redeemedResult.pointsReturned,

          earnedPointsReversed:
            earnedResult.pointsReversed,

          inventoryRestored:
            isPaid
              ? removedQuantity
              : 0,

          warning:
            warnings.length > 0
              ? warnings.join(
                  " "
                )
              : null,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid order action.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "Manage order route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while updating the order.",
      },
      {
        status: 500,
      }
    );
  }
}