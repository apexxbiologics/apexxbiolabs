"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PayoutButtonProps = {
  affiliateId: string;
  amountOwed: number;
};

export default function PayoutButton({
  affiliateId,
  amountOwed,
}: PayoutButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handlePayout() {
    if (amountOwed <= 0) {
      return;
    }

    const confirmed =
      window.confirm(
        `Confirm that you already sent $${amountOwed.toFixed(
          2
        )} to this affiliate through Zelle.`
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/affiliates/payout",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            affiliateId,
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
            "Unable to record affiliate payout."
        );

        setLoading(false);
        return;
      }

      setMessage(
        `$${Number(
          result.payout?.amount || 0
        ).toFixed(
          2
        )} Zelle payout recorded successfully.`
      );

      /*
       * Refresh the server page so
       * Amount Owed and Paid Out update.
       */
      router.refresh();
    } catch (error) {
      console.error(
        "Affiliate payout error:",
        error
      );

      setMessage(
        "Unable to record affiliate payout."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePayout}
        disabled={
          loading ||
          amountOwed <= 0
        }
        className="w-full rounded-full bg-blue-500 px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading
          ? "Recording Payout..."
          : amountOwed > 0
          ? `Mark $${amountOwed.toFixed(
              2
            )} Paid via Zelle`
          : "Nothing Owed"}
      </button>

      {message && (
        <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">
          {message}
        </div>
      )}
    </div>
  );
}