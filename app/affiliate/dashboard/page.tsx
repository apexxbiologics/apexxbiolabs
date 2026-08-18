"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env
    .NEXT_PUBLIC_SUPABASE_URL!,
  process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DashboardOrder = {
  orderNumber: string;
  createdAt: string;
  qualifyingSale: number;
  commission: number;
  status: string;
};

type DashboardData = {
  affiliate: {
    name: string;
    email: string;
    code: string;
    discountRate: number;
    commissionRate: number;
    status: string;
    createdAt: string;
  };

  stats: {
    codeUses: number;
    generatedSales: number;
    pendingCommission: number;
    confirmedCommission: number;
  };

  orders: DashboardOrder[];
};

export default function AffiliateDashboardPage() {
  const router = useRouter();

  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.access_token) {
          router.replace(
            "/affiliate/login"
          );
          return;
        }

        const response = await fetch(
          "/api/affiliate/dashboard",
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          if (
            response.status ===
              401 ||
            response.status ===
              403
          ) {
            await supabase.auth.signOut({
              scope: "local",
            });

            router.replace(
              "/affiliate/login"
            );

            return;
          }

          setMessage(
            result.error ||
              "Unable to load affiliate dashboard."
          );

          return;
        }

        setData(result);
      } catch (error) {
        console.error(
          "Affiliate dashboard loading error:",
          error
        );

        setMessage(
          "Unable to load affiliate dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut({
      scope: "local",
    });

    router.push(
      "/affiliate/login"
    );
  }

  function formatMoney(
    amount: number
  ) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(amount);
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
        <p className="text-blue-200 uppercase tracking-[0.25em] text-sm">
          Loading Affiliate Dashboard...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#081526] text-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-black mb-4">
            Affiliate Dashboard
          </h1>

          <p className="text-white/60">
            {message ||
              "Unable to load your affiliate account."}
          </p>

          <a
            href="/affiliate/login"
            className="inline-block mt-6 rounded-full bg-blue-500 px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-all"
          >
            Return to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#081526] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-4">
              Apexx Affiliate Program
            </p>

            <h1 className="text-5xl md:text-6xl font-black">
              Welcome,{" "}
              {data.affiliate.name}
            </h1>

            <p className="text-white/60 mt-4">
              Track your affiliate code,
              qualifying sales, and
              commissions.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-white/70 text-sm uppercase tracking-widest hover:bg-white/[0.08] transition-all w-fit"
          >
            Sign Out
          </button>
        </div>

        <section className="rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-blue-500/15 via-white/[0.05] to-white/[0.03] p-8 mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-3">
            Your Affiliate Code
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-4xl md:text-5xl font-black text-white">
                {data.affiliate.code}
              </p>

              <p className="text-white/50 mt-3">
                Customers receive{" "}
                {Math.round(
                  data.affiliate
                    .discountRate *
                    100
                )}
                % off when using your
                code.
              </p>
            </div>

            <div className="rounded-[24px] border border-blue-300/20 bg-[#081526]/50 px-6 py-5">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Commission Rate
              </p>

              <p className="text-3xl font-black text-blue-300 mt-2">
                {Math.round(
                  data.affiliate
                    .commissionRate *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Code Uses
            </p>

            <p className="text-4xl font-black mt-3">
              {data.stats.codeUses}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Sales Generated
            </p>

            <p className="text-4xl font-black text-blue-300 mt-3">
              {formatMoney(
                data.stats
                  .generatedSales
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-yellow-300/15 bg-yellow-400/[0.06] p-6">
            <p className="text-xs uppercase tracking-widest text-yellow-100/60">
              Pending Commission
            </p>

            <p className="text-4xl font-black text-yellow-200 mt-3">
              {formatMoney(
                data.stats
                  .pendingCommission
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-green-300/15 bg-green-400/[0.06] p-6">
            <p className="text-xs uppercase tracking-widest text-green-100/60">
              Confirmed Commission
            </p>

            <p className="text-4xl font-black text-green-300 mt-3">
              {formatMoney(
                data.stats
                  .confirmedCommission
              )}
            </p>
          </div>
        </div>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] overflow-hidden">
          <div className="p-7 border-b border-white/10">
            <h2 className="text-2xl font-black">
              Recent Activity
            </h2>

            <p className="text-white/50 mt-2">
              Orders attributed to your
              affiliate code.
            </p>
          </div>

          {data.orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl font-bold">
                No affiliate orders yet
              </p>

              <p className="text-white/50 mt-2">
                Orders will appear here
                when your code is used.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Order
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Date
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Qualifying Sale
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Commission
                    </th>

                    <th className="p-5 text-xs uppercase tracking-widest text-white/40">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.orders.map(
                    (order) => (
                      <tr
                        key={
                          order.orderNumber
                        }
                        className="border-b border-white/[0.06] last:border-0"
                      >
                        <td className="p-5 font-bold">
                          {
                            order.orderNumber
                          }
                        </td>

                        <td className="p-5 text-white/60">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>

                        <td className="p-5">
                          {formatMoney(
                            order.qualifyingSale
                          )}
                        </td>

                        <td className="p-5 font-bold text-blue-300">
                          {formatMoney(
                            order.commission
                          )}
                        </td>

                        <td className="p-5">
                          <span className="capitalize">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
          
        </section>

        <p className="text-white/40 text-sm mt-6">
          Pending commissions become
          confirmed after payment is
          received and verified.
        </p>
      </div>
    </main>
  );
}