import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatDate(date?: string | null) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CustomersPage() {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    return (
      <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <a
            href="/admin"
            className="mb-8 inline-block text-sm text-blue-300 hover:text-blue-200"
          >
            ← Back to Dashboard
          </a>

          <h1 className="text-4xl font-black">
            Customers
          </h1>

          <div className="mt-8 rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 text-red-200">
            Unable to load customers: {error.message}
          </div>
        </div>
      </main>
    );
  }

  const customers = users || [];

  const verifiedCustomers = customers.filter(
    (user) => !!user.email_confirmed_at
  ).length;

  const unverifiedCustomers =
    customers.length - verifiedCustomers;

  return (
    <main className="min-h-screen bg-[#081526] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <a
            href="/admin"
            className="mb-6 inline-block text-sm text-blue-300 transition hover:text-blue-200"
          >
            ← Back to Dashboard
          </a>

          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-300">
            Apexx Admin
          </p>

          <h1 className="text-5xl font-black">
            Customers
          </h1>

          <p className="mt-3 text-white/50">
            View Supabase customer accounts and verification status.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-[28px] border border-blue-400/15 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-widest text-white/50">
              Total Accounts
            </p>

            <p className="mt-3 text-4xl font-black">
              {customers.length}
            </p>
          </div>

          <div className="rounded-[28px] border border-green-400/20 bg-green-500/[0.06] p-6">
            <p className="text-sm uppercase tracking-widest text-green-200/70">
              Verified
            </p>

            <p className="mt-3 text-4xl font-black text-green-200">
              {verifiedCustomers}
            </p>
          </div>

          <div className="rounded-[28px] border border-yellow-400/20 bg-yellow-500/[0.07] p-6">
            <p className="text-sm uppercase tracking-widest text-yellow-200/70">
              Awaiting Verification
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-200">
              {unverifiedCustomers}
            </p>
          </div>

        </div>

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-left">

              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Customer
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Email
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Status
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Joined
                  </th>

                  <th className="px-6 py-5 text-xs uppercase tracking-widest text-white/40">
                    Last Sign In
                  </th>
                </tr>
              </thead>

              <tbody>

                {customers.map((user) => {

                  const verified =
                    !!user.email_confirmed_at;

                  const firstName =
                    user.user_metadata?.first_name;

                  const lastName =
                    user.user_metadata?.last_name;

                  const fullName =
                    firstName || lastName
                      ? `${firstName || ""} ${
                          lastName || ""
                        }`.trim()
                      : user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        "—";

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-white/[0.06] transition hover:bg-white/[0.03]"
                    >

                      <td className="px-6 py-5 font-semibold">
                        {fullName}
                      </td>

                      <td className="px-6 py-5 text-white/70">
                        {user.email || "—"}
                      </td>

                      <td className="px-6 py-5">
                        {verified ? (
                          <span className="inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-200">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-200">
                            Awaiting Verification
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-white/60">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="px-6 py-5 text-white/60">
                        {formatDate(
                          user.last_sign_in_at
                        )}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}