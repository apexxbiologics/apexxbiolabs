"use client";

import {
  useEffect,
  useState,
} from "react";

type BasicOrder = {
  id: string;
  order_number: string;
  customer_email: string;
  first_name: string;
  last_name: string;
  total: number;
  status: string;
};

type CartItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type DetailedOrder = BasicOrder & {
  payment_method: string;
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number | null;
  reward_discount: number | null;

  cancellation_reason:
    | string
    | null;

  cancelled_at:
    | string
    | null;

  refund_amount:
    | number
    | null;

  refund_status:
    | string
    | null;

  refund_reason:
    | string
    | null;
};

type Props = {
  order: BasicOrder;
  onClose: () => void;
  onUpdated: () => void;
};

const REASONS = [
  "No payment received after 24 hours",
  "Customer requested cancellation",
  "Item unavailable",
  "Duplicate order",
  "Order correction",
  "Other",
];

export default function ManageOrderModal({
  order,
  onClose,
  onUpdated,
}: Props) {
  const [
    details,
    setDetails,
  ] =
    useState<DetailedOrder | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [mode, setMode] =
    useState<
      "cancel" | "modify"
    >("modify");

  const [reason, setReason] =
    useState("");

  const [otherReason, setOtherReason] =
    useState("");

  const [
    quantities,
    setQuantities,
  ] = useState<
    Record<string, number>
  >({});

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const finalReason =
    reason === "Other"
      ? otherReason.trim()
      : reason.trim();

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/admin/order-details?orderId=${encodeURIComponent(
              order.id
            )}`,
            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            result.error ||
              "Unable to load order."
          );
          return;
        }

        const loadedOrder =
          result.order as DetailedOrder;

        setDetails(loadedOrder);

        const startingQuantities:
          Record<string, number> = {};

        (
          loadedOrder.cart || []
        ).forEach((item) => {
          startingQuantities[
            item.id
          ] = item.quantity;
        });

        setQuantities(
          startingQuantities
        );
      } catch (error) {
        console.error(
          "Load order error:",
          error
        );

        setError(
          "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadOrder();
  }, [order.id]);

  async function cancelOrder() {
    if (!finalReason) {
      setError(
        "Please choose a cancellation reason."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Cancel order ${order.order_number}?`
      );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response =
        await fetch(
          "/api/admin/manage-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action:
                "cancel_order",
              orderId:
                order.id,
              reason:
                finalReason,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.error ||
            "Unable to cancel order."
        );
        return;
      }

      setMessage(
        result.message ||
          "Order cancelled."
      );

      onUpdated();
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setError(
        "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function modifyItem(
    item: CartItem
  ) {
    const newQuantity =
      Number(
        quantities[item.id]
      );

    if (
      newQuantity >=
      item.quantity
    ) {
      setError(
        "Choose a lower quantity to remove or reduce this item."
      );
      return;
    }

    if (newQuantity < 0) {
      return;
    }

    if (!finalReason) {
      setError(
        "Please choose a reason."
      );
      return;
    }

    const removed =
      item.quantity -
      newQuantity;

    const description =
      newQuantity === 0
        ? `Remove ${item.name} from order ${order.order_number}?`
        : `Reduce ${item.name} by ${removed} on order ${order.order_number}?`;

    const confirmed =
      window.confirm(
        description
      );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response =
        await fetch(
          "/api/admin/manage-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              action:
                "modify_item",

              orderId:
                order.id,

              itemId:
                item.id,

              newQuantity,

              reason:
                finalReason,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.error ||
            "Unable to modify order."
        );
        return;
      }

      setMessage(
        result.message ||
          "Order updated."
      );

      onUpdated();

      /*
       * Reload the order inside
       * the modal so the items
       * and totals refresh.
       */
      const refreshed =
        await fetch(
          `/api/admin/order-details?orderId=${encodeURIComponent(
            order.id
          )}`,
          {
            cache: "no-store",
          }
        );

      const refreshedResult =
        await refreshed.json();

      if (
        refreshed.ok &&
        refreshedResult.success
      ) {
        const updatedOrder =
          refreshedResult.order as DetailedOrder;

        setDetails(
          updatedOrder
        );

        const updatedQuantities:
          Record<
            string,
            number
          > = {};

        (
          updatedOrder.cart || []
        ).forEach((cartItem) => {
          updatedQuantities[
            cartItem.id
          ] =
            cartItem.quantity;
        });

        setQuantities(
          updatedQuantities
        );
      }
    } catch (error) {
      console.error(
        "Modify order error:",
        error
      );

      setError(
        "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-blue-300/20 bg-[#0b1b30] p-6 shadow-2xl sm:p-8">

        <div className="mb-7 flex items-start justify-between gap-4">

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-blue-300">
              Order Management
            </p>

            <h2 className="text-3xl font-black text-white">
              Manage Order
            </h2>

            <p className="mt-2 text-white/50">
              {order.order_number}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            ×
          </button>

        </div>

        {loading ? (
          <div className="py-12 text-center text-white/50">
            Loading order...
          </div>
        ) : !details ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-200">
            {error ||
              "Order could not be loaded."}
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Customer
                </p>

                <p className="mt-2 font-bold">
                  {details.first_name}{" "}
                  {details.last_name}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Status
                </p>

                <p className="mt-2 font-bold capitalize text-blue-200">
                  {details.status.replaceAll(
                    "_",
                    " "
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Current Total
                </p>

                <p className="mt-2 text-xl font-black text-blue-300">
                  $
                  {Number(
                    details.total || 0
                  ).toFixed(2)}
                </p>
              </div>

            </div>

            {Number(
              details.refund_amount ||
                0
            ) > 0 && (
              <div className="mb-6 rounded-2xl border border-orange-300/20 bg-orange-500/10 p-5">

                <p className="text-xs uppercase tracking-widest text-orange-200">
                  Refund
                </p>

                <p className="mt-2 text-xl font-black text-orange-200">
                  $
                  {Number(
                    details.refund_amount
                  ).toFixed(2)}
                </p>

                <p className="mt-1 text-sm capitalize text-orange-100/70">
                  Status:{" "}
                  {details.refund_status ||
                    "pending"}
                </p>

              </div>
            )}

            {details.status ===
            "cancelled" ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6">

                <p className="font-black text-red-200">
                  This order has been cancelled.
                </p>

                {details.cancellation_reason && (
                  <p className="mt-2 text-sm text-red-100/70">
                    {
                      details.cancellation_reason
                    }
                  </p>
                )}

              </div>
            ) : (
              <>
                <div className="mb-6 flex gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setMode(
                        "modify"
                      )
                    }
                    className={`rounded-full px-5 py-3 text-sm font-black transition ${
                      mode ===
                      "modify"
                        ? "bg-blue-400 text-[#081526]"
                        : "border border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    Modify Items
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setMode(
                        "cancel"
                      )
                    }
                    className={`rounded-full px-5 py-3 text-sm font-black transition ${
                      mode ===
                      "cancel"
                        ? "bg-red-400 text-[#081526]"
                        : "border border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    Cancel Entire Order
                  </button>

                </div>

                <div className="mb-6">

                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                    Reason
                  </label>

                  <select
                    value={reason}
                    onChange={(
                      event
                    ) => {
                      setReason(
                        event.target
                          .value
                      );

                      setError("");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-[#10223a] px-5 py-4 text-white outline-none focus:border-blue-300/50"
                  >
                    <option value="">
                      Select a reason
                    </option>

                    {REASONS.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>

                  {reason ===
                    "Other" && (
                    <textarea
                      value={
                        otherReason
                      }
                      onChange={(
                        event
                      ) =>
                        setOtherReason(
                          event
                            .target
                            .value
                        )
                      }
                      rows={3}
                      placeholder="Enter reason..."
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-blue-300/50"
                    />
                  )}

                </div>

                {mode ===
                "modify" ? (
                  <div>

                    <h3 className="mb-4 text-xl font-black">
                      Order Items
                    </h3>

                    <div className="space-y-4">

                      {details.cart.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                          >

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                              <div className="flex items-center gap-4">

                                {item.image && (
                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.name
                                    }
                                    className="h-16 w-16 rounded-xl bg-white object-contain p-1"
                                  />
                                )}

                                <div>
                                  <p className="font-black text-white">
                                    {
                                      item.name
                                    }
                                  </p>

                                  <p className="mt-1 text-sm text-white/50">
                                    $
                                    {Number(
                                      item.price
                                    ).toFixed(
                                      2
                                    )}{" "}
                                    each
                                  </p>

                                  <p className="mt-1 text-sm text-blue-200">
                                    Current quantity:{" "}
                                    {
                                      item.quantity
                                    }
                                  </p>
                                </div>

                              </div>

                              <div className="flex items-center gap-3">

                                <select
                                  value={
                                    quantities[
                                      item
                                        .id
                                    ] ??
                                    item.quantity
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setQuantities(
                                      (
                                        current
                                      ) => ({
                                        ...current,
                                        [item.id]:
                                          Number(
                                            event
                                              .target
                                              .value
                                          ),
                                      })
                                    )
                                  }
                                  className="rounded-xl border border-white/10 bg-[#10223a] px-4 py-3 text-white"
                                >
                                  {Array.from(
                                    {
                                      length:
                                        item.quantity +
                                        1,
                                    },
                                    (
                                      _,
                                      quantity
                                    ) => (
                                      <option
                                        key={
                                          quantity
                                        }
                                        value={
                                          quantity
                                        }
                                      >
                                        {quantity ===
                                        0
                                          ? "Remove"
                                          : `Qty ${quantity}`}
                                      </option>
                                    )
                                  )}
                                </select>

                                <button
                                  type="button"
                                  onClick={() =>
                                    modifyItem(
                                      item
                                    )
                                  }
                                  disabled={
                                    submitting ||
                                    quantities[
                                      item
                                        .id
                                    ] ===
                                      item.quantity
                                  }
                                  className="rounded-xl bg-blue-400 px-5 py-3 text-sm font-black text-[#081526] hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {submitting
                                    ? "Updating..."
                                    : "Apply"}
                                </button>

                              </div>

                            </div>
                          </div>
                        )
                      )}

                    </div>

                    {details.cart
                      .length ===
                      1 &&
                      details.cart[0]
                        .quantity ===
                        1 && (
                        <p className="mt-4 text-sm text-yellow-200">
                          This order only has one item. Use
                          Cancel Entire Order if you want to
                          remove it.
                        </p>
                      )}

                  </div>
                ) : (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6">

                    <h3 className="text-xl font-black text-red-200">
                      Cancel Entire Order
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-red-100/70">
                      The customer will receive an
                      Apexx cancellation email. If the
                      order was already paid, the order
                      will be marked as having a pending
                      refund.
                    </p>

                    <button
                      type="button"
                      onClick={
                        cancelOrder
                      }
                      disabled={
                        submitting ||
                        !finalReason
                      }
                      className="mt-5 rounded-full bg-red-400 px-6 py-3 font-black text-[#081526] hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>

                  </div>
                )}
              </>
            )}

            {message && (
              <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-4 font-bold text-green-200">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 font-bold text-red-200">
                {error}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}