"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AffiliateControlsProps = {
  affiliateId: string;
  status: string;
  discountRate: number;
  commissionRate: number;
};

export default function AffiliateControls({
  affiliateId,
  status,
  discountRate,
  commissionRate,
}: AffiliateControlsProps) {
  const router = useRouter();

  const [discountPercent, setDiscountPercent] =
    useState(
      String(
        Math.round(
          Number(discountRate || 0) * 100
        )
      )
    );

  const [commissionPercent, setCommissionPercent] =
    useState(
      String(
        Math.round(
          Number(commissionRate || 0) * 100
        )
      )
    );

  const [loadingAction, setLoadingAction] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function runAction(
    payload: Record<string, unknown>,
    actionName: string
  ) {
    setMessage("");
    setLoadingAction(actionName);

    try {
      const response = await fetch(
        "/api/admin/affiliates/update",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            affiliateId,
            ...payload,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.error ||
            "Unable to update affiliate."
        );

        return false;
      }

      router.refresh();

      return true;
    } catch (error) {
      console.error(
        "Affiliate control error:",
        error
      );

      setMessage(
        "Unable to update affiliate."
      );

      return false;
    } finally {
      setLoadingAction("");
    }
  }

  async function handleDiscountUpdate() {
    const value =
      Number(discountPercent);

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      setMessage(
        "Discount must be between 0 and 100."
      );

      return;
    }

    const success =
      await runAction(
        {
          action:
            "update_discount",
          discountPercent:
            value,
        },
        "discount"
      );

    if (success) {
      setMessage(
        "Customer discount updated."
      );
    }
  }

  async function handleCommissionUpdate() {
    const value =
      Number(commissionPercent);

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      setMessage(
        "Commission must be between 0 and 100."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Change this affiliate's commission rate to ${value}%?`
      );

    if (!confirmed) {
      return;
    }

    const success =
      await runAction(
        {
          action:
            "update_commission",
          commissionPercent:
            value,
        },
        "commission"
      );

    if (success) {
      setMessage(
        "Affiliate commission rate updated."
      );
    }
  }

  async function handleSuspend() {
    const confirmed =
      window.confirm(
        "Suspend this affiliate? Their affiliate dashboard access will be blocked until you reactivate them."
      );

    if (!confirmed) {
      return;
    }

    const success =
      await runAction(
        {
          action: "suspend",
        },
        "suspend"
      );

    if (success) {
      setMessage(
        "Affiliate suspended."
      );
    }
  }

  async function handleReactivate() {
    const confirmed =
      window.confirm(
        "Reactivate this affiliate?"
      );

    if (!confirmed) {
      return;
    }

    const success =
      await runAction(
        {
          action: "reactivate",
        },
        "reactivate"
      );

    if (success) {
      setMessage(
        "Affiliate reactivated."
      );
    }
  }

  async function handleResendInvite() {
    const confirmed =
      window.confirm(
        "Resend this affiliate invitation?"
      );

    if (!confirmed) {
      return;
    }

    const success =
      await runAction(
        {
          action:
            "resend_invite",
        },
        "resend"
      );

    if (success) {
      setMessage(
        "Affiliate invitation resent."
      );
    }
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7">
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
          Affiliate Controls
        </p>

        <h2 className="mt-3 text-3xl font-black">
          Manage Affiliate
        </h2>

        <p className="mt-3 max-w-2xl text-white/50">
          Update this affiliate&apos;s discount and commission rates,
          control account access, or resend an outstanding invitation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-[#0f2035] p-5">
          <p className="text-xs font-black uppercase tracking-widest text-white/40">
            Customer Discount
          </p>

          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={
                  discountPercent
                }
                onChange={(event) =>
                  setDiscountPercent(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 pr-12 text-white outline-none focus:border-blue-400/50"
              />

              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40">
                %
              </span>
            </div>

            <button
              type="button"
              onClick={
                handleDiscountUpdate
              }
              disabled={
                loadingAction ===
                "discount"
              }
              className="rounded-2xl bg-blue-500 px-5 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-blue-400 disabled:opacity-40"
            >
              {loadingAction ===
              "discount"
                ? "Saving..."
                : "Save"}
            </button>
          </div>

          <p className="mt-3 text-sm text-white/40">
            This changes the discount customers receive when they use the affiliate code.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#0f2035] p-5">
          <p className="text-xs font-black uppercase tracking-widest text-white/40">
            Commission Rate
          </p>

          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={
                  commissionPercent
                }
                onChange={(event) =>
                  setCommissionPercent(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 pr-12 text-white outline-none focus:border-blue-400/50"
              />

              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40">
                %
              </span>
            </div>

            <button
              type="button"
              onClick={
                handleCommissionUpdate
              }
              disabled={
                loadingAction ===
                "commission"
              }
              className="rounded-2xl bg-blue-500 px-5 py-4 text-xs font-black uppercase tracking-widest transition hover:bg-blue-400 disabled:opacity-40"
            >
              {loadingAction ===
              "commission"
                ? "Saving..."
                : "Save"}
            </button>
          </div>

          <p className="mt-3 text-sm text-white/40">
            This affects commission calculations for future affiliate orders.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {status === "active" && (
          <button
            type="button"
            onClick={
              handleSuspend
            }
            disabled={
              loadingAction ===
              "suspend"
            }
            className="rounded-[22px] border border-red-400/20 bg-red-500/10 px-6 py-5 text-left transition hover:bg-red-500/15 disabled:opacity-40"
          >
            <p className="font-black text-red-200">
              Suspend Affiliate
            </p>

            <p className="mt-2 text-sm leading-relaxed text-red-100/50">
              Blocks affiliate dashboard access until the account is reactivated.
            </p>
          </button>
        )}

        {status ===
          "suspended" && (
          <button
            type="button"
            onClick={
              handleReactivate
            }
            disabled={
              loadingAction ===
              "reactivate"
            }
            className="rounded-[22px] border border-green-400/20 bg-green-500/10 px-6 py-5 text-left transition hover:bg-green-500/15 disabled:opacity-40"
          >
            <p className="font-black text-green-200">
              Reactivate Affiliate
            </p>

            <p className="mt-2 text-sm leading-relaxed text-green-100/50">
              Restores affiliate dashboard access.
            </p>
          </button>
        )}

        {status ===
          "invited" && (
          <button
            type="button"
            onClick={
              handleResendInvite
            }
            disabled={
              loadingAction ===
              "resend"
            }
            className="rounded-[22px] border border-blue-400/20 bg-blue-500/10 px-6 py-5 text-left transition hover:bg-blue-500/15 disabled:opacity-40"
          >
            <p className="font-black text-blue-200">
              Resend Invitation
            </p>

            <p className="mt-2 text-sm leading-relaxed text-blue-100/50">
              Sends another affiliate activation invitation to this affiliate.
            </p>
          </button>
        )}
      </div>

      {message && (
        <div className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">
          {message}
        </div>
      )}
    </section>
  );
}