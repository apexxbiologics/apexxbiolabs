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

function escapeHtml(
  value: string
) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
 * ==================================================
 * RESTORE INVENTORY
 * ==================================================
 *
 * This mirrors the inventory lookup used by
 * /api/admin/mark-paid.
 *
 * Inventory is only restored when the order had
 * actually been paid/shipped.
 */

async function restoreInventory(
  items: {
    id: string;
    name: string;
    quantity: number;
  }[]
) {
  const failures: string[] =
    [];

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

    const quantity =
      Number(
        item.quantity || 0
      );

    if (
      quantity <= 0 ||
      (!itemId &&
        !itemName)
    ) {
      continue;
    }

    /*
     * Find the same product that
     * mark-paid originally deducted.
     */

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

      failures.push(
        item.name
      );

      continue;
    }

    const product =
      products[0];

    const currentInventory =
      Number(
        product.inventory ||
          0
      );

    const restoredInventory =
      currentInventory +
      quantity;

    const {
      error:
        inventoryUpdateError,
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

    if (
      inventoryUpdateError
    ) {
      console.error(
        "Inventory restoration failed:",
        {
          product,
          quantity,
          inventoryUpdateError,
        }
      );

      failures.push(
        item.name
      );

      continue;
    }

    console.log(
      `Inventory restored: ${product.name} +${quantity}`
    );
  }

  return {
    success:
      failures.length === 0,

    failures,
  };
}

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

    const status =
      String(
        order.status || ""
      ).trim();

    const normalizedStatus =
      status.toLowerCase();

    /*
     * Prevent a cancelled order from
     * being processed again.
     *
     * This is important because otherwise
     * inventory could be restored twice.
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
        order.subtotal ||
          0
      );

    const originalDiscount =
      Number(
        order.discount || 0
      );

    const originalRewardDiscount =
      Number(
        order.reward_discount ||
          0
      );

    const shipping =
      Number(
        order.shipping || 0
      );

    /*
     * Inventory was deducted when the
     * order was marked paid.
     *
     * Therefore these statuses mean
     * inventory should be restored.
     */

    const isPaid =
      normalizedStatus ===
        "paid" ||
      normalizedStatus ===
        "shipped" ||
      normalizedStatus ===
        "payment received";

    /*
     * ==================================================
     * CANCEL ENTIRE ORDER
     * ==================================================
     */

    if (
      body.action ===
      "cancel_order"
    ) {
      const refundAmount =
        isPaid
          ? originalTotal
          : 0;

      /*
       * First mark order cancelled.
       */

      const {
        error:
          updateError,
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
       * ==================================================
       * RESTORE FULL INVENTORY
       * ==================================================
       *
       * Only paid/shipped orders had inventory deducted.
       *
       * Awaiting-payment orders DO NOT change inventory.
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
            `Order was cancelled, but inventory could not be restored for: ${inventoryResult.failures.join(
              ", "
            )}.`;

          console.error(
            inventoryWarning
          );
        }
      }

      /*
       * ==================================================
       * CUSTOMER CANCELLATION EMAIL
       * ==================================================
       */

      const firstName =
        order.first_name ||
        "there";

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
              <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
                <div style="max-width:720px;margin:0 auto;padding:28px 16px;">

                  <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                    <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:38px 24px;text-align:center;border-bottom:1px solid #dbeafe;">

                      <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                        Research. Quality. Confidence.
                      </p>

                      <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">
                        APEXX BIOLABS
                      </h1>

                    </div>

                    <div style="padding:32px 24px;color:#0f172a;">

                      <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:30px 24px;margin-bottom:28px;">

                        <p style="margin:0 0 18px;color:#06111f;font-size:16px;">
                          Hi ${escapeHtml(
                            firstName
                          )},
                        </p>

                        <h2 style="margin:0 0 16px;color:#06111f;font-size:26px;">
                          Your order has been cancelled.
                        </h2>

                        <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
                          Order
                          <strong>
                            ${escapeHtml(
                              order.order_number
                            )}
                          </strong>
                          has been cancelled.
                        </p>

                      </div>

                      <div style="background:#f8fbff;border:1px solid #bfdbfe;border-radius:20px;padding:22px;margin-bottom:28px;">

                        <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                          Reason
                        </p>

                        <p style="margin:0;color:#06111f;font-size:15px;line-height:1.7;">
                          ${escapeHtml(
                            body.reason
                          )}
                        </p>

                      </div>

                      ${
                        refundAmount >
                        0
                          ? `
                            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:22px;margin-bottom:28px;">

                              <p style="margin:0 0 8px;color:#9a3412;font-weight:800;">
                                Refund Pending
                              </p>

                              <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.7;">
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

                      <div style="border-top:1px solid #dbeafe;padding-top:24px;">

                        <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                          Products sold by Apexx Biolabs are intended strictly
                          for lawful laboratory research use only. Not for human
                          consumption, medical use, veterinary use, diagnosis,
                          treatment, cure, or prevention of disease.
                        </p>

                        <p style="margin:24px 0 0;color:#334155;line-height:1.6;">
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
              ? `Order cancelled. Inventory restored and $${refundAmount.toFixed(
                  2
                )} refund marked pending.`
              : "Order cancelled successfully.",

          warning:
            inventoryWarning,
        }
      );
    }

    /*
     * ==================================================
     * MODIFY / PARTIAL CANCEL
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

      if (
        !currentItem
      ) {
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
       * ==================================================
       * RECALCULATE ORDER
       * ==================================================
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
       * Preserve original promo discount rate.
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
       * Reward discount cannot exceed remaining
       * merchandise after promo.
       */

      const merchandiseAfterPromo =
        Math.max(
          0,
          updatedSubtotal -
            updatedDiscount
        );

      const updatedRewardDiscount =
        Math.min(
          originalRewardDiscount,
          merchandiseAfterPromo
        );

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
       * Refund due for THIS modification.
       */

      const refundAmount =
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
       * ==================================================
       * RECALCULATE AFFILIATE COMMISSION
       * ==================================================
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
       * ==================================================
       * UPDATE ORDER
       * ==================================================
       */

      const {
        error:
          updateError,
      } = await supabaseAdmin
        .from("orders")
        .update({
          cart:
            updatedCart,

          subtotal:
            updatedSubtotal,

          discount:
            updatedDiscount,

          reward_discount:
            updatedRewardDiscount,

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
       * ==================================================
       * RESTORE REMOVED INVENTORY
       * ==================================================
       *
       * Example:
       *
       * Customer purchased 3
       * Admin changes to 1
       *
       * removedQuantity = 2
       *
       * Inventory gets +2.
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
            `Order was updated, but inventory could not be restored for: ${inventoryResult.failures.join(
              ", "
            )}.`;

          console.error(
            inventoryWarning
          );
        }
      }

      /*
       * ==================================================
       * CUSTOMER PARTIAL-CANCELLATION EMAIL
       * ==================================================
       */

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
              <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">

                <div style="max-width:720px;margin:0 auto;padding:28px 16px;">

                  <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">

                    <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:38px 24px;text-align:center;border-bottom:1px solid #dbeafe;">

                      <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">
                        Research. Quality. Confidence.
                      </p>

                      <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">
                        APEXX BIOLABS
                      </h1>

                    </div>

                    <div style="padding:32px 24px;color:#0f172a;">

                      <h2 style="margin:0 0 18px;color:#06111f;font-size:26px;">
                        Your Order Has Been Updated
                      </h2>

                      <p style="margin:0 0 22px;color:#475569;font-size:15px;line-height:1.7;">
                        We updated order
                        <strong>
                          ${escapeHtml(
                            order.order_number
                          )}
                        </strong>.
                      </p>

                      <div style="background:#f8fbff;border:1px solid #bfdbfe;border-radius:20px;padding:22px;margin-bottom:20px;">

                        <p style="margin:0;color:#06111f;font-size:15px;line-height:1.8;">

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

                      <div style="background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:20px;padding:22px;margin-bottom:24px;">

                        <p style="margin:0 0 8px;color:#1e3a8a;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;">
                          Updated Order Total
                        </p>

                        <p style="margin:0;color:#06111f;font-size:36px;font-weight:900;">
                          $${updatedTotal.toFixed(
                            2
                          )}
                        </p>

                      </div>

                      ${
                        refundAmount >
                        0
                          ? `
                            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:22px;margin-bottom:24px;">

                              <p style="margin:0 0 8px;color:#9a3412;font-weight:800;">
                                Partial Refund Pending
                              </p>

                              <p style="margin:0;color:#7c2d12;font-size:14px;line-height:1.7;">

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

                      <div style="border-top:1px solid #dbeafe;padding-top:24px;">

                        <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">
                          Products sold by Apexx Biolabs are intended strictly
                          for lawful laboratory research use only. Not for human
                          consumption, medical use, veterinary use, diagnosis,
                          treatment, cure, or prevention of disease.
                        </p>

                        <p style="margin:24px 0 0;color:#334155;line-height:1.6;">
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

      return NextResponse.json(
        {
          success: true,

          message:
            refundAmount > 0
              ? `Order updated. ${removedQuantity} item${
                  removedQuantity ===
                  1
                    ? ""
                    : "s"
                } returned to inventory and $${refundAmount.toFixed(
                  2
                )} partial refund marked pending.`
              : `Order updated. ${removedQuantity} item${
                  removedQuantity ===
                  1
                    ? ""
                    : "s"
                } returned to inventory. New total: $${updatedTotal.toFixed(
                  2
                )}.`,

          updatedTotal,

          refundAmount,

          inventoryRestored:
            isPaid
              ? removedQuantity
              : 0,

          warning:
            inventoryWarning,
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