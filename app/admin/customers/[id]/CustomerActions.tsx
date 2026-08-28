"use client";

import { useState } from "react";

type CustomerActionsProps = {
  customerId: string;
  email: string;
  verified: boolean;
};

export default function CustomerActions({
  customerId,
  email,
  verified,
}: CustomerActionsProps) {
  const [sendingVerification, setSendingVerification] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function resendVerification() {
    if (sendingVerification) return;

    const confirmed = window.confirm(
      `Resend the account verification email to ${email}?`
    );

    if (!confirmed) return;

    setSendingVerification(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/customers/${customerId}/resend-verification`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send verification email."
        );
      }

      setMessage(
        data.message ||
          "Verification email sent successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send verification email."
      );
    } finally {
      setSendingVerification(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">

        {!verified && (
          <button
            type="button"
            onClick={resendVerification}
            disabled={sendingVerification}
            className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-5 py-3 text-sm font-bold text-yellow-200 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingVerification
              ? "Sending..."
              : "Resend Verification"}
          </button>
        )}

        <button
          disabled
          className="cursor-not-allowed rounded-xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-200 opacity-50"
        >
          Send Password Reset
        </button>

        <button
          disabled
          className="cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white/60 opacity-50"
        >
          Send Email
        </button>

      </div>

      {message && (
        <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm font-semibold text-green-200">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

    </div>
  );
}