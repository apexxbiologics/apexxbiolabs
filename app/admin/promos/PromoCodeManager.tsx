
"use client";

import { useEffect, useState } from "react";
import { BadgePercent, Plus, RefreshCw, ChevronDown } from "lucide-react";

type PromoCode = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  times_used: number;
  active: boolean;
};

const emptyForm = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: "",
  starts_at: "",
  ends_at: "",
  usage_limit: "",
};

// Browser automatically includes the existing admin session cookie.
function adminHeaders(json = false): HeadersInit {
  return json ? { "Content-Type": "application/json" } : {};
}

function getStatus(promo: PromoCode) {
  const now = Date.now();

  if (!promo.active) return "Disabled";

  if (
    promo.starts_at &&
    now < new Date(promo.starts_at).getTime()
  ) {
    return "Scheduled";
  }

  if (
    promo.ends_at &&
    now >= new Date(promo.ends_at).getTime()
  ) {
    return "Expired";
  }

  if (
    promo.usage_limit !== null &&
    promo.times_used >= promo.usage_limit
  ) {
    return "Used Up";
  }

  return "Active";
}

function formatDate(date: string | null) {
  if (!date) return "No limit";
  return new Date(date).toLocaleString();
}

export default function PromoCodeManager() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [, setClock] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [promoHistoryOpen, setPromoHistoryOpen] = useState(false);

  async function loadPromos() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/promo-codes",
        { cache: "no-store", credentials: "same-origin", headers: adminHeaders() }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load promo codes."
        );
      }

      setPromos(data.promoCodes || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Loading failed."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPromos();
    const interval = window.setInterval(() => setClock((n) => n + 1), 15000);
    return () => window.clearInterval(interval);
  }, []);

  async function createPromo() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const code = form.code.trim().toUpperCase();
      const value = Number(form.discount_value);

      if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
        throw new Error(
          "Enter a code with 3–40 letters, numbers, hyphens, or underscores."
        );
      }

      if (
        !Number.isFinite(value) ||
        value <= 0 ||
        (form.discount_type === "percentage" && value > 100)
      ) {
        throw new Error("Enter a valid discount amount.");
      }

      const startsAt = form.starts_at
        ? new Date(form.starts_at)
        : null;

      const endsAt = form.ends_at
        ? new Date(form.ends_at)
        : null;

      if (
        (startsAt && !Number.isFinite(startsAt.getTime())) ||
        (endsAt && !Number.isFinite(endsAt.getTime()))
      ) {
        throw new Error("Enter valid dates.");
      }

      if (startsAt && endsAt && endsAt <= startsAt) {
        throw new Error("End date must be after start date.");
      }

      const response = await fetch(
        "/api/admin/promo-codes",
        {
          method: "POST",
          credentials: "same-origin",
          headers: adminHeaders(true),
          body: JSON.stringify({
            code,
            discount_type: form.discount_type,
            discount_value: value,
            starts_at: startsAt?.toISOString() || null,
            ends_at: endsAt?.toISOString() || null,
            usage_limit: form.usage_limit
              ? Number(form.usage_limit)
              : null,
            active: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to create promo code."
        );
      }

      setForm({ ...emptyForm });
      setMessage(`Promo code ${code} created successfully.`);
      await loadPromos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Creation failed."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePromo(promo: PromoCode) {
    try {
      if (!promo.active && promo.ends_at && Date.parse(promo.ends_at) <= Date.now()) {
        throw new Error("This promotion has expired. Create a new promotion with the same code instead.");
      }
      setUpdatingId(promo.id);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/promo-codes",
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: adminHeaders(true),
          body: JSON.stringify({
            id: promo.id,
            active: !promo.active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to update promo code."
        );
      }

      setMessage(
        `${promo.code} ${promo.active ? "disabled" : "enabled"}.`
      );

      await loadPromos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Update failed."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const inputClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-[#0b1b30] px-4 text-sm text-white outline-none focus:border-blue-400/50";

  return (
    <div className="mt-8 space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-blue-400/15 bg-white/[0.04]">
        <div className="border-b border-white/10 p-7 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <BadgePercent size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
                Customer Discounts
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Promo Code Manager
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/50">
            Create percentage or fixed-dollar promo codes,
            schedule availability, and set usage limits.
          </p>
        </div>

        <div className="grid gap-5 p-7 md:grid-cols-2 md:p-8">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-white/75">
              Promo Code
            </span>
            <input
              className={inputClass}
              placeholder="Example: HOLIDAY15"
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase(),
                })
              }
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-white/75">
              Discount Type
            </span>
            <select
              className={inputClass}
              value={form.discount_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_type: e.target.value as
                    | "percentage"
                    | "fixed",
                })
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-white/75">
              Discount Amount
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className={inputClass}
              placeholder={
                form.discount_type === "percentage"
                  ? "Example: 15"
                  : "Example: 20"
              }
              value={form.discount_value}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_value: e.target.value,
                })
              }
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-white/75">
              Start Date (Optional)
            </span>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.starts_at}
              onChange={(e) =>
                setForm({
                  ...form,
                  starts_at: e.target.value,
                })
              }
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-white/75">
              End Date (Optional)
            </span>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.ends_at}
              onChange={(e) =>
                setForm({
                  ...form,
                  ends_at: e.target.value,
                })
              }
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-white/75">
              Uses Per Customer (Optional)
            </span>
            <input
              type="number"
              min="1"
              step="1"
              className={inputClass}
              placeholder="Leave blank for unlimited uses per customer"
              value={form.usage_limit}
              onChange={(e) =>
                setForm({
                  ...form,
                  usage_limit: e.target.value,
                })
              }
            />
          </label>

          <div className="md:col-span-2">
            <button
              onClick={createPromo}
              disabled={saving}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-blue-500 px-6 text-sm font-black text-white transition hover:bg-blue-400 disabled:opacity-50"
            >
              <Plus size={18} />
              {saving ? "Creating..." : "Create Promo Code"}
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] p-4 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.08] p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="rounded-[32px] border border-blue-400/15 bg-white/[0.04]">
        <div className="flex items-center justify-between gap-4 p-7 md:p-8">
          <button
            type="button"
            onClick={() => setPromoHistoryOpen((open) => !open)}
            aria-expanded={promoHistoryOpen}
            className="flex flex-1 items-center justify-between gap-4 text-left"
          >
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300">
              Promotion History
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Your Promo Codes
            </h2>
          </div>
          <ChevronDown size={20} className={`shrink-0 text-blue-300 transition-transform ${promoHistoryOpen ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={loadPromos}
            disabled={loading}
            className="rounded-xl border border-blue-400/20 p-3 text-blue-300 disabled:opacity-50"
            title="Refresh promo codes"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {promoHistoryOpen && (loading ? (
          <p className="border-t border-white/10 p-8 text-sm text-white/50">
            Loading promo codes...
          </p>
        ) : promos.length === 0 ? (
          <p className="p-8 text-sm text-white/50">
            No promo codes created yet.
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {promos.map((promo) => {
              const status = getStatus(promo);

              return (
                <div
                  key={promo.id}
                  className="flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between md:p-8"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-blue-200">
                        {promo.code}
                      </h3>

                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                        {status}
                      </span>
                    </div>

                    <p className="mt-3 text-lg font-bold">
                      {promo.discount_type === "percentage"
                        ? `${promo.discount_value}% OFF`
                        : `$${Number(promo.discount_value).toFixed(2)} OFF`}
                    </p>

                    <p className="mt-2 text-sm text-white/50">
                      Used {promo.times_used} /{" "}
                      {promo.usage_limit ?? "Unlimited"}
                    </p>

                    <p className="mt-2 text-xs text-white/40">
                      Starts: {formatDate(promo.starts_at)}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Ends: {formatDate(promo.ends_at)}
                    </p>
                  </div>

                  <button
                    onClick={() => togglePromo(promo)}
                    disabled={updatingId === promo.id}
                    className={
                      "rounded-xl border px-5 py-3 text-sm font-bold transition disabled:opacity-50 " +
                      (promo.active
                        ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                        : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20")
                    }
                  >
                    {updatingId === promo.id
                      ? "Updating..."
                      : promo.active
                        ? "Disable Code"
                        : "Enable Code"}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </section>
    </div>
  );
}
