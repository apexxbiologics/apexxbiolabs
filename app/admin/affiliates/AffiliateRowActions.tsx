"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AffiliateRowActionsProps = {
  affiliateId: string;
  affiliateName: string;
  status: string;
};

type AffiliateAction =
  | "archive"
  | "unarchive"
  | "delete";

export default function AffiliateRowActions({
  affiliateId,
  affiliateName,
  status,
}: AffiliateRowActionsProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function runAction(
    action: AffiliateAction
  ) {
    setMessage("");
    setLoading(action);

    try {
      const response = await fetch(
        "/api/admin/affiliates/remove",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            affiliateId,
            action,
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

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Affiliate row action error:",
        error
      );

      setMessage(
        "Unable to update affiliate."
      );
    } finally {
      setLoading("");
    }
  }

  async function handleArchive() {
    const confirmed =
      window.confirm(
        `Archive ${affiliateName}? Their affiliate dashboard access will be disabled, but their order and payout history will be preserved.`
      );

    if (!confirmed) {
      return;
    }

    await runAction("archive");
  }

  async function handleUnarchive() {
    const confirmed =
      window.confirm(
        `Unarchive ${affiliateName}? Their affiliate account will become active again and dashboard access will be restored.`
      );

    if (!confirmed) {
      return;
    }

    await runAction("unarchive");
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        `Permanently delete ${affiliateName}? This is only allowed when they have no linked affiliate orders or payouts. Their normal Apexx customer/points account will NOT be deleted.`
      );

    if (!confirmed) {
      return;
    }

    const secondConfirmation =
      window.confirm(
        "This permanently removes the affiliate profile. Continue?"
      );

    if (!secondConfirmation) {
      return;
    }

    await runAction("delete");
  }

  return (
    <div className="inline-flex flex-col items-end gap-2">

      <div className="flex flex-wrap justify-end gap-2">

        {status === "archived" ? (
          <button
            type="button"
            onClick={handleUnarchive}
            disabled={Boolean(loading)}
            className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-200 transition hover:bg-green-500/20 disabled:opacity-40"
          >
            {loading === "unarchive"
              ? "Unarchiving..."
              : "Unarchive"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleArchive}
            disabled={Boolean(loading)}
            className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-yellow-200 transition hover:bg-yellow-500/20 disabled:opacity-40"
          >
            {loading === "archive"
              ? "Archiving..."
              : "Archive"}
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={Boolean(loading)}
          className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-200 transition hover:bg-red-500/20 disabled:opacity-40"
        >
          {loading === "delete"
            ? "Deleting..."
            : "Delete"}
        </button>

      </div>

      {message && (
        <p className="max-w-[280px] text-right text-xs leading-relaxed text-red-200">
          {message}
        </p>
      )}

    </div>
  );
}