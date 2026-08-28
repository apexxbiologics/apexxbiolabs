import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import CustomerActions from "./CustomerActions";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatDate(date?: string | null) {
  if (!date) return "Never";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerPage({
  params,
}: CustomerPageProps) {
  const { id } = await params;

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.admin.getUserById(id);

  if (error || !user) {
    notFound();
  }

  const email = user.email || "";

  const verified =
    !!user.email_confirmed_at;

  const { data: orders } = email
    ? await supabaseAdmin
        .from("orders")
        .select("*")
        .ilike("customer_email", email)
        .order("created_at", {
          ascending: false,
        })
    : { data: [] };

  const safeOrders = orders || [];

  /*
   * Use Supabase Auth metadata first.
   * If the account does not have name metadata, fall back to
   * the customer's most recent order.
   */
  const latestOrder =
    safeOrders.length > 0
      ? safeOrders[0]
      : null;

  const firstName =
    user.user_metadata?.first_name ||
    latestOrder?.first_name ||
    "";

  const lastName =
    user.user_metadata?.last_name ||
    latestOrder?.last_name ||
    "";

  const fullName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Customer";

  const totalSpent = safeOrders.reduce(
    (sum, order) => {
      const status = String(
        order.status || ""
      ).toLowerCase();

      if (
        status === "paid" ||
        status === "shipped" ||
        status === "payment received"
      ) {
        return sum + Number(order.total || 0);
      }

      return sum;
    },
    0
  );

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* BACK */}

        <a
          href="/admin/customers"
          className="mb-8 inline-block text-sm text-blue-300 transition hover:text-blue-200"
        >
          ← Back to Customers
        </a>

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-300">
              Apexx Customer
            </p>

            <h1 className="text-4xl font-black md:text-5xl">
              {fullName}
            </h1>

            <p className="mt-3 text-lg text-white/50">
              {email}
            </p>
          </div>

          {verified ? (
            <span className="w-fit rounded-full border border-green-400/20 bg-green-500/10 px-5 py-2 text-sm font-bold text-green-200">
              ● Verified Account
            </span>
          ) : (
            <span className="w-fit rounded-full border border-yellow-400/20 bg-yellow-500/10 px-5 py-2 text-sm font-bold text-yellow-200">
              ● Awaiting Verification
            </span>
          )}

        </div>

        {/* ACCOUNT STATS */}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Account Created
            </p>

            <p className="mt-3 font-semibold">
              {formatDate(user.created_at)}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Email Verified
            </p>

            <p className="mt-3 font-semibold">
              {verified
                ? formatDate(
                    user.email_confirmed_at
                  )
                : "Not verified"}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Last Sign In
            </p>

            <p className="mt-3 font-semibold">
              {formatDate(
                user.last_sign_in_at
              )}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Customer ID
            </p>

            <p className="mt-3 truncate text-sm text-white/60">
              {user.id}
            </p>
          </div>

        </div>

        {/* CUSTOMER OVERVIEW */}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ACCOUNT */}

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 lg:col-span-2">

            <h2 className="mb-6 text-2xl font-black">
              Account Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  First Name
                </p>

                <p className="mt-2 font-semibold">
                  {firstName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Last Name
                </p>

                <p className="mt-2 font-semibold">
                  {lastName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Email
                </p>

                <p className="mt-2 break-all font-semibold">
                  {email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/35">
                  Provider
                </p>

                <p className="mt-2 font-semibold capitalize">
                  {user.app_metadata?.provider ||
                    "email"}
                </p>
              </div>

            </div>

          </div>

          {/* PURCHASE SUMMARY */}

          <div className="rounded-[30px] border border-blue-400/15 bg-blue-500/[0.05] p-7">

            <p className="text-xs uppercase tracking-widest text-blue-200/60">
              Customer Activity
            </p>

            <div className="mt-7">

              <p className="text-sm text-white/45">
                Orders
              </p>

              <p className="mt-1 text-4xl font-black">
                {safeOrders.length}
              </p>

            </div>

            <div className="mt-7">

              <p className="text-sm text-white/45">
                Total Paid
              </p>

              <p className="mt-1 text-3xl font-black text-blue-300">
                ${totalSpent.toFixed(2)}
              </p>

            </div>

          </div>

        </div>

        {/* ADMIN ACTIONS */}

        <div className="mb-8 rounded-[30px] border border-white/10 bg-white/[0.04] p-7">

          <div className="mb-6">

            <h2 className="text-2xl font-black">
              Customer Actions
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Manage this customer&apos;s account
              and email communication.
            </p>

          </div>

          <CustomerActions
            customerId={user.id}
            email={email}
            verified={verified}
          />

        </div>

        {/* ORDERS */}

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]">

          <div className="border-b border-white/10 p-7">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-2xl font-black">
                  Order History
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {safeOrders.length} order
                  {safeOrders.length === 1
                    ? ""
                    : "s"}{" "}
                  associated with this email.
                </p>
              </div>

            </div>

          </div>

          {safeOrders.length === 0 ? (

            <div className="px-7 py-14 text-center">

              <p className="font-semibold text-white/50">
                No orders found
              </p>

              <p className="mt-2 text-sm text-white/30">
                This account has not placed an
                order using this email address.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="border-b border-white/10 bg-white/[0.03]">

                  <tr>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/35">
                      Total
                    </th>

                    <th className="px-6 py-4 text-right text-xs uppercase tracking-widest text-white/35">
                      View
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {safeOrders.map(
                    (order: any) => (

                      <tr
                        key={order.id}
                        className="border-b border-white/[0.06]"
                      >

                        <td className="px-6 py-5 font-semibold">
                          {order.order_number ||
                            order.id}
                        </td>

                        <td className="px-6 py-5 text-white/60">
                          {formatDate(
                            order.created_at
                          )}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold">
                            {order.status ||
                              "Unknown"}
                          </span>

                        </td>

                        <td className="px-6 py-5 font-semibold">
                          $
                          {Number(
                            order.total || 0
                          ).toFixed(2)}
                        </td>

                        <td className="px-6 py-5 text-right">

                          <a
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-semibold text-blue-300 hover:text-blue-200"
                          >
                            View →
                          </a>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </main>
  );
}