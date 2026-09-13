"use client";

import { useState } from "react";

type DeletedCustomer = {
  id: string;
  auth_user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  account_created_at: string | null;
  deleted_at: string;
  deleted_by: string | null;
  reason: string | null;
};

type DeletedCustomersProps = {
  customers: DeletedCustomer[];
};

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DeletedCustomers({
  customers,
}: DeletedCustomersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] border border-red-400/15 bg-red-500/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/[0.03]"
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-white">
              Deleted Users
            </h2>

            <span className="rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-200">
              {customers.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-white/35">
            View previously deleted customer accounts.
          </p>
        </div>

        <span
          className={`text-lg text-white/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-white/10">
          {customers.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-semibold text-white/50">
                No deleted users
              </p>

              <p className="mt-2 text-sm text-white/30">
                Deleted customer accounts will appear here for tracking.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Deleted
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Reason
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => {
                    const fullName =
                      customer.first_name || customer.last_name
                        ? `${customer.first_name || ""} ${
                            customer.last_name || ""
                          }`.trim()
                        : "—";

                    return (
                      <tr
                        key={customer.id}
                        className="border-b border-white/[0.06]"
                      >
                        <td className="px-6 py-5 font-semibold text-white">
                          {fullName}
                        </td>

                        <td className="px-6 py-5 text-white/65">
                          {customer.email || "—"}
                        </td>

                        <td className="px-6 py-5 text-white/55">
                          {formatDate(customer.account_created_at)}
                        </td>

                        <td className="px-6 py-5 text-red-200/80">
                          {formatDate(customer.deleted_at)}
                        </td>

                        <td className="px-6 py-5 text-white/45">
                          {customer.reason || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}